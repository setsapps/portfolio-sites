import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LockService, RevealDirective } from '@shared/core';
import { IMG, INSURERS } from '../data';

@Component({
  standalone: true, imports: [RouterLink, FormsModule, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.hero2" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Insurance &amp; TPA</span></nav>
      <h1>Cashless treatment, <em>less paperwork</em></h1><p>Our insurance desk handles pre-authorisation and claims with your insurer or TPA, so you can focus on recovery.</p></div>
  </section>
  <section class="sec">
    <div class="wrap">
      <div class="steps">@for (s of steps; track s[0]; let i = $index) {<div class="st card" [reveal]="i*70"><span class="n">{{ i+1 }}</span><b>{{ s[0] }}</b><p>{{ s[1] }}</p></div>}</div>
      <div class="ck card" reveal>
        <h2>Is my insurer accepted?</h2>
        <label for="iq" class="sr-only">Search insurer</label><input id="iq" [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Type your insurer, TPA or scheme…">
        <div class="ig">@for (i of list(); track i) {<span>✓ {{ i }}</span>} @empty {<p>Not listed? Call the insurance desk and we'll check for you.</p>}</div>
        <button class="btn btn-p" (click)="lock.gate('Pre-authorisation request')">Start pre-authorisation</button>
      </div>
    </div>
  </section>`,
  styles: [`
  .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:30px}
  .st{padding:22px;display:grid;gap:6px}.n{width:40px;height:40px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;font-weight:800}.st p{color:var(--muted);margin:0;font-size:.9rem}
  .ck{padding:30px;display:grid;gap:14px}.ck h2{font-size:1.8rem}
  .ck input{min-height:54px;border-radius:12px;border:1.5px solid var(--line);padding:0 16px;background:var(--bg);color:var(--text)}
  .ig{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}.ig span{padding:12px 14px;border-radius:12px;background:var(--bg-2);font-weight:700}
  .ck .btn{justify-self:start}
  @media (max-width:860px){.steps{grid-template-columns:1fr 1fr}}
  `],
})
export class InsurancePage {
  lock = inject(LockService); img = IMG; q = signal('');
  steps = [['Share policy', 'Bring your policy card and photo ID to the insurance desk.'], ['Pre-authorisation', 'We send the request to your insurer or TPA.'], ['Approval', 'Most approvals arrive within a few hours.'], ['Discharge', 'Final bill settled directly with the insurer.']];
  list = computed(() => INSURERS.filter(i => i.toLowerCase().includes(this.q().toLowerCase())));
}
