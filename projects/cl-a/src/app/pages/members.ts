import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective } from '@shared/core';
import { IMG } from '../data';

@Component({
  standalone: true, imports: [RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.network" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Members’ Lounge</span></nav>
      <h1 class="display">The Members’ <em>Lounge</em></h1><p>Your private space: dashboard, directory, saved resources, tickets, certificates and circle chat.</p></div>
  </section>
  <section class="sec">
    <div class="wrap blur-lock" reveal>
      <div class="inner app card">
        <aside><b>CL-A</b>@for (n of nav; track n) {<span>{{ n }}</span>}</aside>
        <div class="main">
          <div class="hi"><div><small>Welcome back</small><h2 class="display">Member name</h2></div><div class="av"></div></div>
          <div class="kp">@for (k of ['Courses','Tickets','Saved','Circle']; track k) {<div class="k"><b>•</b><span>{{ k }}</span></div>}</div>
          <div class="cols"><div class="pane"><b>Upcoming</b>@for (i of [1,2,3]; track i) {<div class="row"></div>}</div><div class="pane"><b>Circle chat</b>@for (i of [1,2,3,4]; track i) {<div class="msg" [class.me]="i%2===0"></div>}</div></div>
          <div class="pane"><b>Member directory</b><div class="dir">@for (i of [1,2,3,4,5,6]; track i) {<div class="p"><i></i><span></span></div>}</div></div>
        </div>
      </div>
      <div class="gate">
        <div class="lk" aria-hidden="true">🔒</div>
        <h2 class="display">Members only</h2>
        <p>Sign in with your member account, Google or LinkedIn to enter the Lounge.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-p" (click)="lock.gate('Members’ Lounge')">Sign in</button><a class="btn btn-l" routerLink="/membership">Become a member</a></div>
      </div>
    </div>
    <div class="wrap feats">
      @for (f of feats; track f[0]; let i = $index) { <div class="ft card" [reveal]="i*60"><span aria-hidden="true">{{ f[0] }}</span><h3>{{ f[1] }}</h3><p>{{ f[2] }}</p></div> }
    </div>
  </section>
  `,
  styles: [`
  .app{display:grid;grid-template-columns:220px 1fr;min-height:620px;overflow:hidden}
  aside{background:var(--plum);color:#fff;padding:24px;display:grid;align-content:start;gap:14px}
  .main{padding:26px;display:grid;gap:18px}
  .hi{display:flex;justify-content:space-between;align-items:center}.hi h2{font-size:2rem}.av{width:56px;height:56px;border-radius:50%;background:var(--grad)}
  .kp{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.k{padding:18px;border-radius:16px;background:var(--bg-2);display:grid}.k b{font-size:2rem;color:var(--primary)}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .pane{padding:18px;border-radius:16px;border:1px solid var(--line);display:grid;gap:10px}
  .row{height:44px;border-radius:10px;background:var(--bg-2)}.msg{height:30px;width:70%;border-radius:12px;background:var(--bg-2)}.msg.me{justify-self:end;background:var(--blush)}
  .dir{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.p{display:grid;justify-items:center;gap:6px}.p i{width:50px;height:50px;border-radius:50%;background:var(--grad)}.p span{width:60px;height:8px;border-radius:4px;background:var(--bg-2)}
  .gate h2{font-size:2.6rem;font-weight:500}.gate p{max-width:40ch;color:var(--text)}
  .lk{width:84px;height:84px;border-radius:26px;background:var(--grad);display:grid;place-items:center;font-size:2.2rem;box-shadow:0 20px 40px -14px var(--primary)}
  .feats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:40px}
  .ft{padding:22px;display:grid;gap:6px}.ft span{font-size:1.8rem}.ft h3{font:600 1.2rem var(--font-display)}.ft p{color:var(--muted);margin:0;font-size:.92rem}
  @media (max-width:900px){.app{grid-template-columns:1fr}aside{display:none}.feats{grid-template-columns:1fr 1fr}.kp{grid-template-columns:1fr 1fr}}
  `],
})
export class MembersPage {
  lock = inject(LockService); img = IMG;
  nav = ['Dashboard', 'My learning', 'Tickets', 'Saved', 'Directory', 'Circle chat', 'Billing', 'Settings'];
  feats = [['📊', 'Personal dashboard', 'Everything you’ve joined, saved and earned.'], ['👥', 'Member directory', 'Search members by sector, region and expertise.'], ['💬', 'Circle chat', 'Private messaging with your Mentor Circle.'], ['🧾', 'Billing & receipts', 'Download tax receipts and manage your plan.']];
}
