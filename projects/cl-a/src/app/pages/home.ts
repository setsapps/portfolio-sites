import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LockService, RevealDirective, TiltDirective } from '@shared/core';
import { EVENTS, IMG, JOURNEY, PARTNERS, PROGRAMS, RESOURCES, STORIES } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RouterLink, DatePipe, RevealDirective, TiltDirective],
  template: `
  <!-- HERO -->
  <section class="hero" aria-labelledby="h1">
    @for (s of slides; track s; let i = $index) { <img class="kb" [class.on]="i===slide()" [src]="s" alt="" [attr.fetchpriority]="i===0 ? 'high' : null" [attr.loading]="i===0 ? 'eager' : 'lazy'"> }
    <div class="hero-ov" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>
    <div class="wrap hero-in">
      <div class="h-left">
        <div class="eyebrow light">Educate · Elevate · Empower</div>
        <h1 id="h1" class="display">
          <span class="ln"><span>Women who</span></span>
          <span class="ln"><span><em class="script">shape</em> how the</span></span>
          <span class="ln"><span>world travels.</span></span>
        </h1>
        <p class="lede">The network for women building careers in recreation, tourism and hospitality: events that open doors, mentors who've walked the path, and learning built by operators.</p>
        <div class="cta"><a class="btn btn-p" routerLink="/membership">Become a member</a><a class="btn btn-o" routerLink="/events">Explore events</a></div>
        <div class="dots" role="group" aria-label="Hero images">
          @for (s of slides; track s; let i = $index) { <button [attr.aria-pressed]="i===slide()" [attr.aria-label]="'Show image ' + (i+1)" (click)="go(i)"></button> }
        </div>
      </div>
      <div class="h-right" aria-hidden="true">
        <div class="glass g1"><span class="chip">Next event</span><b>Negotiating Your Next Role</b><small>Nov 26 · Online · Members free</small></div>
        <div class="glass g2"><div class="av-row"><i style="--c:#e2577f">M</i><i style="--c:#c9974e">K</i><i style="--c:#7a2a55">S</i><i style="--c:#ef9a86">+</i></div><b>Mentor Circles</b><small>January cohort now matching</small></div>
        <div class="ring r1"></div><div class="ring r2"></div>
      </div>
    </div>
    <a class="scroll" href="#journey" aria-label="Scroll to content"><span></span></a>
  </section>

  <!-- PATHWAYS -->
  <section class="paths wrap" aria-label="Choose your path">
    <a class="path p1" routerLink="/membership" tilt reveal>
      <span class="eyebrow">For individuals</span>
      <h2 class="display">I'm growing my <em>career</em></h2>
      <ul><li>Mentor Circles</li><li>Learning Studio</li><li>Job board</li><li>Members' Lounge</li></ul>
      <span class="go">Individual membership <i aria-hidden="true">→</i></span>
    </a>
    <a class="path p2" routerLink="/membership" tilt reveal="120">
      <span class="eyebrow">For organizations</span>
      <h2 class="display">We want to <em>partner &amp; hire</em></h2>
      <ul><li>Team memberships</li><li>Post jobs</li><li>Sponsor the Forum</li><li>Custom training</li></ul>
      <span class="go">Partner with us <i aria-hidden="true">→</i></span>
    </a>
  </section>

  <!-- JOURNEY -->
  <section class="sec journey" id="journey" aria-labelledby="h-j">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">The CL-A journey</div><h2 id="h-j">Five steps from <em>first hello</em> to giving back</h2></div><p>Wherever you are in your career, there's a next step. Members move along this path at their own pace.</p></div>
      <div class="j-grid" reveal>
        <div class="j-tabs" role="tablist" aria-label="Journey steps">
          @for (j of journey; track j.k; let i = $index) {
            <button role="tab" [attr.aria-selected]="i===step()" [attr.aria-controls]="'jp'" (click)="setStep(i)" [tabIndex]="i===step() ? 0 : -1" (keydown)="jKey($event)">
              <span class="n">0{{ i+1 }}</span><span class="k">{{ j.k }}</span><span class="bar"><i [style.animation-play-state]="paused() ? 'paused':'running'" [class.run]="i===step()"></i></span>
            </button>
          }
        </div>
        <div class="j-panel" id="jp" role="tabpanel" (mouseenter)="paused.set(true)" (mouseleave)="paused.set(false)">
          <div class="j-ic" aria-hidden="true"><x-ic [n]="journey[step()].icon"></x-ic></div>
          <h3 class="display">{{ journey[step()].t }}</h3>
          <p>{{ journey[step()].d }}</p>
          <a class="btn btn-p" [routerLink]="jRoutes[step()]">Start here</a>
          <span class="big" aria-hidden="true">{{ journey[step()].k }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- PROGRAMS bento -->
  <section class="sec progs" aria-labelledby="h-p">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Signature programs</div><h2 id="h-p">Built for women <em>who run the floor</em></h2></div><a class="btn btn-l" routerLink="/events">See everything on</a></div>
      <div class="bento">
        @for (p of programs; track p.id; let i = $index) {
          <a class="pg" [class]="'pg pg' + i" [routerLink]="p.route" [reveal]="i*90">
            <img [src]="p.img" alt="" loading="lazy">
            <div class="pg-in"><span class="chip">{{ p.kicker }}</span><h3 class="display">{{ p.name }}</h3><p>{{ p.blurb }}</p><span class="go">Discover <i aria-hidden="true">→</i></span></div>
          </a>
        }
      </div>
    </div>
  </section>

  <!-- MARQUEE -->
  <div class="mq" aria-hidden="true"><div class="mq-t">
    @for (w of words; track $index) { <span class="display">{{ w }}</span><i><x-ic n="✿"></x-ic></i> }
  </div></div>

  <!-- EVENTS rail -->
  <section class="sec" aria-labelledby="h-e">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">What's on</div><h2 id="h-e">Upcoming <em>events</em></h2></div>
        <div class="rail-b"><button class="ic" (click)="rail(-1)" aria-label="Previous events">←</button><button class="ic" (click)="rail(1)" aria-label="Next events">→</button></div></div>
      <div class="rail" #r id="rail" tabindex="0" aria-label="Upcoming events, scrollable">
        @for (e of events; track e.id) {
          <article class="ev card" tilt>
            <div class="ev-img"><img [src]="e.img" alt="" loading="lazy"><span class="date"><b>{{ e.date | date:'d' }}</b>{{ e.date | date:'MMM' }}</span><span class="chip t">{{ e.type }}</span></div>
            <div class="ev-b"><h3>{{ e.title }}</h3><p>{{ e.time }} · {{ e.place }}</p>
              <div class="ev-f"><span>{{ e.price ? ('$' + e.price) : 'Free' }}@if (e.member) { · Members }</span><a routerLink="/events" [attr.aria-label]="'Details for ' + e.title">Details →</a></div></div>
          </article>
        }
      </div>
    </div>
  </section>

  <!-- STORIES -->
  <section class="sec stories" aria-labelledby="h-s">
    <div class="wrap st-g">
      <div reveal>
        <div class="eyebrow">Member voices</div>
        <h2 id="h-s" class="display st-h">“{{ stories[story()].q }}”</h2>
        <p class="who">— {{ stories[story()].who }}</p>
        <div class="st-ctl"><button class="ic" (click)="nextStory(-1)" aria-label="Previous story">←</button><span>{{ story()+1 }} / {{ stories.length }}</span><button class="ic" (click)="nextStory(1)" aria-label="Next story">→</button></div>
      </div>
      <div class="st-img" reveal="120">@for (s of stories; track s.who; let i = $index) {<img [src]="s.img" alt="" loading="lazy" [class.on]="i===story()">}<div class="st-badge display">Our <em class="script">community</em></div></div>
    </div>
  </section>

  <!-- RESOURCES teaser + lounge lock -->
  <section class="sec res" aria-labelledby="h-r">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Resource library</div><h2 id="h-r">Tools you can <em>use on Monday</em></h2></div><a class="btn btn-l" routerLink="/resources">Browse all resources</a></div>
      <div class="res-g">
        @for (r of resources; track r.id; let i = $index) {
          <a class="rc card" routerLink="/resources" [reveal]="i*70"><span class="chip">{{ r.type }}</span><h3>{{ r.title }}</h3><p>{{ r.blurb }}</p><span class="m">{{ r.mins }} min · @if (r.access === 'Members') {<x-ic n="lock"></x-ic> Members} @else {Free}</span></a>
        }
        <div class="lounge" reveal="200">
          <div class="eyebrow light">Members' Lounge</div>
          <h3 class="display">Your private dashboard</h3>
          <p>Saved resources, course progress, event tickets, directory and Mentor Circle chat in one place.</p>
          <button class="btn btn-p" (click)="lock.gate('Members’ Lounge')">Sign in to the Lounge</button>
        </div>
      </div>
    </div>
  </section>

  <!-- PARTNERS -->
  <section class="partners" aria-label="Partners">
    <div class="wrap"><p class="eyebrow" style="text-align:center">Supported by partners across the industry</p></div>
    <div class="pt-mq" aria-hidden="true"><div class="pt-t">@for (p of partnersX; track $index) {<span>{{ p }}</span>}</div></div>
    <p class="sr-only">Partner organizations: {{ partners.join(', ') }}</p>
  </section>

  <!-- GIVE -->
  <section class="sec give-sec" aria-labelledby="h-g">
    <div class="wrap give" reveal>
      <img [src]="img.network" alt="" loading="lazy">
      <div class="give-in">
        <div class="eyebrow light">Give</div>
        <h2 id="h-g" class="display">Open the door for <em class="script">her</em> first leadership role.</h2>
        <p>Your gift funds Forum scholarships, free webinars and Mentor Circles for women who couldn't otherwise attend.</p>
        <div class="cta"><a class="btn btn-p" routerLink="/donate">Donate now</a><a class="btn btn-o" routerLink="/mentorship">Volunteer as a mentor</a></div>
      </div>
    </div>
  </section>
  `,
  styleUrl: './home.scss',
})
export class HomePage implements OnInit, OnDestroy {
  lock = inject(LockService);
  img = IMG; journey = JOURNEY; programs = PROGRAMS; stories = STORIES; partners = PARTNERS; partnersX = [...PARTNERS, ...PARTNERS];
  events = EVENTS.slice().sort((a, b) => a.date.localeCompare(b.date));
  resources = RESOURCES.slice(0, 4);
  slides = [IMG.hero, IMG.hero3, IMG.hotel];
  words = ['Hospitality', 'Tourism', 'Recreation', 'Leadership', 'Mentorship', 'Community', 'Hospitality', 'Tourism', 'Recreation', 'Leadership', 'Mentorship', 'Community'];
  jRoutes = ['/contact', '/events', '/academy', '/summit', '/mentorship'];
  slide = signal(0); step = signal(0); story = signal(0); paused = signal(false);
  private t: ReturnType<typeof setInterval>[] = [];
  ngOnInit() {
    const rm = document.documentElement.classList.contains('rm');
    if (rm) return;
    this.t.push(setInterval(() => this.slide.set((this.slide() + 1) % this.slides.length), 6500));
    this.t.push(setInterval(() => { if (!this.paused()) this.step.set((this.step() + 1) % this.journey.length); }, 6000));
  }
  ngOnDestroy() { this.t.forEach(clearInterval); }
  go(i: number) { this.slide.set(i); }
  setStep(i: number) { this.step.set(i); this.paused.set(true); }
  jKey(e: KeyboardEvent) {
    const n = this.journey.length; let i = this.step();
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (i + 1) % n; else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (i - 1 + n) % n; else return;
    e.preventDefault(); this.setStep(i); setTimeout(() => (document.querySelectorAll<HTMLElement>('.j-tabs [role=tab]')[i])?.focus());
  }
  nextStory(d: number) { this.story.set((this.story() + d + this.stories.length) % this.stories.length); }
  rail(d: number) { const r = document.getElementById('rail'); r?.scrollBy({ left: d * (r.clientWidth * .8), behavior: 'smooth' }); }
}
