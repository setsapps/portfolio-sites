import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective, TiltDirective } from '@shared/core';
import { BLOGS, IMG } from '../data';

@Component({
  standalone: true, imports: [RouterLink, RevealDirective, TiltDirective],
  template: `
  <section class="page-hero"><img [src]="img.check" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Health Library</span></nav>
      <h1>Health <em>library</em></h1><p>Clear, doctor-reviewed articles on common conditions, prevention and recovery.</p></div>
  </section>
  <section class="sec" style="padding-top:40px"><div class="wrap">
    <div class="seg" role="group" aria-label="Topic" reveal>@for (c of cats; track c) {<button [attr.aria-pressed]="cat()===c" (click)="cat.set(c)">{{ c }}</button>}</div>
    <div class="g">@for (b of list(); track b.t; let i = $index) {
      <article class="bc card" tilt [reveal]="(i%3)*60"><img [src]="b.img" alt="" loading="lazy"><div><small>{{ b.cat }} · {{ b.min }} min read</small><h2>{{ b.t }}</h2><p>Reviewed by our specialists. Full article in the live CMS.</p></div></article>
    }</div>
  </div></section>`,
  styles: [`
  .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;margin-top:24px}
  .bc{overflow:hidden}.bc img{height:200px;width:100%;object-fit:cover}.bc div{padding:20px;display:grid;gap:6px}.bc small{color:var(--accent);font-weight:800}.bc h2{font-size:1.3rem}.bc p{color:var(--muted);margin:0;font-size:.9rem}
  `],
})
export class LibraryPage {
  img = IMG; cats = ['All', ...new Set(BLOGS.map(b => b.cat))]; cat = signal('All');
  list = computed(() => BLOGS.filter(b => this.cat() === 'All' || b.cat === this.cat()));
}
