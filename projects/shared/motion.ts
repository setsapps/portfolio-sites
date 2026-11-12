import { AfterViewInit, Directive, ElementRef, Injectable, Input, NgZone, OnDestroy, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import Lenis from 'lenis';
import { LockService } from './core';

const reduced = () => typeof matchMedia !== 'undefined' && (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('rm'));

/* =========================================================
   MOTION — inertial smooth scrolling (Lenis), scroll progress
   bar, and pauses while dialogs are open. Runs outside Angular.
   ========================================================= */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private zone = inject(NgZone); private doc = inject(DOCUMENT); private router = inject(Router); private lock = inject(LockService);
  lenis?: Lenis; private bar?: HTMLElement;
  init() {
    if (this.lenis || typeof window === 'undefined') return;
    this.bar = this.doc.createElement('div'); this.bar.className = 'scroll-prog'; this.bar.setAttribute('aria-hidden', 'true'); this.doc.body.appendChild(this.bar);
    const prog = () => { const max = this.doc.documentElement.scrollHeight - innerHeight; this.bar!.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; };
    addEventListener('scroll', prog, { passive: true });
    if (!reduced()) {
      this.zone.runOutsideAngular(() => {
        this.lenis = new Lenis({
          duration: 1.25, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true, wheelMultiplier: .95, touchMultiplier: 1.4, anchors: { offset: -90 },
          prevent: (n: HTMLElement) => !!n.closest?.('.dlg,.wrapx,.sr,.bot,.drawer,.pn,.mega,.sheet,.cart,.sl,.pm,.mo,[data-lenis-prevent]'),
        } as any);
        const raf = (t: number) => { this.lenis!.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
      });
    }
    this.router.events.subscribe(e => { if (e instanceof NavigationEnd && !location.hash) this.lenis?.scrollTo(0, { immediate: true, force: true }); });
  }
  constructor() {
    // freeze page scroll while a dialog/overlay is open
    effect(() => {
      const busy = this.lock.open() || this.lock.checkoutOpen() || this.lock.searchOpen() || this.lock.cookiePrefsOpen();
      busy ? this.lenis?.stop() : this.lenis?.start();
    });
  }
}

/* =========================================================
   PARALLAX — gentle depth on images/blocks as they pass.
   [parallax]="0.12" (fraction of viewport travel). GPU-only.
   ========================================================= */
@Directive({ selector: '[parallax]', standalone: true })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  @Input() parallax: number | string = .12;
  private el = inject(ElementRef<HTMLElement>); private zone = inject(NgZone);
  private on = false; private io?: IntersectionObserver; private raf = 0;
  ngAfterViewInit() {
    if (reduced()) return;
    const e = this.el.nativeElement as HTMLElement; e.style.willChange = 'transform';
    this.zone.runOutsideAngular(() => {
      this.io = new IntersectionObserver(([x]) => { this.on = x.isIntersecting; if (this.on) this.loop(); }, { rootMargin: '10% 0px' });
      this.io.observe(e);
    });
  }
  private loop = () => {
    cancelAnimationFrame(this.raf); if (!this.on) return;
    const e = this.el.nativeElement as HTMLElement; const r = e.getBoundingClientRect();
    const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; const k = +this.parallax || .12;
    e.style.transform = `translate3d(0,${(-c * k * 100).toFixed(2)}px,0) scale(${1 + Math.abs(k) * .9})`;
    this.raf = requestAnimationFrame(this.loop);
  };
  ngOnDestroy() { this.on = false; cancelAnimationFrame(this.raf); this.io?.disconnect(); }
}
