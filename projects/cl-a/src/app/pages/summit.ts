import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective, TiltDirective } from '@shared/core';
import { IMG } from '../data';

@Component({
  standalone: true, imports: [RouterLink, RevealDirective, TiltDirective],
  template: `
  <section class="page-hero sh"><img [src]="img.summit" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Rise Leadership Forum</span></nav>
      <div class="eyebrow" style="color:var(--salmon)">April 22, 2027 · Vancouver</div>
      <h1 class="display">Rise Leadership <em>Forum</em></h1>
      <p>A day of keynotes, candid panels and breakout labs for women leading across food, hospitality and lifestyle.</p>
      <div class="cd" role="timer" aria-label="Countdown to the Forum">
        @for (u of units(); track u[1]) { <div><b>{{ u[0] }}</b><span>{{ u[1] }}</span></div> }
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px"><a class="btn btn-p" href="#tickets">Get tickets</a><button class="btn btn-o" style="color:#fff" (click)="lock.gate('Sponsor prospectus')">Sponsor prospectus</button></div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Agenda</div><h2>One day, <em>three tracks</em></h2></div>
        <div class="pill-tabs" role="tablist" aria-label="Agenda track">@for (t of tracks; track t) {<button role="tab" [attr.aria-selected]="track()===t" [attr.aria-pressed]="track()===t" (click)="track.set(t)">{{ t }}</button>}</div></div>
      <ol class="ag" reveal>
        @for (a of agenda[track()]; track a[0]) { <li><time>{{ a[0] }}</time><div><h3>{{ a[1] }}</h3><p>{{ a[2] }}</p></div></li> }
      </ol>
    </div>
  </section>

  <section class="sec spk-sec">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Speakers</div><h2>Voices from <em>the floor</em></h2></div><p>Speaker line-up announced in January. These are the session formats we're programming.</p></div>
      <div class="spk">@for (s of speakers; track s[0]; let i = $index) {
        <div class="sp card" tilt [reveal]="i*70"><div class="ph" [style.background]="s[2]" aria-hidden="true">{{ s[0][0] }}</div><b>{{ s[0] }}</b><small>{{ s[1] }}</small></div>
      }</div>
    </div>
  </section>

  <section class="sec" id="tickets">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Tickets</div><h2>Choose your <em>pass</em></h2></div></div>
      <div class="tk">
        @for (t of tickets; track t.n; let i = $index) {
          <div class="tc card" [class.hot]="t.hot" tilt [reveal]="i*90">
            @if (t.hot) { <span class="rib">Most popular</span> }
            <h3 class="display">{{ t.n }}</h3><div class="pr"><b>{{ '$' + t.p }}</b><s>{{ t.was ? '$' + t.was : '' }}</s></div>
            <ul>@for (f of t.f; track f) {<li>{{ f }}</li>}</ul>
            <button class="btn" [class.btn-p]="t.hot" [class.btn-l]="!t.hot" (click)="lock.pay('Rise Leadership Forum · ' + t.n, t.p, 'CAD', [[t.n + ' pass', t.p], ['Venue fee', 0]])">Buy {{ t.n }}</button>
          </div>
        }
      </div>
    </div>
  </section>
  `,
  styles: [`
  .sh{padding-bottom:110px}
  .cd{display:flex;gap:12px;margin-top:28px;flex-wrap:wrap}
  .cd div{min-width:88px;padding:14px 10px;border-radius:18px;background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.25);text-align:center}
  .cd b{display:block;font:500 2.4rem/1 var(--font-display)}.cd span{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;opacity:.85}
  .ag{list-style:none;padding:0;margin:0;border-left:2px solid var(--line);margin-left:10px}
  .ag li{display:grid;grid-template-columns:120px 1fr;gap:20px;padding:0 0 30px 28px;position:relative}
  .ag li::before{content:"";position:absolute;left:-9px;top:6px;width:16px;height:16px;border-radius:50%;background:var(--primary);box-shadow:0 0 0 5px color-mix(in srgb,var(--primary) 20%,transparent)}
  .ag time{font:600 1.1rem var(--font-display);color:var(--primary)}.ag h3{font:600 1.35rem var(--font-display)}.ag p{color:var(--muted);margin:4px 0 0}
  @media (max-width:600px){.ag li{grid-template-columns:1fr;gap:4px}}
  .spk-sec{background:var(--bg-2)}
  .spk{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
  .sp{padding:22px;text-align:center;display:grid;gap:6px;justify-items:center}.sp small{color:var(--muted)}
  .ph{width:110px;height:110px;border-radius:50%;display:grid;place-items:center;color:#fff;font:500 2.6rem var(--font-display);margin-bottom:8px}
  .tk{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:stretch}
  .tc{padding:32px;display:flex;flex-direction:column;gap:14px;position:relative;overflow:hidden}
  .tc.hot{background:var(--plum);color:#fff;border-color:transparent;transform:scale(1.03)}
  .rib{position:absolute;right:-40px;top:22px;transform:rotate(45deg);background:var(--grad);color:#fff;font-size:.72rem;font-weight:800;padding:6px 48px;letter-spacing:.08em;text-transform:uppercase}
  .tc h3{font-size:2rem;font-weight:500}.pr b{font:500 3rem var(--font-display)}.pr s{margin-left:10px;opacity:.6}
  .tc ul{margin:0;padding-left:18px;display:grid;gap:8px;flex:1}
  @media (max-width:900px){.tk{grid-template-columns:1fr}.tc.hot{transform:none}}
  `],
})
export class SummitPage implements OnInit, OnDestroy {
  lock = inject(LockService); img = IMG;
  target = new Date('2027-04-22T08:30:00-07:00').getTime();
  units = signal<[string, string][]>([]); private t?: ReturnType<typeof setInterval>;
  tracks = ['Lead', 'Grow', 'Build'] as const; track = signal<'Lead' | 'Grow' | 'Build'>('Lead');
  agenda: Record<string, [string, string, string][]> = {
    Lead: [['08:30', 'Registration & breakfast', 'Coffee, pastries and first connections.'], ['09:15', 'Opening keynote', 'Leading through a season of change.'], ['10:30', 'Panel: The path to GM', 'Hotel and resort leaders on getting the top job.'], ['13:30', 'Board-readiness lab', 'Hands-on session with current board chairs.'], ['17:00', 'Evening reception', 'Drinks, music and the Velora awards.']],
    Grow: [['09:15', 'Opening keynote', 'Shared with all tracks.'], ['10:30', 'Negotiation clinic', 'Role-play with expert coaches.'], ['13:30', 'Personal brand workshop', 'LinkedIn, speaking and visibility.'], ['15:00', 'Speed mentoring', 'Ten minutes each with six mentors.']],
    Build: [['09:15', 'Opening keynote', 'Shared with all tracks.'], ['10:30', 'From idea to owner', 'Founders in food, wellness and lifestyle.'], ['13:30', 'Financing your venture', 'Lenders and investors in conversation.'], ['15:00', 'Pitch lab', 'Five founders, five minutes, real feedback.']],
  };
  speakers = [['Keynote speaker', 'To be announced', '#b8235a'], ['Hotel general manager', 'Panel', '#4a1834'], ['Chef-owner', 'Fireside chat', '#c9974e'], ['Food brand founder', 'Build track', '#e2577f'], ['Board chair', 'Lab lead', '#7a2a55'], ['Executive coach', 'Grow track', '#d9a066']];
  tickets = [
    { n: 'Virtual', p: 95, was: 0, hot: false, f: ['Live-stream of keynotes and panels', '30-day replay access', 'Digital networking lounge'] },
    { n: 'Early-bird', p: 295, was: 395, hot: true, f: ['Full-day in-person access', 'All three tracks', 'Lunch and evening reception', 'Speed mentoring'] },
    { n: 'VIP', p: 545, was: 0, hot: false, f: ['Everything in Early-bird', 'Speaker dinner the night before', 'Reserved front seating', 'Gift bag from partners'] },
  ];
  ngOnInit() { this.tick(); this.t = setInterval(() => this.tick(), 1000); }
  ngOnDestroy() { clearInterval(this.t); }
  tick() { let s = Math.max(0, Math.floor((this.target - Date.now()) / 1000)); const d = Math.floor(s / 86400); s %= 86400; const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60);
    this.units.set([[String(d), 'Days'], [String(h).padStart(2, '0'), 'Hours'], [String(m).padStart(2, '0'), 'Minutes'], [String(s % 60).padStart(2, '0'), 'Seconds']]); }
}
