import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective, TiltDirective } from '@shared/core';
import { IMG, TEAM } from '../data';

@Component({
  standalone: true, imports: [RouterLink, RevealDirective, TiltDirective],
  template: `
  <section class="page-hero"><img [src]="img.talk" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>About</span></nav>
      <h1 class="display">Built by women who <em>run the floor</em></h1><p>Velora is a registered non-profit created to help women advance in food, hospitality and lifestyle, from the front desk to the boardroom.</p></div>
  </section>
  <section class="sec">
    <div class="wrap mv">
      <div reveal><div class="eyebrow">Our mission</div><h2 class="display">To <em class="script">educate</em>, elevate and empower women across our industry.</h2></div>
      <div class="vals">@for (v of values; track v[0]; let i = $index) {<div class="v card" [reveal]="i*80"><span class="display">{{ v[0] }}</span><p>{{ v[1] }}</p></div>}</div>
    </div>
  </section>
  <section class="sec tl-sec">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Our story</div><h2>Milestones</h2></div><p>Placeholder timeline. The client adds real dates and events in the CMS.</p></div>
      <ol class="tl">@for (m of miles; track m[0]; let i = $index) {<li [reveal]="i*80"><b class="display">{{ m[0] }}</b><h3>{{ m[1] }}</h3><p>{{ m[2] }}</p></li>}</ol>
    </div>
  </section>
  <section class="sec">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Team &amp; board</div><h2>The people <em>behind it</em></h2></div></div>
      <div class="team">@for (t of team; track t.n; let i = $index) {<div class="tm card" tilt [reveal]="i*60"><div class="ph display" aria-hidden="true">{{ t.i }}</div><h3>{{ t.n }}</h3><p>{{ t.r }}</p></div>}</div>
    </div>
  </section>
  `,
  styles: [`
  .mv{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
  .mv h2{font-size:clamp(2rem,4vw,3.4rem);font-weight:500;margin-top:12px}.mv h2 em{font-size:1.2em}
  .vals{display:grid;grid-template-columns:1fr 1fr;gap:14px}.v{padding:24px}.v span{font-size:1.8rem;font-style:italic;color:var(--primary)}.v p{color:var(--muted);margin:6px 0 0}
  @media (max-width:860px){.mv{grid-template-columns:1fr}}
  .tl-sec{background:var(--bg-2)}
  .tl{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(4,1fr);gap:18px;position:relative}
  .tl::before{content:"";position:absolute;left:0;right:0;top:28px;height:2px;background:var(--grad)}
  .tl li{position:relative;padding-top:60px}.tl li::before{content:"";position:absolute;left:0;top:18px;width:22px;height:22px;border-radius:50%;background:var(--surface);border:4px solid var(--primary)}
  .tl b{font-size:2.2rem;color:var(--primary)}.tl h3{font:600 1.2rem var(--font-display);margin:6px 0}.tl p{color:var(--muted);margin:0}
  @media (max-width:860px){.tl{grid-template-columns:1fr 1fr}.tl::before{display:none}}
  .team{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  .tm{padding:26px;text-align:center;display:grid;justify-items:center;gap:6px}
  .ph{width:120px;height:120px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;font-size:2.4rem;font-style:italic;margin-bottom:8px}
  .tm h3{font:600 1.3rem var(--font-display)}.tm p{color:var(--muted);margin:0}
  @media (max-width:760px){.team{grid-template-columns:1fr 1fr}}
  `],
})
export class AboutPage {
  img = IMG; team = TEAM;
  values = [['Courage', 'We say the hard thing and make room for others to do the same.'], ['Generosity', 'We lift as we climb and share what we know.'], ['Craft', 'We respect the work of hospitality in every role.'], ['Belonging', 'Every woman in our industry has a seat here.']];
  miles = [['Year 1', 'Founded', 'A small group of operators starts meeting monthly.'], ['Year 2', 'First Forum', 'The first leadership summit sells out.'], ['Year 3', 'Mentor Circles', 'Small-group mentoring launches.'], ['Today', 'Learning Studio', 'Courses and live cohorts go online.']];
}
