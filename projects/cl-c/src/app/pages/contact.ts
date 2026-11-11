import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RevealDirective, ToastService } from '@shared/core';
import { H, IMG } from '../data';

@Component({
  standalone: true, imports: [RouterLink, FormsModule, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.building" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Contact</span></nav>
      <h1>Contact &amp; <em>directions</em></h1><p>We're here 24×7 for emergencies and 8 am – 10 pm for appointments and enquiries.</p></div>
  </section>
  <section class="sec"><div class="wrap g">
    <div class="cards">
      @for (c of contacts; track c[1]; let i = $index) {<div class="c card" [reveal]="i*50"><span aria-hidden="true">{{ c[0] }}</span><div><b>{{ c[1] }}</b><p>{{ c[2] }}</p></div></div>}
      <div class="map" reveal aria-label="Map placeholder"><span>📍</span><b>{{ h.address }}</b><a class="btn btn-p" href="https://maps.google.com/?q=Ludhiana+Punjab" target="_blank" rel="noopener">Get directions</a></div>
    </div>
    <form class="card f" (ngSubmit)="send()" reveal="100">
      <h2>Send an enquiry</h2>
      <div class="field"><label for="cn">Name *</label><input id="cn" name="cn" [(ngModel)]="m.n" autocomplete="name"></div>
      <div class="field"><label for="cm">Mobile *</label><input id="cm" name="cm" inputmode="numeric" maxlength="10" [(ngModel)]="m.p" autocomplete="tel-national"></div>
      <div class="field"><label for="ct">Topic</label><select id="ct" name="ct" [(ngModel)]="m.t"><option>Appointment</option><option>Health check</option><option>Billing</option><option>Feedback</option><option>Other</option></select></div>
      <div class="field"><label for="cq">Message</label><textarea id="cq" name="cq" rows="4" [(ngModel)]="m.q"></textarea></div>
      <button class="btn btn-a">Submit</button>
    </form>
  </div></section>`,
  styles: [`
  .g{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}
  .cards{display:grid;gap:12px}.c{display:flex;gap:14px;padding:18px;align-items:center}.c span{width:50px;height:50px;border-radius:14px;background:var(--accent-soft);display:grid;place-items:center;font-size:1.4rem}.c p{margin:0;color:var(--muted)}
  .map{height:240px;border-radius:var(--r);background:repeating-linear-gradient(45deg,var(--bg-2) 0 14px,var(--accent-soft) 14px 28px);display:grid;place-items:center;align-content:center;gap:8px;text-align:center}.map span{font-size:2.4rem}
  .f{padding:28px;display:grid;gap:12px}.f h2{font-size:1.6rem}.f .btn{justify-self:start}
  @media (max-width:860px){.g{grid-template-columns:1fr}}
  `],
})
export class ContactPage {
  toast = inject(ToastService); h = H; img = IMG; m = { n: '', p: '', t: 'Appointment', q: '' };
  contacts = [['🚑', 'Emergency (24×7)', H.emergency], ['📞', 'Appointments', H.phone], ['💬', 'WhatsApp', H.whatsapp], ['✉', 'Email', H.email]];
  send() { if (!this.m.n.trim() || !/^[6-9]\d{9}$/.test(this.m.p)) { this.toast.show('Please enter your name and a valid 10-digit mobile number', 'warn'); return; } this.toast.show('Thank you! Our team will call you back shortly.', 'ok'); this.m = { n: '', p: '', t: 'Appointment', q: '' }; }
}
