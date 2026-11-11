import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LockService, RevealDirective, TiltDirective } from '@shared/core';
import { EVENTS, IMG } from '../data';

@Component({
  standalone: true, imports: [DatePipe, RevealDirective, TiltDirective],
  template: `
  <section class="page-top"><div class="wrap"><span class="kick">Events &amp; retreats</span><h1>Gather <span class="serif grad-text">somewhere</span> wild</h1><p>Summits, retreats and community weekends hosted by CL-B partners across the region.</p></div></section>
  <section class="wrap g">
    @for (e of events; track e.t; let i = $index) {
      <article class="c card" tilt [reveal]="i*80">
        <img [src]="imgs[i % imgs.length]" alt="" loading="lazy">
        <div class="b"><time [attr.datetime]="e.d">{{ e.d | date:'EEE d MMM y' }}</time><h2>{{ e.t }}</h2><p>{{ e.p }} · {{ e.k }}</p>
          <div class="f"><b>{{ e.price ? '$' + e.price : 'Free' }}</b>
            <button class="btn btn-p" (click)="e.price ? lock.pay(e.t, e.price, 'CAD', [[e.t + ' · 1 seat', e.price]]) : lock.gate('Event RSVP')">{{ e.price ? 'Get tickets' : 'RSVP' }}</button></div></div>
      </article>
    }
    <div class="host glass" reveal><h2>Host your own gathering</h2><p>Venues, catering, guides and transport, all arranged by our events team.</p><button class="btn btn-p" (click)="lock.gate('Event enquiry')">Request a proposal</button></div>
  </section>`,
  styles: [`
  .kick{font:600 .78rem var(--font-body);letter-spacing:.22em;text-transform:uppercase;color:var(--primary)}
  .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;padding-bottom:110px}
  .c{overflow:hidden}.c img{width:100%;aspect-ratio:16/10;object-fit:cover}
  .b{padding:22px;display:grid;gap:6px}.b time{color:var(--primary);font-weight:700;font-size:.85rem;text-transform:uppercase;letter-spacing:.1em}.b h2{font-size:1.5rem;letter-spacing:-.02em;text-transform:uppercase}.b p{margin:0;color:var(--muted)}
  .f{display:flex;justify-content:space-between;align-items:center;margin-top:10px}.f b{font:800 1.4rem var(--font-display)}
  .host{padding:30px;display:grid;gap:10px;align-content:center}.host h2{font-size:1.8rem;text-transform:uppercase;letter-spacing:-.02em}.host p{color:var(--muted);margin:0}.host .btn{justify-self:start}
  `],
})
export class EventsPage { lock = inject(LockService); events = EVENTS; imgs = [IMG.lodge, IMG.aurora, IMG.chef, IMG.hike2]; }
