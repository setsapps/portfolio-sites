import { Injectable, InjectionToken, inject, signal, effect, Directive, ElementRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/* ---------- safe storage ---------- */
export const store = {
  get(k: string): string | null { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

/* ---------- themes ---------- */
export interface ThemeDef { id: string; label: string; swatch: [string, string, string]; dark?: boolean; }
export interface FontDef { id: string; label: string; display: string; body: string; href?: string; }
export interface SiteConfig {
  key: string;                      // storage namespace
  brand: string;
  dial?: string;                    // phone country code shown in the OTP step
  fonts?: FontDef[];
  fontScale?: number;               // root text scale (0.9 = one step smaller)                // premium font pairings (first = default, already loaded)
  themes: ThemeDef[];
  lockMode: 'email' | 'otp-referral';
  lockTitle: string;
  lockNote: string;
}
export const SITE = new InjectionToken<SiteConfig>('SITE');

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private cfg = inject(SITE);
  private doc = inject(DOCUMENT);
  readonly themes = this.cfg.themes;
  readonly theme = signal<string>(this.cfg.themes[0].id);
  readonly fontScale = signal<number>(this.cfg.fontScale ?? 1);
  readonly reduceMotion = signal<boolean>(store.get(this.cfg.key + ':rm') === '1' ||
    (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches));
  readonly fonts = this.cfg.fonts || [];
  readonly font = signal<string>(this.fonts[0]?.id || '');
  /** inject Google Fonts stylesheets on demand (for previews in the picker and for the chosen pair) */
  loadFont(id: string) {
    const f = this.fonts.find(x => x.id === id); if (!f?.href) return;
    const lid = 'font-' + f.id; if (this.doc.getElementById(lid)) return;
    const l = this.doc.createElement('link'); l.id = lid; l.rel = 'stylesheet'; l.href = f.href; this.doc.head.appendChild(l);
  }
  constructor() {
    effect(() => {
      const f = this.fonts.find(x => x.id === this.font()); const st = this.doc.documentElement.style;
      if (!f || f.id === this.fonts[0]?.id) { st.removeProperty('--font-display'); st.removeProperty('--font-body'); }
      else { this.loadFont(f.id); st.setProperty('--font-display', f.display); st.setProperty('--font-body', f.body); }
      if (f) store.set(this.cfg.key + ':font', f.id);
    });
    effect(() => {
      const t = this.theme(); const html = this.doc.documentElement;
      html.setAttribute('data-theme', t);
      html.style.colorScheme = this.themes.find(x => x.id === t)?.dark ? 'dark' : 'light';
      store.set(this.cfg.key + ':theme', t);
    });
    effect(() => { this.doc.documentElement.style.fontSize = (this.fontScale() * 100) + '%'; store.set(this.cfg.key + ':fs', String(this.fontScale())); });
    effect(() => { this.doc.documentElement.classList.toggle('rm', this.reduceMotion()); store.set(this.cfg.key + ':rm', this.reduceMotion() ? '1' : '0'); });
  }
}

/* ---------- toast ---------- */
export interface Toast { id: number; text: string; kind: 'ok' | 'info' | 'warn'; }
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly items = signal<Toast[]>([]);
  private n = 0;
  show(text: string, kind: Toast['kind'] = 'info') {
    const id = ++this.n; this.items.update(l => [...l, { id, text, kind }]);
    setTimeout(() => this.items.update(l => l.filter(t => t.id !== id)), 4200);
  }
}

/* ---------- lock (demo gate) ---------- */
@Injectable({ providedIn: 'root' })
export class LockService {
  readonly open = signal(false);
  readonly feature = signal('');
  readonly checkoutOpen = signal(false);
  readonly checkout = signal<{ title: string; amount: number; currency: string; lines?: [string, number][] } | null>(null);
  readonly searchOpen = signal(false);
  readonly cookiePrefsOpen = signal(false);
  gate(feature: string) { this.feature.set(feature); this.open.set(true); }
  pay(title: string, amount: number, currency = 'CAD', lines?: [string, number][]) {
    this.checkout.set({ title, amount, currency, lines }); this.checkoutOpen.set(true);
  }
}

/* ---------- reveal on scroll ---------- */
@Directive({ selector: '[reveal]', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input() reveal: string | number = 0; // delay ms
  private el = inject(ElementRef<HTMLElement>);
  private io?: IntersectionObserver;
  ngAfterViewInit() {
    const e = this.el.nativeElement as HTMLElement;
    e.classList.add('rv'); e.style.transitionDelay = (+this.reveal || 0) + 'ms';
    if (typeof IntersectionObserver === 'undefined') { e.classList.add('in'); return; }
    this.io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { e.classList.add('in'); this.io?.disconnect(); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    this.io.observe(e);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}

/* ---------- count-up (for labels like years, never invented metrics) ---------- */
@Directive({ selector: '[tilt]', standalone: true })
export class TiltDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private off: (() => void)[] = [];
  ngAfterViewInit() {
    const e = this.el.nativeElement as HTMLElement;
    if (typeof matchMedia === 'undefined' || !matchMedia('(pointer:fine)').matches) return;
    const mv = (ev: PointerEvent) => {
      if (document.documentElement.classList.contains('rm')) return;
      const r = e.getBoundingClientRect(); const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      e.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      e.style.setProperty('--gx', (x + .5) * 100 + '%'); e.style.setProperty('--gy', (y + .5) * 100 + '%');
    };
    const lv = () => { e.style.transform = ''; };
    e.addEventListener('pointermove', mv); e.addEventListener('pointerleave', lv);
    this.off.push(() => e.removeEventListener('pointermove', mv), () => e.removeEventListener('pointerleave', lv));
  }
  ngOnDestroy() { this.off.forEach(f => f()); }
}
