import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LockService, RevealDirective, ToastService } from '@shared/core';
import { DOCTORS, Doctor, IMG, SPECIALITIES } from '../data';

@Component({
  standalone: true, imports: [RouterLink, FormsModule, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.care" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Book Appointment</span></nav>
      <h1>Book an <em>appointment</em></h1><p>Four quick steps. Choose in-person OPD or a video consultation from home.</p></div>
  </section>
  <section class="sec" style="padding-top:40px">
    <div class="wrap bk">
      <div class="card wz" reveal>
        <ol class="st" aria-label="Booking progress">@for (s of steps; track s; let i = $index) {<li [class.on]="i<=step()" [class.cur]="i===step()" [attr.aria-current]="i===step() ? 'step' : null"><span>{{ i+1 }}</span>{{ s }}</li>}</ol>
        @switch (step()) {
          @case (0) {
            <h2>Which speciality?</h2>
            <div class="seg" role="group" aria-label="Visit type" style="margin-bottom:14px">@for (m of ['In-person','Video consult']; track m) {<button [attr.aria-pressed]="mode()===m" (click)="mode.set(m)">{{ m==='In-person' ? '🏥' : '🎥' }} {{ m }}</button>}</div>
            <div class="sg">@for (s of specs; track s.slug) {<button class="sc" [attr.aria-pressed]="spec()===s.slug" (click)="spec.set(s.slug); step.set(1)"><span aria-hidden="true">{{ s.icon }}</span>{{ s.name }}</button>}</div>
          }
          @case (1) {
            <h2>Choose a doctor</h2>
            <div class="dl">@for (d of docs(); track d.id) {
              <button class="dr" [attr.aria-pressed]="doc()?.id===d.id" (click)="doc.set(d); step.set(2)"><img [src]="d.img" alt=""><span><b>{{ d.name }}</b><small>{{ d.spec }} · {{ d.exp }}+ yrs · ₹{{ d.fee }}</small><small>OPD: {{ d.days.join(', ') }}</small></span><i aria-hidden="true">→</i></button>
            } @empty {<p>No doctor listed for this speciality yet. <button class="lnk" (click)="step.set(0)">Choose another</button></p>}</div>
          }
          @case (2) {
            <h2>Pick a date &amp; time</h2>
            <div class="dates" role="radiogroup" aria-label="Date">@for (x of next10(); track x.k) {<button role="radio" [attr.aria-checked]="date()===x.k" [disabled]="!x.ok" (click)="date.set(x.k)"><small>{{ x.w }}</small><b>{{ x.d }}</b></button>}</div>
            <div class="slots">@for (s of slots; track s) {<button [attr.aria-pressed]="slot()===s" (click)="slot.set(s)">{{ s }}</button>}</div>
          }
          @case (3) {
            <h2>Patient details</h2>
            <div class="seg" role="group" aria-label="Who is the appointment for" style="margin-bottom:12px">@for (w of ['Myself','Family member']; track w) {<button [attr.aria-pressed]="who()===w" (click)="who.set(w)">{{ w }}</button>}</div>
            <div class="fg">
              <div class="field"><label for="pn">Full name *</label><input id="pn" [(ngModel)]="p.name" autocomplete="name"></div>
              <div class="field"><label for="pa">Age *</label><input id="pa" type="number" [(ngModel)]="p.age"></div>
              <div class="field"><label for="pg">Gender</label><select id="pg" [(ngModel)]="p.g"><option>Female</option><option>Male</option><option>Other</option></select></div>
              <div class="field"><label for="pm">Mobile *</label><input id="pm" inputmode="numeric" maxlength="10" [(ngModel)]="p.m" autocomplete="tel-national"></div>
              <div class="field full"><label for="pr">Reason for visit</label><textarea id="pr" rows="3" [(ngModel)]="p.r"></textarea></div>
              <div class="field full"><label for="pf">Upload prescription / reports (optional)</label><input id="pf" type="file" accept=".pdf,image/*" (change)="file($event)"></div>
            </div>
          }
        }
        <div class="nv">@if (step()>0) {<button class="btn btn-l" (click)="step.set(step()-1)">← Back</button>}
          @if (step()===2) {<button class="btn btn-p" [disabled]="!slot()||!date()" (click)="step.set(3)">Continue</button>}
          @if (step()===3) {<button class="btn btn-a" (click)="submit()">Verify mobile &amp; confirm</button>}</div>
      </div>
      <aside class="card sum" reveal="100">
        <h2>Your appointment</h2>
        <dl><dt>Visit</dt><dd>{{ mode() }}</dd><dt>Speciality</dt><dd>{{ specName() || '—' }}</dd><dt>Doctor</dt><dd>{{ doc()?.name || '—' }}</dd><dt>When</dt><dd>{{ date() ? date() + ', ' + slot() : '—' }}</dd><dt>Fee</dt><dd>{{ doc() ? '₹' + doc()!.fee : '—' }}</dd></dl>
        <div class="note">💡 Please arrive 15 minutes early with a photo ID and previous reports.</div>
        <div class="help"><b>Prefer to call?</b><a href="tel:+910000000000">📞 Appointment desk</a></div>
      </aside>
    </div>
  </section>
  `,
  styles: [`
  .bk{display:grid;grid-template-columns:1.5fr .7fr;gap:22px;align-items:start}
  .wz{padding:28px}
  .st{display:flex;gap:6px;list-style:none;padding:0;margin:0 0 22px}
  .st li{flex:1;display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:4px solid var(--line);font-weight:700;font-size:.85rem;color:var(--muted)}
  .st li span{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--bg-2);font-size:.8rem}
  .st li.on{border-color:var(--primary);color:var(--text)}.st li.on span{background:var(--primary);color:var(--on-primary)}
  @media (max-width:600px){.st li{font-size:0;gap:0}.st li span{font-size:.8rem}}
  h2{font-size:1.7rem;margin-bottom:14px}
  .sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
  .sc{display:flex;align-items:center;gap:10px;min-height:56px;padding:0 14px;border-radius:14px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font-weight:700;cursor:pointer;text-align:left}
  .sc:hover,.sc[aria-pressed=true]{border-color:var(--primary);background:color-mix(in srgb,var(--primary) 8%,var(--bg))}
  .dl{display:grid;gap:8px}
  .dr{display:grid;grid-template-columns:60px 1fr auto;gap:14px;align-items:center;padding:12px;border-radius:16px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer;text-align:left}
  .dr:hover{border-color:var(--primary)}.dr img{width:60px;height:60px;border-radius:50%;object-fit:cover}.dr span{display:grid}.dr small{color:var(--muted)}
  .dates{display:grid;grid-template-columns:repeat(10,1fr);gap:6px;margin-bottom:16px}
  .dates button{display:grid;justify-items:center;padding:8px 0;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer}.dates b{font:700 1.2rem var(--font-display)}.dates small{font-size:.68rem;font-weight:700;color:var(--muted)}
  .dates button[aria-checked=true]{background:var(--primary);color:var(--on-primary)}.dates button[aria-checked=true] small{color:inherit}.dates button:disabled{opacity:.3}
  @media (max-width:700px){.dates{grid-template-columns:repeat(5,1fr)}}
  .slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:6px}
  .slots button{min-height:44px;border-radius:10px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font-weight:700;cursor:pointer}.slots button[aria-pressed=true]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
  .fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}.full{grid-column:1/-1}
  .nv{display:flex;justify-content:space-between;gap:10px;margin-top:22px}
  .lnk{background:none;border:0;color:var(--primary);font-weight:700;cursor:pointer}
  .sum{padding:24px;position:sticky;top:96px;display:grid;gap:12px}.sum h2{font-size:1.4rem;margin:0}
  dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0}dt{color:var(--muted);font-weight:700;font-size:.85rem}dd{margin:0;font-weight:700}
  .note{background:var(--accent-soft);border-radius:12px;padding:12px;font-size:.88rem}
  .help{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}.help a{color:var(--primary);font-weight:800}
  @media (max-width:900px){.bk{grid-template-columns:1fr}.sum{position:static}.fg{grid-template-columns:1fr}}
  `],
})
export class BookPage {
  lock = inject(LockService); toast = inject(ToastService); route = inject(ActivatedRoute); img = IMG; specs = SPECIALITIES;
  steps = ['Speciality', 'Doctor', 'Date & time', 'Details'];
  step = signal(0); mode = signal('In-person'); spec = signal(''); doc = signal<Doctor | null>(null); date = signal(''); slot = signal(''); who = signal('Myself');
  slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00'];
  p = { name: '', age: '', g: 'Female', m: '', r: '' };
  constructor() { const d = DOCTORS.find(x => x.id === +(this.route.snapshot.queryParamMap.get('d') || 0)); if (d) { this.spec.set(d.slug); this.doc.set(d); this.step.set(2); } }
  docs = computed(() => DOCTORS.filter(d => d.slug === this.spec() && (this.mode() === 'In-person' || d.video)));
  specName = computed(() => SPECIALITIES.find(s => s.slug === this.spec())?.name);
  next10() { const d = this.doc(); return Array.from({ length: 10 }, (_, i) => { const x = new Date(); x.setDate(x.getDate() + i + 1); const w = x.toLocaleDateString('en-IN', { weekday: 'short' });
    return { k: x.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), w, d: x.getDate(), ok: !d || d.days.includes(w) }; }); }
  file(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) this.toast.show(`${f.name} attached (stays on your device in this preview)`, 'ok'); }
  submit() { if (!this.p.name.trim() || !this.p.age || !/^[6-9]\d{9}$/.test(this.p.m)) { this.toast.show('Please fill name, age and a valid 10-digit mobile number', 'warn'); return; } this.lock.gate('Confirm appointment'); }
}
