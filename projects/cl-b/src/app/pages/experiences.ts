import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LockService, RevealDirective, TiltDirective } from '@shared/core';
import { EXPERIENCES, Exp } from '../data';

@Component({
  standalone: true, imports: [FormsModule, RevealDirective, TiltDirective],
  template: `
  <section class="page-top"><div class="wrap"><span class="kick">Experiences &amp; stays</span><h1>Find your <span class="serif grad-text">place</span></h1><p>Filter by mood, budget and dates. Live availability, secure checkout and member rates.</p></div></section>
  <section class="wrap" style="padding-bottom:110px">
    <div class="bar glass" role="search" reveal>
      <div class="field"><label for="xq">Search</label><input id="xq" [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Lodge, aurora, paddle…"></div>
      <div class="field"><label for="xd">Dates</label><input id="xd" type="date" [(ngModel)]="date"></div>
      <div class="field"><label for="xg">Guests</label><select id="xg" [(ngModel)]="guests"><option [ngValue]="1">1 guest</option><option [ngValue]="2">2 guests</option><option [ngValue]="4">4 guests</option><option [ngValue]="8">Group (8+)</option></select></div>
      <div class="field"><label for="xp">Max price: {{ '$' + max() }}</label><input id="xp" type="range" min="80" max="800" step="10" [ngModel]="max()" (ngModelChange)="max.set(+$event)"></div>
    </div>
    <div class="seg cats" role="group" aria-label="Category" reveal>@for (c of cats; track c) {<button [attr.aria-pressed]="cat()===c" (click)="cat.set(c)">{{ c }}</button>}</div>
    <p class="cnt" role="status" aria-live="polite">{{ list().length }} experiences</p>
    <div class="g">
      @for (e of list(); track e.id; let i = $index) {
        <article class="c card" tilt [reveal]="(i%3)*70">
          <div class="im"><img [src]="e.img" alt="" loading="lazy">@if (e.tag) {<span class="tg">{{ e.tag }}</span>}<button class="hrt" (click)="lock.gate('Wishlist')" [attr.aria-label]="'Save ' + e.title">♡</button></div>
          <div class="b"><small>{{ e.cat }} · {{ e.place }}</small><h2>{{ e.title }}</h2>
            <div class="f"><span><b>{{ '$' + e.price }}</b> {{ e.nights ? '/ night' : '/ person' }}</span><button class="btn btn-p" (click)="book(e)">Reserve</button></div>
            <button class="mr" (click)="lock.gate('Member rate')">🔒 Member rate available</button></div>
        </article>
      } @empty {<p>No experiences match. Try raising the price or another category.</p>}
    </div>
  </section>`,
  styles: [`
  .kick{font:600 .78rem var(--font-body);letter-spacing:.22em;text-transform:uppercase;color:var(--primary)}
  .bar{display:grid;grid-template-columns:1.4fr 1fr 1fr 1.2fr;gap:14px;padding:18px}
  .cats{margin:22px 0 8px}.cnt{color:var(--muted)}
  .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:20px}
  .c{overflow:hidden}.im{position:relative;aspect-ratio:4/3;overflow:hidden}.im img{width:100%;height:100%;object-fit:cover;transition:transform 1s}.c:hover .im img{transform:scale(1.07)}
  .tg{position:absolute;left:14px;top:14px;background:var(--primary);color:var(--on-primary);font-size:.72rem;font-weight:700;padding:5px 10px;border-radius:999px}
  .hrt{position:absolute;right:14px;top:14px;width:40px;height:40px;border-radius:50%;border:0;background:rgba(0,0,0,.35);color:#fff;cursor:pointer;backdrop-filter:blur(6px)}
  .b{padding:20px;display:grid;gap:6px}.b small{color:var(--muted);font-weight:600}.b h2{font-size:1.35rem;letter-spacing:-.02em}
  .f{display:flex;justify-content:space-between;align-items:center;margin-top:8px}.f b{font:800 1.5rem var(--font-display)}
  .mr{justify-self:start;background:none;border:0;color:var(--primary);font-weight:600;cursor:pointer;padding:6px 0;min-height:36px}
  @media (max-width:900px){.bar{grid-template-columns:1fr 1fr}}@media (max-width:520px){.bar{grid-template-columns:1fr}}
  `],
})
export class ExperiencesPage {
  lock = inject(LockService);
  cats = ['All', 'Stay', 'Adventure', 'Culinary', 'Wellness', 'Night sky'];
  q = signal(''); cat = signal('All'); max = signal(800); date = ''; guests = 2;
  list = computed(() => EXPERIENCES.filter(e => (this.cat() === 'All' || e.cat === this.cat()) && e.price <= this.max() && (!this.q() || (e.title + e.place + e.cat).toLowerCase().includes(this.q().toLowerCase()))));
  book(e: Exp) { const qty = e.nights ? 1 : this.guests; this.lock.pay(e.title, e.price * qty, 'CAD', [[`${e.title} × ${qty}`, e.price * qty], ['Taxes & fees', 0]]); }
}
