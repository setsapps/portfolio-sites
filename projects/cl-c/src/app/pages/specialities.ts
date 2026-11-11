import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RevealDirective, TiltDirective } from '@shared/core';
import { IMG, SPECIALITIES } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RouterLink, FormsModule, RevealDirective, TiltDirective],
  template: `
  <section class="page-hero"><img [src]="img.surgery" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Specialities</span></nav>
      <h1>Specialities &amp; <em>centres</em></h1><p>From emergency care to joint replacement and childbirth: expert teams, modern equipment and coordinated care.</p>
      <div class="sx"><label for="sq" class="sr-only">Filter specialities</label><input id="sq" [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Search a speciality or treatment…"></div></div>
  </section>
  <section class="sec" style="padding-top:50px">
    <div class="wrap g">
      @for (s of list(); track s.slug; let i = $index) {
        <a class="sc card" [routerLink]="['/specialities', s.slug]" tilt [reveal]="(i%4)*50">
          <span class="ic" aria-hidden="true"><x-ic [n]="s.icon" s="28"></x-ic></span>
          @if (s.coe) {<span class="coe">Centre of excellence</span>}
          <h2>{{ s.name }}</h2><p>{{ s.blurb }}</p>
          <span class="go">View treatments →</span>
        </a>
      } @empty {<p>No match. Try “heart”, “knee” or “baby”.</p>}
    </div>
  </section>`,
  styles: [`
  .sx input{margin-top:24px;width:min(560px,100%);min-height:58px;border-radius:14px;border:0;padding:0 20px;font-size:1.05rem;box-shadow:0 20px 50px -20px rgba(0,0,0,.5)}
  .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:18px}
  .sc{padding:24px;text-decoration:none;color:var(--text);display:flex;flex-direction:column;gap:8px;position:relative}
  .sc:hover{border-color:var(--primary)}
  .ic{width:60px;height:60px;border-radius:18px;background:var(--accent-soft);display:grid;place-items:center;font-size:1.8rem;transition:transform .3s}.sc:hover .ic{transform:rotate(-8deg) scale(1.08)}
  .coe{position:absolute;right:16px;top:16px;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--primary);background:color-mix(in srgb,var(--primary) 10%,transparent);padding:4px 8px;border-radius:6px}
  .sc h2{font-size:1.3rem}.sc p{color:var(--muted);margin:0;font-size:.92rem;flex:1}.go{color:var(--primary);font-weight:800;font-size:.9rem}
  `],
})
export class SpecialitiesPage {
  img = IMG; q = signal('');
  list = computed(() => { const q = this.q().toLowerCase(); return SPECIALITIES.filter(s => !q || (s.name + s.blurb + s.treatments.join(' ')).toLowerCase().includes(q)); });
}
