import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LockService, RevealDirective, ToastService } from '@shared/core';
import { DOCTORS, Doctor, IMG, SPECIALITIES } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RouterLink, FormsModule, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.hero3" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Find a Doctor</span></nav>
      <h1>Find the <em>right doctor</em></h1><p>Filter by speciality, language, gender and the day you want to visit, then book in-person or video consultations instantly.</p></div>
  </section>
  <section class="sec" style="padding-top:40px">
    <div class="wrap">
      <div class="fb card" role="search" reveal>
        <div class="field"><label for="dq">Doctor or condition</label><input id="dq" [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Name, speciality or degree"></div>
        <div class="field"><label for="ds">Speciality</label><select id="ds" [ngModel]="spec()" (ngModelChange)="spec.set($event)"><option value="">All</option>@for (s of specs; track s.slug) {<option [value]="s.slug">{{ s.name }}</option>}</select></div>
        <div class="field"><label for="dl">Language</label><select id="dl" [ngModel]="lang()" (ngModelChange)="lang.set($event)"><option value="">Any</option><option>English</option><option>Hindi</option><option>Punjabi</option></select></div>
        <div class="field"><label for="dd">Available on</label><select id="dd" [ngModel]="day()" (ngModelChange)="day.set($event)"><option value="">Any day</option>@for (d of days; track d) {<option>{{ d }}</option>}</select></div>
        <div class="tg"><span class="lb">Gender</span><div class="seg" role="group" aria-label="Gender">@for (g of [['','Any'],['F','Female'],['M','Male']]; track g[0]) {<button [attr.aria-pressed]="gender()===g[0]" (click)="gender.set(g[0])">{{ g[1] }}</button>}</div></div>
        <label class="vk"><input type="checkbox" [checked]="video()" (change)="video.set(!video())"> Video consult only</label>
      </div>
      <div class="bar"><span role="status" aria-live="polite"><b>{{ list().length }}</b> doctors found</span>
        <label>Sort <select [ngModel]="sort()" (ngModelChange)="sort.set($event)"><option value="exp">Most experienced</option><option value="fee">Lowest fee</option><option value="az">Name A–Z</option></select></label></div>
      <div class="dg">
        @for (d of list(); track d.id; let i = $index) {
          <article class="dc card" [reveal]="(i%3)*60" [class.hl]="d.id===hl">
            <img [src]="d.img" alt="" loading="lazy">
            <div class="db">
              <h2>{{ d.name }}</h2><p class="sp">{{ d.spec }}</p><p class="deg">{{ d.deg }}</p>
              <ul class="m"><li><x-ic n="🎓"></x-ic> {{ d.exp }}+ years</li><li><x-ic n="🗣"></x-ic> {{ d.langs.join(', ') }}</li><li><x-ic n="📅"></x-ic> {{ d.days.join(' · ') }}</li><li>₹{{ d.fee }} consultation</li></ul>
              <div class="act"><button class="btn btn-p" (click)="open.set(d)">Book slot</button>@if (d.video) {<button class="btn btn-l" (click)="lock.gate('Video consultation')"><x-ic n="🎥"></x-ic> Video</button>}<button class="btn btn-l" (click)="profile.set(d)">Profile</button></div>
            </div>
          </article>
        } @empty { <p class="card" style="padding:30px;grid-column:1/-1;text-align:center">No doctors match. Try clearing a filter.</p> }
      </div>
    </div>
  </section>

  @if (open(); as d) {
    <div class="ov" (click)="open.set(null)"></div>
    <div class="sl" role="dialog" aria-modal="true" [attr.aria-label]="'Book with ' + d.name">
      <button class="x" (click)="open.set(null)" aria-label="Close"><x-ic n="✕"></x-ic></button>
      <div class="sh"><img [src]="d.img" alt=""><div><h2>{{ d.name }}</h2><p>{{ d.spec }}</p></div></div>
      <h3>Choose a date</h3>
      <div class="dates" role="radiogroup" aria-label="Date">@for (x of next7(d); track x.k) {<button role="radio" [attr.aria-checked]="date()===x.k" [disabled]="!x.ok" (click)="date.set(x.k)"><small>{{ x.w }}</small><b>{{ x.d }}</b><small>{{ x.m }}</small></button>}</div>
      <h3>Choose a time</h3>
      @for (p of periods; track p[0]) {
        <p class="per">{{ p[0] }}</p>
        <div class="slots">@for (s of p[1]; track s) {<button [attr.aria-pressed]="slot()===s" [disabled]="taken(s)" (click)="slot.set(s)">{{ s }}</button>}</div>
      }
      <div class="sf"><span>₹{{ d.fee }} · {{ date() || 'pick a date' }} {{ slot() }}</span><button class="btn btn-a" [disabled]="!slot() || !date()" (click)="confirm(d)">Confirm booking</button></div>
    </div>
  }
  @if (profile(); as d) {
    <div class="ov" (click)="profile.set(null)"></div>
    <div class="sl" role="dialog" aria-modal="true" [attr.aria-label]="d.name + ' profile'">
      <button class="x" (click)="profile.set(null)" aria-label="Close"><x-ic n="✕"></x-ic></button>
      <div class="sh"><img [src]="d.img" alt=""><div><h2>{{ d.name }}</h2><p>{{ d.spec }}</p></div></div>
      <p><b>Qualifications:</b> {{ d.deg }}</p><p><b>Experience:</b> {{ d.exp }}+ years</p><p><b>Languages:</b> {{ d.langs.join(', ') }}</p><p><b>OPD days:</b> {{ d.days.join(', ') }}</p>
      <p class="muted">Sample profile. The live site shows the doctor's biography, areas of interest, publications and patient feedback.</p>
      <button class="btn btn-p" (click)="profile.set(null); open.set(d)">Book with {{ d.name }}</button>
    </div>
  }
  `,
  styles: [`
  .fb{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:14px;padding:20px;align-items:end}
  .tg{display:grid;gap:6px}.lb{font-weight:700;font-size:.88rem}
  .vk{display:flex;align-items:center;gap:8px;font-weight:700;min-height:44px}.vk input{width:20px;height:20px;accent-color:var(--primary)}
  @media (max-width:1000px){.fb{grid-template-columns:1fr 1fr}}@media (max-width:560px){.fb{grid-template-columns:1fr}}
  .bar{display:flex;justify-content:space-between;align-items:center;margin:20px 0;color:var(--muted);flex-wrap:wrap;gap:10px}
  .bar select{min-height:42px;border-radius:10px;border:1.5px solid var(--line);background:var(--surface);color:var(--text);margin-left:6px;padding:0 10px}
  .dg{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px}
  .dc{display:grid;grid-template-columns:130px 1fr;gap:18px;padding:18px;align-items:start}
  .dc.hl{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 25%,transparent)}
  .dc img{width:130px;height:150px;object-fit:cover;border-radius:16px;background:var(--accent-soft)}
  .db h2{font-size:1.3rem}.sp{color:var(--primary);font-weight:700;margin:2px 0}.deg{color:var(--muted);font-size:.82rem;margin:0 0 8px}
  .m{list-style:none;padding:0;margin:0 0 12px;display:grid;gap:3px;font-size:.85rem}
  .act{display:flex;gap:6px;flex-wrap:wrap}.act .btn{min-height:40px;padding:0 12px;font-size:.85rem}
  @media (max-width:480px){.dg{grid-template-columns:1fr}.dc{grid-template-columns:1fr}.dc img{width:100%;height:220px}}
  .ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:400}
  .sl{position:fixed;right:0;top:0;bottom:0;width:min(520px,100vw);background:var(--surface);z-index:401;overflow:auto;padding:26px;display:grid;align-content:start;gap:10px;animation:s .4s cubic-bezier(.2,.8,.2,1)}
  @keyframes s{from{transform:translateX(100%)}}
  .x{position:absolute;right:14px;top:14px;width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer}
  .sh{display:flex;gap:14px;align-items:center;padding-right:40px}.sh img{width:70px;height:70px;border-radius:50%;object-fit:cover}.sh h2{font-size:1.4rem}.sh p{margin:0;color:var(--primary);font-weight:700}
  h3{font:800 .78rem var(--font-body);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:10px}
  .dates{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
  .dates button{display:grid;justify-items:center;padding:8px 0;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer}
  .dates button b{font:700 1.3rem var(--font-display)}.dates small{font-size:.68rem;color:var(--muted);font-weight:700}
  .dates button[aria-checked=true]{background:var(--primary);color:var(--on-primary);border-color:var(--primary)}.dates button[aria-checked=true] small{color:inherit}
  .dates button:disabled{opacity:.35;cursor:not-allowed}
  .per{margin:6px 0 0;font-weight:700;font-size:.85rem}
  .slots{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
  .slots button{min-height:42px;border-radius:10px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font-weight:700;cursor:pointer}
  .slots button[aria-pressed=true]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}.slots button:disabled{text-decoration:line-through;opacity:.4;cursor:not-allowed}
  .sf{position:sticky;bottom:-26px;background:var(--surface);padding:16px 0;margin-top:10px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
  .muted{color:var(--muted);font-size:.9rem}
  `],
})
export class DoctorsPage {
  lock = inject(LockService); toast = inject(ToastService); route = inject(ActivatedRoute); img = IMG; specs = SPECIALITIES;
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  q = signal(this.route.snapshot.queryParamMap.get('q') || ''); spec = signal(this.route.snapshot.queryParamMap.get('s') || '');
  lang = signal(''); day = signal(''); gender = signal(''); video = signal(false); sort = signal('exp');
  hl = +(this.route.snapshot.queryParamMap.get('d') || 0);
  open = signal<Doctor | null>(null); profile = signal<Doctor | null>(null); date = signal(''); slot = signal('');
  periods: [string, string[]][] = [['Morning', ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']], ['Afternoon', ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30']]];
  list = computed(() => { const q = this.q().toLowerCase();
    return DOCTORS.filter(d => (!q || (d.name + d.spec + d.deg).toLowerCase().includes(q)) && (!this.spec() || d.slug === this.spec()) && (!this.lang() || d.langs.includes(this.lang())) && (!this.day() || d.days.includes(this.day())) && (!this.gender() || d.gender === this.gender()) && (!this.video() || d.video))
      .sort((a, b) => this.sort() === 'fee' ? a.fee - b.fee : this.sort() === 'az' ? a.name.localeCompare(b.name) : b.exp - a.exp); });
  next7(d: Doctor) { return Array.from({ length: 7 }, (_, i) => { const x = new Date(); x.setDate(x.getDate() + i + 1); const w = x.toLocaleDateString('en-IN', { weekday: 'short' });
    return { k: x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), w, d: x.getDate(), m: x.toLocaleDateString('en-IN', { month: 'short' }), ok: d.days.includes(w) }; }); }
  taken(s: string) { return (s.charCodeAt(1) + s.charCodeAt(3) + (this.date().length)) % 5 === 0; }
  confirm(d: Doctor) { this.open.set(null); this.lock.gate(`Appointment with ${d.name}`); this.slot.set(''); this.date.set(''); }
}
