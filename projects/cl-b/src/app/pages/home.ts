import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LockService, RevealDirective, TiltDirective, ToastService } from '@shared/core';
import { CHAPTERS, EVENTS, EXPERIENCES, IMG } from '../data';
import type { Journey, FrameScrubber } from '../three-journey';

@Component({
  standalone: true, imports: [RouterLink, DatePipe, RevealDirective, TiltDirective],
  template: `
  <!-- ===== 3D SCROLL JOURNEY ===== -->
  <section class="journey" #journey aria-label="Interactive 3D journey: mountains, lake, lodge and aurora">
    <div class="stage">
      <canvas #c3d class="cv" [class.off]="mode()!=='3d'" aria-hidden="true"></canvas>
      <canvas #cvid class="cv" [class.off]="mode()!=='video'" aria-hidden="true"></canvas>
      <div class="vign" aria-hidden="true"></div>
      @if (!ready()) { <div class="loader" role="status"><span></span>Rendering the valley…</div> }

      <div class="hero" [style.opacity]="heroOp()" [style.transform]="'translateY(' + (-p()*600) + 'px)'" [attr.aria-hidden]="heroOp() < .1">
        <div class="wrap">
          <span class="kick">Tourism &amp; hospitality collective</span>
          <h1><span class="l1">Journeys that</span><span class="l2"><em class="serif">host</em> the world</span></h1>
          <p>Scroll to travel from dawn over the peaks to aurora over the lodge, rendered live in your browser.</p>
          <div class="hb"><a class="btn btn-p" routerLink="/experiences">Explore experiences</a><button class="btn btn-o" (click)="skip()">Skip the journey ↓</button></div>
        </div>
      </div>

      @for (c of chapters; track c.n; let i = $index) {
        <article class="chap" [class.on]="chap()===i && heroOp() < .2" [class.right]="i%2===1" [attr.aria-hidden]="chap()!==i">
          <span class="n">{{ c.n }} · {{ c.k }}</span>
          <h2>{{ c.t }}</h2>
          <p>{{ c.d }}</p>
          @if (i===2) { <button class="btn btn-p" (click)="lock.pay('Lakeside Timber Lodge · 1 night', 420, 'CAD', [['Cabin for two', 420], ['Taxes & fees', 0]])">Book the lodge</button> }
          @if (i===3) { <button class="btn btn-p" (click)="lock.gate('Aurora alerts')">🔔 Get aurora alerts</button> }
          @if (i===4) { <a class="btn btn-p" routerLink="/events">Plan a group journey</a> }
        </article>
      }

      <nav class="rail" aria-label="Journey chapters">
        @for (c of chapters; track c.n; let i = $index) {
          <button [class.on]="chap()===i" (click)="goChapter(i)" [attr.aria-label]="'Go to chapter ' + c.k"><span>{{ c.k }}</span><i></i></button>
        }
        <div class="bar" aria-hidden="true"><i [style.transform]="'scaleY(' + p() + ')'"></i></div>
      </nav>

      <div class="hud" aria-hidden="true"><span>{{ (p()*100).toFixed(0) }}%</span><span>{{ timeOfDay() }}</span></div>
      @if (hasVideo()) {
        <div class="mode glass" role="group" aria-label="Render mode"><button [attr.aria-pressed]="mode()==='3d'" (click)="mode.set('3d')">Real-time 3D</button><button [attr.aria-pressed]="mode()==='video'" (click)="mode.set('video')">Cinematic</button></div>
      }
      <button class="pause glass" (click)="togglePause()" [attr.aria-pressed]="paused()" [attr.aria-label]="paused() ? 'Resume 3D animation' : 'Pause 3D animation'">{{ paused() ? '▶' : '❚❚' }}</button>
    </div>
  </section>

  <!-- ===== AFTER THE JOURNEY ===== -->
  <section class="sec" id="after" aria-labelledby="h-x">
    <div class="wrap">
      <div class="sec-h" reveal><div><span class="kick">Curated experiences</span><h2 id="h-x">Stay. Explore. <span class="serif grad-text">Linger.</span></h2></div><p>Hand-picked stays and adventures from hosts across the region, bookable in a few taps.</p></div>
      <div class="xg">
        @for (e of exps; track e.id; let i = $index) {
          <article class="xc" [class]="'xc x' + i" tilt [reveal]="i*80">
            <img [src]="e.img" alt="" loading="lazy">
            <div class="xin"><span class="tag">{{ e.cat }}</span><h3>{{ e.title }}</h3><p>{{ e.place }}</p>
              <div class="xf"><b>From {{ '$' + e.price }}</b><button class="btn btn-p" (click)="lock.pay(e.title, e.price, 'CAD', [[e.title, e.price]])">Book</button></div></div>
            <button class="heart" (click)="lock.gate('Wishlist')" [attr.aria-label]="'Save ' + e.title">♡</button>
          </article>
        }
      </div>
      <div style="text-align:center;margin-top:30px" reveal><a class="btn btn-o" routerLink="/experiences">See all experiences →</a></div>
    </div>
  </section>

  <section class="marq" aria-hidden="true"><div class="mt">@for (w of words; track $index) {<span>{{ w }}</span><i>✦</i>}</div></section>

  <section class="sec" aria-labelledby="h-a">
    <div class="wrap split">
      <div reveal>
        <span class="kick">For hosts &amp; partners</span>
        <h2 id="h-a" class="big-h">A platform built for <span class="serif grad-text">hospitality</span></h2>
        <ul class="feat">
          @for (f of feats; track f[1]) {<li><span aria-hidden="true">{{ f[0] }}</span><div><b>{{ f[1] }}</b><p>{{ f[2] }}</p></div></li>}
        </ul>
        <button class="btn btn-p" (click)="lock.gate('Partner portal')">Open the partner portal</button>
      </div>
      <div class="dash blur-lock" reveal="120">
        <div class="inner glass dd">
          <div class="dh"><b>Partner dashboard</b><span class="chip">Live</span></div>
          <div class="kp">@for (k of ['Bookings','Occupancy','Revenue','Reviews']; track k) {<div><small>{{ k }}</small><b>•••</b></div>}</div>
          <svg viewBox="0 0 400 140" class="chart" aria-hidden="true"><path d="M0 120 C60 100 80 60 140 70 S240 20 300 40 380 10 400 15" fill="none" stroke="var(--primary)" stroke-width="3"/><path d="M0 130 C70 120 100 95 160 100 S260 70 320 80 380 60 400 62" fill="none" stroke="var(--accent)" stroke-width="3" opacity=".7"/></svg>
          <div class="rows">@for (r of [1,2,3]; track r) {<div></div>}</div>
        </div>
        <div class="gate"><span class="lk" aria-hidden="true">🔒</span><b>Partner access only</b><button class="btn btn-p" (click)="lock.gate('Partner dashboard')">Sign in</button></div>
      </div>
    </div>
  </section>

  <section class="sec ev" aria-labelledby="h-e">
    <div class="wrap">
      <div class="sec-h" reveal><div><span class="kick">Gatherings</span><h2 id="h-e">Upcoming <span class="serif grad-text">events</span></h2></div><a class="btn btn-o" routerLink="/events">All events</a></div>
      <ol class="el">@for (e of events; track e.t; let i = $index) {
        <li [reveal]="i*70"><time [attr.datetime]="e.d"><b>{{ e.d | date:'dd' }}</b>{{ e.d | date:'MMM y' }}</time><div><h3>{{ e.t }}</h3><p>{{ e.p }} · {{ e.k }}</p></div>
          <button class="btn btn-o" (click)="e.price ? lock.pay(e.t, e.price, 'CAD', [[e.t + ' · 1 seat', e.price]]) : lock.gate('Event RSVP')">{{ e.price ? 'Tickets · $' + e.price : 'RSVP free' }}</button></li>
      }</ol>
    </div>
  </section>

  <section class="cta-sec" aria-labelledby="h-c">
    <img [src]="img.lake" alt="" loading="lazy">
    <div class="wrap ci" reveal><h2 id="h-c">Your next journey <span class="serif">starts here.</span></h2><div class="hb"><a class="btn btn-p" routerLink="/plan">Plan my trip</a><button class="btn btn-o" (click)="lock.gate('Membership')">Become a member</button></div></div>
  </section>
  `,
  styleUrl: './home.scss',
})
export class HomePage implements AfterViewInit, OnDestroy {
  lock = inject(LockService); toast = inject(ToastService); zone = inject(NgZone);
  @ViewChild('journey') journeyEl!: ElementRef<HTMLElement>;
  @ViewChild('c3d') c3d!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cvid') cvid!: ElementRef<HTMLCanvasElement>;
  img = IMG; chapters = CHAPTERS; exps = EXPERIENCES.slice(0, 5); events = EVENTS;
  words = ['Mountains', 'Lakes', 'Lodges', 'Aurora', 'Culinary', 'Wellness', 'Mountains', 'Lakes', 'Lodges', 'Aurora', 'Culinary', 'Wellness'];
  feats: [string, string, string][] = [['📅', 'Real-time availability', 'Rooms, tours and tables synced across channels.'], ['💳', 'Secure payments', 'Cards, wallets and deposits with PCI-compliant checkout.'], ['🍪', 'Consent & privacy', 'Cookie preferences and GDPR/PIPEDA-ready data handling.'], ['🔐', 'Role-based access', 'Owners, managers and staff each see what they need.']];
  p = signal(0); chap = signal(0); heroOp = signal(1); ready = signal(false); mode = signal<'3d' | 'video'>('3d'); hasVideo = signal(false); paused = signal(false);
  private j?: Journey; private fs?: FrameScrubber; private io?: IntersectionObserver; private visible = true;
  async ngAfterViewInit() {
    const reduced = document.documentElement.classList.contains('rm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = innerWidth < 760;
    const mod = await import('../three-journey');
    this.zone.runOutsideAngular(() => {
      try { this.j = new mod.Journey(this.c3d.nativeElement, { mobile, reduced }); this.j.setProgress(0); if (!reduced) this.j.start(); else this.paused.set(true); }
      catch { this.toast.show('3D is not supported on this device. Showing the cinematic view.', 'info'); }
      this.ready.set(true);
      addEventListener('scroll', this.onScroll, { passive: true }); this.onScroll();
      this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (!this.j) return; if (e.isIntersecting && !this.paused()) this.j.start(); else this.j.stop(); });
      this.io.observe(this.journeyEl.nativeElement);
    });
    const frames = await mod.FrameScrubber.load();
    if (frames) { this.fs = new mod.FrameScrubber(this.cvid.nativeElement, frames); this.hasVideo.set(true); this.mode.set('video'); this.fs.setProgress(this.p()); }
  }
  private onScroll = () => {
    const el = this.journeyEl?.nativeElement; if (!el) return;
    const r = el.getBoundingClientRect(); const total = el.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    this.j?.setProgress(p); this.fs?.setProgress(p);
    const c = this.bounds.findIndex(b => p < b); // chapters synced to time of day in the 3D scene
    this.zone.run(() => { this.p.set(p); this.chap.set(c); this.heroOp.set(Math.max(0, 1 - p / .07)); });
  };
  timeOfDay() { const p = this.p(); return p < .2 ? 'Dawn' : p < .5 ? 'Day' : p < .7 ? 'Sunset' : 'Night'; }
  private bounds = [.2, .45, .66, .88, 1.01];
  goChapter(i: number) { const el = this.journeyEl.nativeElement; const total = el.offsetHeight - innerHeight; const a = i ? this.bounds[i - 1] : .08; scrollTo({ top: el.offsetTop + total * ((a + this.bounds[i]) / 2), behavior: 'smooth' }); }
  skip() { document.getElementById('after')?.scrollIntoView({ behavior: 'smooth' }); }
  togglePause() { this.paused.set(!this.paused()); if (this.paused()) this.j?.stop(); else if (this.visible) this.j?.start(); }
  ngOnDestroy() { removeEventListener('scroll', this.onScroll); this.io?.disconnect(); this.j?.dispose(); this.fs?.dispose(); }
}
