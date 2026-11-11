import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective, ToastService } from '@shared/core';
import { EVENTS, EventItem, IMG } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, DatePipe, FormsModule, RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.network" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Events</span></nav>
      <h1 class="display">Rooms worth <em>being in</em></h1><p>Summits, suppers, webinars and socials across the region and online. Filter by type, switch to calendar view and book in seconds.</p></div>
  </section>

  <section class="sec" style="padding-top:60px">
    <div class="wrap">
      <div class="tools" reveal>
        <div class="field srch"><label for="eq" class="sr-only">Search events</label><input id="eq" type="search" placeholder="Search events or places…" [ngModel]="q()" (ngModelChange)="q.set($event)"></div>
        <div class="pill-tabs" role="group" aria-label="Filter by type">
          @for (t of types; track t) { <button [attr.aria-pressed]="type()===t" (click)="type.set(t)">{{ t }}</button> }
        </div>
        <div class="pill-tabs view" role="group" aria-label="View">
          <button [attr.aria-pressed]="view()==='grid'" (click)="view.set('grid')"><x-ic n="▦"></x-ic> Grid</button>
          <button [attr.aria-pressed]="view()==='cal'" (click)="view.set('cal')"><x-ic n="▤"></x-ic> Calendar</button>
        </div>
      </div>
      <p class="count" role="status" aria-live="polite">{{ list().length }} event{{ list().length===1?'':'s' }}</p>

      @if (view()==='grid') {
        <div class="eg">
          @for (e of list(); track e.id; let i = $index) {
            <article class="ec card" [reveal]="(i%3)*80">
              <div class="ei"><img [src]="e.img" alt="" loading="lazy"><span class="chip ty">{{ e.type }}</span>@if (e.member) {<span class="chip mem">Members</span>}</div>
              <div class="eb">
                <div class="dt"><b>{{ e.date | date:'d' }}</b><span>{{ e.date | date:'MMM y' }}</span></div>
                <div><h2>{{ e.title }}</h2><p>{{ e.time }}<br>{{ e.place }}</p></div>
              </div>
              <div class="ef"><span class="pr">{{ e.price ? ('$' + e.price) : 'Free' }}</span><span class="seat">{{ e.seats }}</span><button class="btn btn-p" (click)="open.set(e)">View &amp; book</button></div>
            </article>
          } @empty { <p class="empty">No events match. Try another filter.</p> }
        </div>
      } @else {
        <div class="cal card" reveal>
          <div class="cal-h"><button class="ic" (click)="shift(-1)" aria-label="Previous month">←</button><h2 aria-live="polite">{{ month() | date:'MMMM y' }}</h2><button class="ic" (click)="shift(1)" aria-label="Next month">→</button></div>
          <div class="g7 dow" aria-hidden="true">@for (d of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']; track d) {<span>{{ d }}</span>}</div>
          <div class="g7">
            @for (c of cells(); track c.key) {
              <div class="cell" [class.out]="!c.inMonth" [class.today]="c.key===today">
                <span class="dn">{{ c.d }}</span>
                @for (e of c.events; track e.id) { <button class="cev" [class]="'cev t-' + e.type" (click)="open.set(e)">{{ e.title }}</button> }
              </div>
            }
          </div>
        </div>
      }
    </div>
  </section>

  @if (open(); as e) {
    <div class="ov" (click)="open.set(null)"></div>
    <aside class="drawer" role="dialog" aria-modal="true" [attr.aria-label]="e.title">
      <button class="x" (click)="open.set(null)" aria-label="Close"><x-ic n="✕"></x-ic></button>
      <div class="dimg"><img [src]="e.img" alt=""></div>
      <div class="dbody">
        <span class="chip">{{ e.type }}</span>
        <h2 class="display">{{ e.title }}</h2>
        <ul class="meta"><li><x-ic n="📅"></x-ic> {{ e.date | date:'EEEE, MMMM d, y' }}</li><li><x-ic n="🕒"></x-ic> {{ e.time }}</li><li><x-ic n="📍"></x-ic> {{ e.place }}</li><li><x-ic n="🎟"></x-ic> {{ e.seats }}</li></ul>
        <p>{{ e.desc }}</p>
        <h3>Tickets</h3>
        <div class="tix" role="radiogroup" aria-label="Ticket type">
          @for (t of tiers(e); track t.n) {
            <label class="tk"><input type="radio" name="tk" [value]="t.n" [(ngModel)]="tier"><span><b>{{ t.n }}</b><small>{{ t.d }}</small></span><em>{{ t.p ? ('$' + t.p) : 'Free' }}</em></label>
          }
        </div>
        <div class="qty"><span>Quantity</span><div><button (click)="qty.set(qmax(qty()-1))" aria-label="Decrease">−</button><output aria-live="polite">{{ qty() }}</output><button (click)="qty.set(qmax(qty()+1))" aria-label="Increase">+</button></div></div>
        <div class="dact">
          <button class="btn btn-p" (click)="book(e)">{{ priceOf(e) ? 'Checkout · $' + priceOf(e) : 'Reserve free spot' }}</button>
          <button class="btn btn-l" (click)="ics(e)">Add to calendar</button>
          <button class="btn btn-l" (click)="share(e)">Share</button>
        </div>
      </div>
    </aside>
  }
  `,
  styles: [`
  .tools{display:flex;gap:14px;flex-wrap:wrap;align-items:center;justify-content:space-between}
  .srch{flex:1 1 280px}
  .view{margin-left:auto}
  .count{color:var(--muted);font-weight:700;margin:18px 0}
  .eg{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:22px}
  .ec{overflow:hidden;display:flex;flex-direction:column}
  .ei{position:relative;aspect-ratio:16/10;overflow:hidden}.ei img{width:100%;height:100%;object-fit:cover;transition:transform .8s}.ec:hover .ei img{transform:scale(1.06)}
  .ty{position:absolute;left:14px;top:14px;background:var(--surface);color:var(--primary)}.mem{position:absolute;right:14px;top:14px;background:var(--plum);color:#fff}
  .eb{display:grid;grid-template-columns:70px 1fr;gap:16px;padding:20px 20px 8px}
  .dt{text-align:center;border-right:1px solid var(--line);padding-right:12px}.dt b{display:block;font:500 2.4rem/1 var(--font-display);color:var(--primary)}.dt span{font-size:.75rem;font-weight:800;text-transform:uppercase;color:var(--muted)}
  .eb h2{font:600 1.3rem/1.2 var(--font-display);margin-bottom:6px}.eb p{color:var(--muted);font-size:.9rem;margin:0}
  .ef{display:flex;align-items:center;gap:10px;padding:16px 20px 20px;margin-top:auto}.pr{font:600 1.4rem var(--font-display)}.seat{font-size:.8rem;color:var(--muted);flex:1}
  .ef .btn{min-height:42px;padding:0 16px}
  .empty{padding:40px;text-align:center;color:var(--muted);grid-column:1/-1}
  .cal{padding:24px}
  .cal-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.cal-h h2{font:500 2rem var(--font-display)}
  .ic{width:46px;height:46px;border-radius:50%;border:1.5px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer}
  .g7{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
  .dow span{text-align:center;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:6px}
  .cell{min-height:118px;border-radius:14px;background:var(--bg);padding:8px;display:flex;flex-direction:column;gap:4px;border:1px solid transparent}
  .cell.out{opacity:.35}.cell.today{border-color:var(--primary)}
  .dn{font-weight:800;font-size:.85rem}
  .cev{border:0;border-radius:8px;padding:5px 7px;font:700 .72rem/1.25 var(--font-body);text-align:left;cursor:pointer;background:var(--blush);color:var(--text)}
  .t-Summit{background:var(--primary);color:var(--on-primary)}.t-Dinner{background:color-mix(in srgb,var(--gold) 35%,var(--surface))}.t-Webinar{background:color-mix(in srgb,var(--primary-2) 25%,var(--surface))}
  @media (max-width:700px){.cell{min-height:64px}.cev{font-size:0;height:8px;padding:0}}
  .ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);z-index:400;animation:f .3s}@keyframes f{from{opacity:0}}
  .drawer{position:fixed;right:0;top:0;bottom:0;width:min(560px,100vw);background:var(--surface);z-index:401;overflow:auto;animation:sl .45s cubic-bezier(.2,.8,.2,1);box-shadow:-30px 0 80px -20px rgba(0,0,0,.4)}
  @keyframes sl{from{transform:translateX(100%)}}
  .x{position:absolute;right:16px;top:16px;width:44px;height:44px;border-radius:50%;border:0;background:var(--surface);color:var(--text);cursor:pointer;z-index:2;box-shadow:0 6px 20px rgba(0,0,0,.2)}
  .dimg{aspect-ratio:16/9;overflow:hidden}.dimg img{width:100%;height:100%;object-fit:cover}
  .dbody{padding:28px;display:grid;gap:12px}.dbody .chip{justify-self:start}
  .dbody h2{font-size:2.3rem;font-weight:500}.dbody h3{font:800 .8rem var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:10px}
  .meta{list-style:none;padding:0;margin:0;display:grid;gap:6px;font-weight:600}
  .tix{display:grid;gap:8px}
  .tk{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1.5px solid var(--line);border-radius:16px;cursor:pointer}
  .tk:has(input:checked){border-color:var(--primary);background:color-mix(in srgb,var(--primary) 7%,transparent)}
  .tk input{accent-color:var(--primary);width:20px;height:20px}.tk span{flex:1;display:grid}.tk small{color:var(--muted)}.tk em{font:600 1.2rem var(--font-display);font-style:normal}
  .qty{display:flex;justify-content:space-between;align-items:center;font-weight:700}.qty div{display:flex;align-items:center;gap:12px}
  .qty button{width:40px;height:40px;border-radius:50%;border:1.5px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer;font-size:1.2rem}
  .dact{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
  `],
})
export class EventsPage {
  lock = inject(LockService); toast = inject(ToastService); img = IMG;
  types = ['All', 'Summit', 'Dinner', 'Webinar', 'Social', 'Workshop'];
  q = signal(''); type = signal('All'); view = signal<'grid' | 'cal'>('grid'); open = signal<EventItem | null>(null); qty = signal(1);
  month = signal(new Date(2026, 10, 1)); tier = 'General';
  today = this.key(new Date());
  list = computed(() => EVENTS.filter(e => (this.type() === 'All' || e.type === this.type()) && (!this.q() || (e.title + e.place).toLowerCase().includes(this.q().toLowerCase()))).sort((a, b) => a.date.localeCompare(b.date)));
  cells = computed(() => {
    const m = this.month(), first = new Date(m.getFullYear(), m.getMonth(), 1), start = new Date(first); start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); const k = this.key(d);
      return { key: k, d: d.getDate(), inMonth: d.getMonth() === m.getMonth(), events: this.list().filter(e => e.date === k) }; });
  });
  key(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  shift(n: number) { const m = this.month(); this.month.set(new Date(m.getFullYear(), m.getMonth() + n, 1)); }
  tiers(e: EventItem) { return e.price ? [{ n: 'General', d: 'Full access', p: e.price }, { n: 'Member', d: '20% member rate', p: Math.round(e.price * .8) }, { n: 'Scholarship', d: 'Apply for a sponsored seat', p: 0 }] : [{ n: 'General', d: 'Free registration', p: 0 }]; }
  priceOf(e: EventItem) { const t = this.tiers(e).find(x => x.n === this.tier) || this.tiers(e)[0]; return t.p * this.qty(); }
  qmax(v: number) { return Math.min(10, Math.max(1, v)); }
  book(e: EventItem) {
    const p = this.priceOf(e);
    if (this.tier === 'Member' || e.member) { this.lock.gate('Member ticket'); return; }
    if (!p) { this.lock.gate('Event registration'); return; }
    this.lock.pay(e.title, p, 'CAD', [[`${this.tier} × ${this.qty()}`, p], ['Booking fee', 0]]);
  }
  ics(e: EventItem) {
    const d = e.date.replace(/-/g, '');
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CL-A//Events//EN', 'BEGIN:VEVENT', `UID:${e.id}@cl-a`, `DTSTART;VALUE=DATE:${d}`, `SUMMARY:${e.title}`, `LOCATION:${e.place}`, `DESCRIPTION:${e.desc}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = `cl-a-event-${e.id}.ics`; a.click();
    this.toast.show('Calendar file downloaded', 'ok');
  }
  async share(e: EventItem) {
    try { if (navigator.share) { await navigator.share({ title: e.title, url: location.href }); return; } await navigator.clipboard.writeText(location.href); this.toast.show('Link copied', 'ok'); } catch { /* cancelled */ }
  }
}
