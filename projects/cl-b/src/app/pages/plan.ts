import { Component, computed, inject, signal } from '@angular/core';
import { LockService, RevealDirective } from '@shared/core';
import { EXPERIENCES } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RevealDirective],
  template: `
  <section class="page-top"><div class="wrap"><span class="kick">AI trip planner</span><h1>Design your <span class="serif grad-text">journey</span></h1><p>Pick a mood, length and pace. We'll draft a day-by-day itinerary you can tweak, save and book.</p></div></section>
  <section class="wrap pl">
    <div class="glass q" reveal>
      <fieldset><legend>Mood</legend><div class="seg">@for (m of moods; track m) {<button [attr.aria-pressed]="mood()===m" (click)="mood.set(m)">{{ m }}</button>}</div></fieldset>
      <fieldset><legend>Length: {{ days() }} days</legend><input type="range" min="2" max="7" [value]="days()" (input)="days.set(+$any($event.target).value)" aria-label="Trip length in days"></fieldset>
      <fieldset><legend>Pace</legend><div class="seg">@for (p of paces; track p) {<button [attr.aria-pressed]="pace()===p" (click)="pace.set(p)">{{ p }}</button>}</div></fieldset>
      <button class="btn btn-p" (click)="gen()"><x-ic n="✦"></x-ic> Generate itinerary</button>
    </div>
    <div class="out" aria-live="polite">
      @if (busy()) { <div class="glass ld"><span></span>Drafting your {{ days() }}-day {{ mood().toLowerCase() }} journey…</div> }
      @else if (shown()) {
        <ol class="days">@for (d of plan(); track d.day) {<li class="glass" reveal><b>Day {{ d.day }}</b><div><h3>{{ d.title }}</h3><p>{{ d.note }}</p></div></li>}</ol>
        <div class="act"><button class="btn btn-p" (click)="lock.gate('Save itinerary')">Save itinerary</button><button class="btn btn-o" (click)="lock.pay('Journey package · ' + days() + ' days', total(), 'CAD', lines())">Book all · {{ '$' + total() }}</button></div>
      } @else { <div class="glass ph">Your itinerary will appear here.</div> }
    </div>
  </section>`,
  styles: [`
  .kick{font:600 .78rem var(--font-body);letter-spacing:.22em;text-transform:uppercase;color:var(--primary)}
  .pl{display:grid;grid-template-columns:.9fr 1.1fr;gap:24px;padding-bottom:110px;align-items:start}
  .q{padding:26px;display:grid;gap:20px;position:sticky;top:100px}
  fieldset{border:0;padding:0;margin:0;display:grid;gap:10px}legend{font-weight:700;margin-bottom:8px}
  input[type=range]{width:100%;accent-color:var(--primary)}
  .ld{padding:30px;display:flex;gap:14px;align-items:center}.ld span{width:28px;height:28px;border-radius:50%;border:3px solid var(--line);border-top-color:var(--primary);animation:s 1s linear infinite}@keyframes s{to{transform:rotate(360deg)}}
  .ph{padding:40px;text-align:center;color:var(--muted)}
  .days{list-style:none;padding:0;margin:0;display:grid;gap:12px}
  .days li{display:grid;grid-template-columns:80px 1fr;gap:16px;padding:20px;align-items:start}
  .days b{font:800 1rem var(--font-display);color:var(--primary);text-transform:uppercase}.days h3{font-size:1.3rem}.days p{margin:4px 0 0;color:var(--muted)}
  .act{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
  @media (max-width:900px){.pl{grid-template-columns:1fr}.q{position:static}}
  `],
})
export class PlanPage {
  lock = inject(LockService);
  moods = ['Adventure', 'Slow & cosy', 'Wellness', 'Foodie']; paces = ['Relaxed', 'Balanced', 'Packed'];
  mood = signal('Adventure'); days = signal(3); pace = signal('Balanced'); busy = signal(false); shown = signal(false);
  private pick = computed(() => { const m = this.mood(); const pref = m === 'Adventure' ? ['Adventure', 'Night sky'] : m === 'Wellness' ? ['Wellness', 'Stay'] : m === 'Foodie' ? ['Culinary', 'Stay'] : ['Stay', 'Wellness', 'Night sky'];
    return [...EXPERIENCES.filter(e => pref.includes(e.cat)), ...EXPERIENCES.filter(e => !pref.includes(e.cat))]; });
  plan = computed(() => Array.from({ length: this.days() }, (_, i) => { const e = this.pick()[i % this.pick().length];
    return { day: i + 1, title: i === 0 ? 'Arrive & settle in' : i === this.days() - 1 ? 'Slow morning & farewell' : e.title, note: i === 0 ? 'Check in at the lakeside lodge, sunset walk and welcome dinner.' : i === this.days() - 1 ? 'Breakfast by the water and an easy drive out.' : `${e.place}. ${this.pace() === 'Packed' ? 'Plus an afternoon add-on.' : this.pace() === 'Relaxed' ? 'Free afternoon to rest.' : 'Evening at the lodge.'}` }; }));
  lines = computed(() => this.pick().slice(0, Math.max(1, this.days() - 2)).map(e => [e.title, e.price] as [string, number]).concat([['Lodge · ' + (this.days() - 1) + ' nights', 420 * (this.days() - 1)]]));
  total = computed(() => this.lines().reduce((s, l) => s + l[1], 0));
  gen() { this.busy.set(true); this.shown.set(false); setTimeout(() => { this.busy.set(false); this.shown.set(true); }, 1400); }
}
