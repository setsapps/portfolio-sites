import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective, TiltDirective } from '@shared/core';
import { IMG } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RouterLink, RevealDirective, TiltDirective],
  template: `
  <section class="page-hero"><img [src]="img.team" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Membership</span></nav>
      <h1 class="display">Become a woman of <em>CL-A</em></h1><p>Join a community that opens doors, from your first role to your first board seat.</p></div>
  </section>
  <section class="sec">
    <div class="wrap">
      <div class="tog" reveal><span [class.on]="!yearly()">Monthly</span>
        <button role="switch" [attr.aria-checked]="yearly()" (click)="yearly.set(!yearly())" aria-label="Bill yearly"><i></i></button>
        <span [class.on]="yearly()">Yearly <em class="chip">2 months free</em></span></div>
      <div class="plans">
        @for (p of plans; track p.n; let i = $index) {
          <div class="pl card" [class.hot]="p.hot" tilt [reveal]="i*80">
            @if (p.hot) {<span class="badge">Recommended</span>}
            <div class="eyebrow">{{ p.who }}</div><h2 class="display">{{ p.n }}</h2>
            <div class="pr"><b>{{ price(p) }}</b><span>{{ p.m ? (yearly() ? '/ year' : '/ month') : '' }}</span></div>
            <ul>@for (f of p.f; track f) {<li><x-ic n="✓"></x-ic> {{ f }}</li>}</ul>
            <button class="btn" [class.btn-p]="p.hot" [class.btn-l]="!p.hot" (click)="join(p)">{{ p.m ? 'Join as ' + p.n : 'Create free account' }}</button>
          </div>
        }
      </div>
      <div class="cmp card" reveal>
        <table><caption class="sr-only">Compare membership plans</caption>
          <thead><tr><th scope="col">Benefit</th>@for (p of plans; track p.n) {<th scope="col">{{ p.n }}</th>}</tr></thead>
          <tbody>@for (r of rows; track r[0]) {<tr><th scope="row">{{ r[0] }}</th>@for (c of r.slice(1); track $index) {<td>@if (c==='✓') {<x-ic n="check" style="color:var(--primary)"></x-ic><span class="sr-only">Included</span>} @else {{{ c }}}</td>}</tr>}</tbody>
        </table>
      </div>
      <div class="faq" reveal>
        <h2 class="display">Questions, answered</h2>
        @for (f of faqs; track f[0]; let i = $index) {
          <details [open]="i===0"><summary>{{ f[0] }}</summary><p>{{ f[1] }}</p></details>
        }
      </div>
    </div>
  </section>
  `,
  styles: [`
  .tog{display:flex;align-items:center;justify-content:center;gap:14px;font-weight:700;margin-bottom:40px;color:var(--muted)}
  .tog .on{color:var(--text)}
  .tog button{width:64px;height:34px;border-radius:999px;border:0;background:var(--line);position:relative;cursor:pointer}
  .tog button i{position:absolute;left:4px;top:4px;width:26px;height:26px;border-radius:50%;background:#fff;transition:.3s;box-shadow:0 2px 6px rgba(0,0,0,.2)}
  .tog button[aria-checked=true]{background:var(--primary)}.tog button[aria-checked=true] i{left:34px}
  .plans{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;align-items:stretch}
  .pl{padding:28px;display:flex;flex-direction:column;gap:12px;position:relative}
  .pl.hot{background:var(--plum);color:#fff;border-color:transparent}.pl.hot .eyebrow{color:var(--salmon)}
  .badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--grad);color:#fff;padding:6px 14px;border-radius:999px;font-size:.75rem;font-weight:800;white-space:nowrap}
  .pl h2{font-size:2rem;font-weight:500}.pr b{font:500 2.8rem var(--font-display)}.pr span{opacity:.7;margin-left:6px}
  .pl ul{list-style:none;padding:0;margin:0;display:grid;gap:8px;flex:1;font-size:.95rem}
  @media (max-width:1050px){.plans{grid-template-columns:1fr 1fr}}@media (max-width:600px){.plans{grid-template-columns:1fr}}
  .cmp{margin-top:50px;overflow-x:auto}
  table{width:100%;border-collapse:collapse;min-width:640px}
  th,td{padding:14px 18px;text-align:left;border-bottom:1px solid var(--line)}
  thead th{font:600 1.1rem var(--font-display);background:var(--bg-2)}
  tbody th{font-weight:600}td{color:var(--muted)}
  .faq{max-width:820px;margin:70px auto 0}.faq h2{font-size:2.6rem;font-weight:500;margin-bottom:20px;text-align:center}
  details{border-bottom:1px solid var(--line);padding:6px 0}
  summary{cursor:pointer;font:600 1.2rem var(--font-display);padding:14px 0;list-style:none;display:flex;justify-content:space-between;gap:14px}
  summary::after{content:"+";font-size:1.6rem;color:var(--primary);transition:.3s}details[open] summary::after{transform:rotate(45deg)}
  details p{color:var(--muted);margin:0 0 14px}
  `],
})
export class MembershipPage {
  lock = inject(LockService); img = IMG; yearly = signal(true);
  plans = [
    { n: 'Student', who: 'In school or training', m: 0, hot: false, f: ['Monthly letter', 'Free webinars', 'Student events'] },
    { n: 'Individual', who: 'Working professionals', m: 9.5, hot: true, f: ['Everything in Student', 'Members’ Lounge', 'Member event pricing', 'Mentor Circles access', 'Members-only resources'] },
    { n: 'Leader', who: 'Managers & executives', m: 19, hot: false, f: ['Everything in Individual', 'Board-readiness program', 'Forum discount', 'Directory listing'] },
    { n: 'Organization', who: 'Teams up to 10', m: 120, hot: false, f: ['10 Individual seats', 'Unlimited job posts', 'Logo on partner wall', 'Custom training'] },
  ];
  rows = [['Monthly letter', '✓', '✓', '✓', '✓'], ['Webinars', 'Free ones', 'All', 'All', 'All'], ['Members’ Lounge', '—', '✓', '✓', '✓'], ['Mentor Circles', '—', '✓', 'Priority', '✓'], ['Forum discount', '—', '10%', '20%', '20%'], ['Job posts', '—', '—', '—', 'Unlimited']];
  faqs = [['Can I cancel anytime?', 'Yes. Monthly plans cancel at the end of the billing period, and yearly plans can be refunded pro-rata within 30 days.'], ['Do you offer financial support?', 'Yes. Scholarship memberships are funded by donors. Apply through the Members’ Lounge.'], ['Can my employer pay?', 'Absolutely. Organization plans include ten seats and we can invoice your company directly.'], ['Is my data secure?', 'We use encrypted storage, role-based access and never sell member data.']];
  price(p: { m: number }) { if (!p.m) return 'Free'; const v = this.yearly() ? Math.round(p.m * 10) : p.m; return '$' + v; }
  join(p: { n: string; m: number }) { if (!p.m) { this.lock.gate('Create account'); return; } const v = this.yearly() ? Math.round(p.m * 10) : p.m; this.lock.pay(p.n + ' membership', v, 'CAD', [[p.n + (this.yearly() ? ' · yearly' : ' · monthly'), v]]); }
}
