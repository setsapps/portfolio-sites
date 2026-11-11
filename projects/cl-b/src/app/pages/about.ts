import { Component, inject } from '@angular/core';
import { LockService, RevealDirective } from '@shared/core';
import { IMG } from '../data';

@Component({
  standalone: true, imports: [RevealDirective],
  template: `
  <section class="page-top"><div class="wrap"><span class="kick">About CL-B</span><h1>Hosts, guides &amp; <span class="serif grad-text">dreamers</span></h1><p>CL-B brings together lodges, guides, chefs and destination partners to create journeys that feel personal and leave places better than we found them.</p></div></section>
  <section class="wrap two">
    <img [src]="img.hike2" alt="Hikers on a mountain ridge at sunrise" loading="lazy" reveal>
    <div reveal="100"><h2>What we believe</h2>
      @for (v of values; track v[0]) {<div class="v"><b>{{ v[0] }}</b><p>{{ v[1] }}</p></div>}
    </div>
  </section>
  <section class="wrap" id="partners" style="padding:90px 24px 110px">
    <h2 class="ph" reveal>Partners</h2>
    <div class="pg">@for (p of partners; track p) {<div class="p glass" reveal>{{ p }}</div>}</div>
    <div style="margin-top:24px" reveal><button class="btn btn-p" (click)="lock.gate('Become a partner')">Become a partner</button></div>
  </section>`,
  styles: [`
  .kick{font:600 .78rem var(--font-body);letter-spacing:.22em;text-transform:uppercase;color:var(--primary)}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}.two img{border-radius:28px;aspect-ratio:4/5;object-fit:cover;width:100%}
  .two h2,.ph{font-size:clamp(2rem,4vw,3.4rem);text-transform:uppercase;letter-spacing:-.03em;margin-bottom:20px}
  .v{padding:16px 0;border-bottom:1px solid var(--line)}.v p{margin:4px 0 0;color:var(--muted)}
  .pg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.p{padding:26px;text-align:center;font:700 1.05rem var(--font-display);color:var(--muted)}
  @media (max-width:860px){.two{grid-template-columns:1fr}.pg{grid-template-columns:1fr 1fr}}
  `],
})
export class AboutPage {
  lock = inject(LockService); img = IMG;
  values = [['Hospitality first', 'Every guest is welcomed like family.'], ['Local by design', 'We partner with owners and guides who live here.'], ['Leave it better', 'Low-impact travel and community giving in every trip.'], ['Open doors', 'Careers and leadership for women across the industry.']];
  partners = ['Lodge partner', 'Guiding company', 'Culinary partner', 'Destination board', 'Wellness spa', 'Transport partner', 'Outfitter', 'Community fund'];
}
