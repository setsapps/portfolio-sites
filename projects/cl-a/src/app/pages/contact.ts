import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RevealDirective, ToastService } from '@shared/core';
import { BRAND, IMG } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, FormsModule, RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.hero2" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Contact</span></nav>
      <h1 class="display">Let's <em>talk</em></h1><p>Questions about membership, partnerships, events or the media? We usually reply within one business day.</p></div>
  </section>
  <section class="sec">
    <div class="wrap cg">
      <form class="card cf" (ngSubmit)="send()" #f="ngForm" reveal novalidate>
        <div class="pill-tabs" role="group" aria-label="Topic">@for (t of topics; track t) {<button type="button" [attr.aria-pressed]="topic()===t" (click)="topic.set(t)">{{ t }}</button>}</div>
        <div class="two"><div class="field"><label for="n">Name *</label><input id="n" name="n" [(ngModel)]="m.n" required autocomplete="name" [attr.aria-invalid]="tried && !m.n"></div>
          <div class="field"><label for="e">Email *</label><input id="e" name="e" type="email" [(ngModel)]="m.e" required autocomplete="email" [attr.aria-invalid]="tried && !valid()" aria-describedby="e-err"></div></div>
        @if (tried && !valid()) { <p id="e-err" class="err" role="alert">Please enter your name and a valid email address.</p> }
        <div class="field"><label for="o">Organization</label><input id="o" name="o" [(ngModel)]="m.o" autocomplete="organization"></div>
        <div class="field"><label for="msg">Message</label><textarea id="msg" name="msg" rows="5" [(ngModel)]="m.msg"></textarea></div>
        <button class="btn btn-p">Send message</button>
      </form>
      <div class="info">
        <div class="card ic" reveal="80"><span aria-hidden="true"><x-ic n="✉"></x-ic></span><div><b>Email</b><p>{{ brand.email }}</p></div></div>
        <div class="card ic" reveal="140"><span aria-hidden="true"><x-ic n="📍"></x-ic></span><div><b>Office</b><p>{{ brand.city }} · by appointment</p></div></div>
        <div class="card ic" reveal="200"><span aria-hidden="true"><x-ic n="🕒"></x-ic></span><div><b>Hours</b><p>Mon–Fri, 9:00–17:00 PT</p></div></div>
        <div class="map" reveal="260" aria-label="Map placeholder"><div class="pin"><x-ic n="📍"></x-ic></div></div>
      </div>
    </div>
  </section>
  `,
  styles: [`
  .cg{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:start}
  .cf{padding:32px;display:grid;gap:14px}.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .err{color:var(--danger);font-weight:700;margin:0}
  .cf .btn{justify-self:start}
  .info{display:grid;gap:14px}.ic{display:flex;gap:16px;padding:20px;align-items:center}.ic span{width:52px;height:52px;border-radius:16px;background:var(--bg-2);display:grid;place-items:center;font-size:1.4rem}.ic p{margin:0;color:var(--muted)}
  .map{height:220px;border-radius:var(--r);background:repeating-linear-gradient(45deg,var(--bg-2) 0 12px,var(--blush) 12px 24px);display:grid;place-items:center}.pin{font-size:2.6rem;animation:b 2s ease-in-out infinite}@keyframes b{50%{transform:translateY(-10px)}}
  @media (max-width:860px){.cg{grid-template-columns:1fr}.two{grid-template-columns:1fr}}
  `],
})
export class ContactPage {
  toast = inject(ToastService); img = IMG; brand = BRAND;
  topics = ['Membership', 'Partnerships', 'Events', 'Media', 'Other']; topic = signal('Membership');
  m = { n: '', e: '', o: '', msg: '' }; tried = false;
  valid() { return !!this.m.n.trim() && /^\S+@\S+\.\S+$/.test(this.m.e); }
  send() { this.tried = true; if (!this.valid()) return; this.toast.show(`Thanks ${this.m.n.split(' ')[0]}! Your ${this.topic().toLowerCase()} enquiry has been received.`, 'ok'); this.m = { n: '', e: '', o: '', msg: '' }; this.tried = false; }
}
