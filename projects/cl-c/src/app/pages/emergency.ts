import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective, ToastService } from '@shared/core';
import { H, IMG } from '../data';

@Component({
  standalone: true, imports: [RouterLink, RevealDirective],
  template: `
  <section class="eh">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Emergency</span></nav>
      <h1>24×7 Emergency &amp; Trauma</h1>
      <p>If someone is in danger, call now. Our emergency team and ambulance are available day and night.</p>
      <div class="eb"><a class="btn big" [href]="'tel:' + h.emergency">📞 Call {{ h.emergency }}</a><button class="btn btn-o" (click)="amb()">🚑 Request ambulance</button><button class="btn btn-o" (click)="share()">📍 Share my location</button></div>
      @if (located()) {<p class="loc" role="status">{{ located() }}</p>}
    </div>
  </section>
  <section class="sec">
    <div class="wrap">
      <div class="eyebrow" reveal>Know the signs</div><h2 class="h" reveal>When to come to emergency</h2>
      <div class="sg">@for (s of signs; track s[1]; let i = $index) {<div class="s card" [reveal]="i*50"><span aria-hidden="true">{{ s[0] }}</span><b>{{ s[1] }}</b><p>{{ s[2] }}</p></div>}</div>
      <div class="fast card" reveal>
        <h2>Stroke? Remember <em>BE-FAST</em></h2>
        <div class="fl">@for (f of fast; track f[0]) {<div><b>{{ f[0] }}</b><span>{{ f[1] }}</span></div>}</div>
      </div>
    </div>
  </section>`,
  styles: [`
  .eh{background:linear-gradient(110deg,#7f1414,#c62828);color:#fff;padding:70px 0}
  .eh h1{font-size:clamp(2.4rem,5vw,4rem)}.eh p{font-size:1.15rem;opacity:.92;max-width:56ch}
  .eb{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.big{background:#fff;color:#a11d1d;min-height:60px;font-size:1.1rem}.eb .btn-o{color:#fff}
  .loc{background:rgba(255,255,255,.15);display:inline-block;padding:10px 14px;border-radius:12px;margin-top:14px}
  .h{font-size:clamp(1.8rem,3.4vw,2.6rem);margin:8px 0 22px}
  .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.s{padding:20px;display:grid;gap:4px}.s span{font-size:1.8rem}.s p{color:var(--muted);margin:0;font-size:.9rem}
  .fast{margin-top:30px;padding:28px}.fast h2{font-size:1.8rem;margin-bottom:16px}.fast em{color:var(--danger)}
  .fl{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.fl div{background:var(--bg-2);border-radius:14px;padding:14px;display:grid;gap:4px;text-align:center}.fl b{font:700 2rem var(--font-display);color:var(--danger)}.fl span{font-size:.85rem;font-weight:600}
  @media (max-width:900px){.sg{grid-template-columns:1fr 1fr}.fl{grid-template-columns:repeat(3,1fr)}}
  `],
})
export class EmergencyPage {
  lock = inject(LockService); toast = inject(ToastService); h = H; img = IMG; located = signal('');
  signs = [['💔', 'Chest pain', 'Pressure or pain spreading to arm, jaw or back.'], ['🫁', 'Breathlessness', 'Sudden difficulty breathing or blue lips.'], ['🧠', 'Stroke signs', 'Face drooping, arm weakness, slurred speech.'], ['🩸', 'Heavy bleeding', 'Bleeding that will not stop with pressure.'], ['🤕', 'Head injury', 'Loss of consciousness, vomiting or confusion.'], ['🔥', 'Burns', 'Large, deep or facial burns.'], ['☠', 'Poisoning', 'Swallowed chemicals, medicines or bites.'], ['🤰', 'Pregnancy', 'Bleeding, severe pain or reduced baby movement.']];
  fast = [['B', 'Balance loss'], ['E', 'Eyesight changes'], ['F', 'Face drooping'], ['A', 'Arm weakness'], ['S', 'Speech difficulty'], ['T', 'Time to call']];
  amb() { this.lock.gate('Ambulance request'); }
  share() {
    if (!navigator.geolocation) { this.located.set('Location is not available on this device.'); return; }
    navigator.geolocation.getCurrentPosition(p => this.located.set(`📍 Location ready: ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}. In the live site this is sent to the ambulance desk.`), () => this.located.set('Location permission was declined. Please call the emergency number.'));
  }
}
