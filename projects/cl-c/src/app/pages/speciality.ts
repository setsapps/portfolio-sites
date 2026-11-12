import { Component, Input, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LockService, RevealDirective } from '@shared/core';
import { DOCTORS, FAQS, IMG, SPECIALITIES } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, RouterLink, RevealDirective],
  template: `
  @if (s(); as s) {
  <section class="page-hero"><img [src]="hero()" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <a routerLink="/specialities">Specialities</a> / <span>{{ s.name }}</span></nav>
      <span class="big" aria-hidden="true"><x-ic [n]="s.icon" s="56" w="1.4"></x-ic></span><h1>{{ s.name }}</h1><p>{{ s.blurb }}</p>
      <div class="hb"><a class="btn btn-a" routerLink="/book">Book a consultation</a><button class="btn btn-o" style="color:#fff" (click)="lock.gate('Second opinion')">Get a second opinion</button></div></div>
  </section>
  <nav class="sub" aria-label="On this page"><div class="wrap">@for (t of tabs; track t[0]) {<a [href]="'#' + t[0]">{{ t[1] }}</a>}</div></nav>
  <section class="sec" id="treat"><div class="wrap two">
    <div reveal><div class="eyebrow">Treatments &amp; procedures</div><h2 class="h">What we treat</h2>
      <div class="tl">@for (t of s.treatments; track t) {<div class="tr card"><span aria-hidden="true"><x-ic n="✓"></x-ic></span>{{ t }}</div>}</div></div>
    <aside class="cta card" reveal="100"><h3>Talk to a care coordinator</h3><p>Not sure which treatment is right? Share your reports and we'll guide you to the right specialist.</p>
      <a class="btn btn-p" href="tel:+910000000000"><x-ic n="📞"></x-ic> Call the desk</a><button class="btn btn-l" (click)="lock.gate('Upload reports')"><x-ic n="⬆"></x-ic> Upload reports</button>
      <div class="est"><b>Treatment cost estimate</b><small>Get a personalised estimate for your procedure and insurance.</small><button class="btn btn-l" (click)="lock.gate('Cost estimate')">Request estimate</button></div></aside>
  </div></section>
  <section class="sec bg" id="docs"><div class="wrap">
    <div class="eyebrow" reveal>Specialists</div><h2 class="h" reveal>Meet the team</h2>
    <div class="dg">@for (d of docs(); track d.id) {<div class="dc card" reveal><img [src]="d.img" alt="" loading="lazy"><div><b>{{ d.name }}</b><small>{{ d.spec }}</small><small>{{ d.exp }}+ yrs · {{ d.days.join(', ') }}</small><a class="btn btn-p" routerLink="/book" [queryParams]="{ d: d.id }">Book</a></div></div>}
      @empty {<p>Specialist profiles for this department are being added.</p>}</div>
  </div></section>
  <section class="sec" id="faq"><div class="wrap fq">
    <h2 class="h" reveal>Questions patients ask</h2>
    @for (f of faqs; track f[0]) {<details><summary>{{ f[0] }}</summary><p>{{ f[1] }}</p></details>}
  </div></section>
  } @else {
    <section class="sec"><div class="wrap"><h1>Speciality not found</h1><a routerLink="/specialities">See all specialities</a></div></section>
  }`,
  styles: [`
  .big{font-size:3.6rem;display:block;margin-bottom:6px}.hb{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
  .sub{position:sticky;top:68px;z-index:20;background:var(--surface);border-bottom:1px solid var(--line)}.sub .wrap{display:flex;gap:6px;overflow-x:auto}
  .sub a{padding:14px 16px;text-decoration:none;font-weight:700;white-space:nowrap;border-bottom:3px solid transparent}.sub a:hover{border-color:var(--accent)}
  .two{display:grid;grid-template-columns:1.4fr .8fr;gap:30px;align-items:start}
  .h{font-size:clamp(1.8rem,3.4vw,2.6rem);margin:8px 0 20px}
  .tl{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tr{padding:16px;display:flex;gap:10px;align-items:center;font-weight:700}.tr span{color:var(--ok)}
  .cta{padding:24px;display:grid;gap:10px;position:sticky;top:130px}.cta p{color:var(--muted);margin:0}
  .est{border-top:1px dashed var(--line);padding-top:12px;display:grid;gap:6px}.est small{color:var(--muted)}
  @media (max-width:860px){.two{grid-template-columns:1fr}.tl{grid-template-columns:1fr}.cta{position:static}}
  .bg{background:var(--bg-2)}
  .dg{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
  .dc{display:grid;grid-template-columns:90px 1fr;gap:14px;padding:16px;align-items:center}.dc img{width:90px;height:90px;border-radius:50%;object-fit:cover}
  .dc div{display:grid;gap:2px}.dc small{color:var(--muted)}.dc .btn{justify-self:start;min-height:38px;margin-top:6px}
  .fq{max-width:860px}details{border-bottom:1px solid var(--line)}summary{cursor:pointer;font-weight:700;padding:16px 0}details p{color:var(--muted)}
  `],
})
export class SpecialityPage {
  lock = inject(LockService); title = inject(Title);
  private slugS = signal('');
  @Input() set slug(v: string) { this.slugS.set(v); const s = SPECIALITIES.find(x => x.slug === v); if (s) this.title.setTitle(s.name + ' · Ludhiana Hospital'); }
  s = computed(() => SPECIALITIES.find(x => x.slug === this.slugS()));
  docs = computed(() => DOCTORS.filter(d => d.slug === this.slugS()));
  hero = computed(() => ({ cardiology: IMG.cardiac, neurology: IMG.icu, orthopaedics: IMG.surgery, oncology: IMG.lab, 'mother-child': IMG.nurse, emergency: IMG.hero, diabetes: IMG.check } as Record<string, string>)[this.slugS()] || IMG.care);
  faqs = FAQS.slice(0, 4);
  tabs = [['treat', 'Treatments'], ['docs', 'Doctors'], ['faq', 'FAQs']];
}
