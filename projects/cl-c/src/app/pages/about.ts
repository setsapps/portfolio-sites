import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '@shared/core';
import { IMG } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.building" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>About</span></nav>
      <h1>Caring for Ludhiana, <em>like family</em></h1><p>A multi-speciality hospital built around one idea: every patient deserves expert care with dignity and warmth.</p></div>
  </section>
  <section class="sec"><div class="wrap two">
    <div reveal><div class="eyebrow">Our promise</div><h2 class="h">Vision &amp; values</h2><p class="muted">Content placeholder for the hospital's vision and history. The client supplies founding year, milestones and leadership.</p></div>
    <div class="vg">@for (v of values; track v[0]; let i = $index) {<div class="v card" [reveal]="i*60"><span aria-hidden="true"><x-ic [n]="v[0]" s="28"></x-ic></span><b>{{ v[1] }}</b><p>{{ v[2] }}</p></div>}</div>
  </div></section>
  <section class="sec bg"><div class="wrap">
    <div class="eyebrow" reveal>Facilities</div><h2 class="h" reveal>Under one roof</h2>
    <div class="fg">@for (f of facilities; track f[1]; let i = $index) {<div class="f card" [reveal]="(i%4)*50"><span aria-hidden="true"><x-ic [n]="f[0]" s="24"></x-ic></span>{{ f[1] }}</div>}</div>
    <p class="muted" style="margin-top:14px">Facility list to be confirmed by the hospital.</p>
  </div></section>`,
  styles: [`
  .two{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
  .h{font-size:clamp(1.8rem,3.4vw,2.8rem);margin:8px 0 16px}.muted{color:var(--muted)}
  .vg{display:grid;grid-template-columns:1fr 1fr;gap:12px}.v{padding:20px;display:grid;gap:4px}.v span{font-size:1.8rem}.v p{color:var(--muted);margin:0;font-size:.9rem}
  .bg{background:var(--bg-2)}
  .fg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.f{padding:18px;display:flex;gap:12px;align-items:center;font-weight:700}.f span{font-size:1.5rem}
  @media (max-width:860px){.two{grid-template-columns:1fr}.fg{grid-template-columns:1fr 1fr}}
  `],
})
export class AboutPage {
  img = IMG;
  values = [['🤝', 'Compassion', 'We treat every patient like family.'], ['🎯', 'Excellence', 'Evidence-based care and continuous training.'], ['🔍', 'Transparency', 'Clear costs, clear communication.'], ['🌱', 'Community', 'Health camps and outreach across Punjab.']];
  facilities = [['🚑', '24×7 Emergency'], ['🫀', 'Cath lab'], ['🧪', 'Laboratory'], ['🩻', 'Imaging & MRI'], ['🛏', 'ICU & HDU'], ['👶', 'NICU'], ['💧', 'Dialysis'], ['💊', '24×7 Pharmacy'], ['🔪', 'Modular OTs'], ['🧘', 'Physiotherapy'], ['🍲', 'Dietetics'], ['🅿', 'Visitor parking']];
}
