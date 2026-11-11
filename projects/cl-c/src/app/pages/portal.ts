import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective } from '@shared/core';
import { IMG } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.lab" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Patient Portal</span></nav>
      <h1>Your health records, <em>secure</em></h1><p>Lab reports, prescriptions, discharge summaries, bills and upcoming visits in one place. Sign in with your mobile OTP and doctor referral number.</p>
      <button class="btn btn-a" style="margin-top:22px" (click)="lock.gate('Patient portal')"><x-ic n="🔐"></x-ic> Sign in with mobile OTP</button></div>
  </section>
  <section class="sec">
    <div class="wrap blur-lock" reveal>
      <div class="inner pt card">
        <div class="ph"><div class="av"></div><div><b>Patient name</b><small>UHID LH-000000 · Blood group O+</small></div></div>
        <div class="tiles">@for (t of tiles; track t[0]) {<div class="t"><span><x-ic [n]="t[1]" s="26"></x-ic></span><b>{{ t[0] }}</b></div>}</div>
        <div class="cols">
          <div class="pane"><b>Recent reports</b>@for (r of ['Complete Blood Count','Lipid Profile','HbA1c','Chest X-ray']; track r) {<div class="rw"><span>{{ r }}</span><em>Ready</em><i><x-ic n="⬇"></x-ic></i></div>}</div>
          <div class="pane"><b>Vitals trend</b><svg viewBox="0 0 300 120" class="ch" aria-hidden="true"><polyline fill="none" stroke="var(--primary)" stroke-width="3" points="0,90 50,80 100,85 150,60 200,55 250,40 300,45"/><polyline fill="none" stroke="var(--accent)" stroke-width="3" points="0,60 50,62 100,58 150,64 200,59 250,61 300,57"/></svg></div>
        </div>
      </div>
      <div class="gate"><div class="lk" aria-hidden="true"><x-ic n="🔒"></x-ic></div><h2>Protected health information</h2><p>Verify your mobile number with OTP, then enter the referral number from your doctor.</p><button class="btn btn-p" (click)="lock.gate('Patient portal')">Verify &amp; continue</button></div>
    </div>
    <div class="wrap fs">
      @for (f of feats; track f[1]; let i = $index) {<div class="f card" [reveal]="i*60"><span aria-hidden="true"><x-ic [n]="f[0]" s="28"></x-ic></span><h3>{{ f[1] }}</h3><p>{{ f[2] }}</p><button class="lnk" (click)="lock.gate(f[1])">Open →</button></div>}
    </div>
  </section>`,
  styles: [`
  .pt{padding:26px;display:grid;gap:18px;min-height:520px}
  .ph{display:flex;gap:14px;align-items:center}.av{width:60px;height:60px;border-radius:50%;background:var(--grad)}.ph small{display:block;color:var(--muted)}
  .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.t{background:var(--bg-2);border-radius:14px;padding:16px;display:grid}.t span{font-size:1.6rem}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}.pane{border:1px solid var(--line);border-radius:14px;padding:16px;display:grid;gap:8px}
  .rw{display:grid;grid-template-columns:1fr auto auto;gap:10px;padding:8px;border-radius:8px;background:var(--bg)}.rw em{color:var(--ok);font-style:normal;font-weight:700}
  .ch{width:100%;height:auto}
  .gate h2{font-size:2rem}.gate p{max-width:44ch}.lk{width:80px;height:80px;border-radius:24px;background:var(--grad);display:grid;place-items:center;font-size:2rem}
  .fs{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:30px}
  .f{padding:22px;display:grid;gap:6px}.f span{font-size:1.8rem}.f h3{font-size:1.15rem}.f p{color:var(--muted);margin:0;font-size:.9rem}
  .lnk{justify-self:start;background:none;border:0;color:var(--primary);font-weight:800;cursor:pointer;min-height:40px}
  @media (max-width:900px){.fs{grid-template-columns:1fr 1fr}.tiles{grid-template-columns:1fr 1fr}.cols{grid-template-columns:1fr}}
  `],
})
export class PortalPage {
  lock = inject(LockService); img = IMG;
  tiles = [['Reports', '🧾'], ['Prescriptions', '💊'], ['Appointments', '📅'], ['Bills', '💳']];
  feats = [['🧾', 'Lab reports', 'Download reports as PDF or share with your doctor.'], ['💊', 'Prescriptions', 'Reorder medicines from the hospital pharmacy.'], ['📅', 'Appointments', 'Reschedule or cancel visits and join video consults.'], ['💳', 'Bills & insurance', 'Pay bills online and track insurance claims.']];
}
