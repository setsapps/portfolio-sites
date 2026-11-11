import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LockService, RevealDirective, TiltDirective, ToastService } from '@shared/core';
import { BLOGS, DOCTORS, FAQS, H, IMG, INSURERS, NEWS, PACKAGES, SPECIALITIES, TESTIMONIALS } from '../data';

@Component({
  standalone: true, imports: [RouterLink, DatePipe, DecimalPipe, FormsModule, RevealDirective, TiltDirective],
  template: `
  <!-- HERO -->
  <section class="hero" aria-labelledby="h1">
    @for (s of slides; track s; let i = $index) {<img class="bg" [class.on]="i===slide()" [src]="s" alt="" [attr.fetchpriority]="i===0?'high':null">}
    <div class="ov" aria-hidden="true"></div>
    <div class="wrap hin">
      <div class="hl">
        <span class="badge"><i aria-hidden="true"></i> OPD open today · 9 am – 5 pm</span>
        <h1 id="h1">World-class care, <em>close to home</em> in Ludhiana.</h1>
        <p>Multi-speciality hospital with 24×7 emergency, experienced specialists and a team that treats every patient like family.</p>
        <div class="hc"><a class="btn btn-a" routerLink="/book">📅 Book Appointment</a><a class="btn btn-o" routerLink="/health-checks">Book Health Check</a></div>
      </div>
      <form class="finder" (ngSubmit)="find()" role="search" aria-label="Find care">
        <div class="ft-tabs" role="tablist" aria-label="Search for">
          @for (t of ftabs; track t) {<button type="button" role="tab" [attr.aria-selected]="ftab()===t" (click)="ftab.set(t)">{{ t }}</button>}
        </div>
        @if (ftab()==='Doctor') {
          <div class="field"><label for="fs">Speciality</label><select id="fs" name="fs" [(ngModel)]="fSpec"><option value="">Any speciality</option>@for (s of specs; track s.slug) {<option [value]="s.slug">{{ s.name }}</option>}</select></div>
          <div class="field"><label for="fn">Doctor name (optional)</label><input id="fn" name="fn" [(ngModel)]="fName" placeholder="e.g. Dr. Mehra"></div>
        } @else if (ftab()==='Symptom') {
          <div class="field"><label for="sy">Describe your symptom</label><input id="sy" name="sy" [(ngModel)]="symptom" placeholder="e.g. knee pain, cough, chest pain"></div>
          @if (suggest(); as s) {<p class="sg" aria-live="polite">Suggested: <a [routerLink]="['/specialities', s.slug]">{{ s.icon }} {{ s.name }}</a></p>}
        } @else {
          <div class="field"><label for="pk">Who is it for?</label><select id="pk" name="pk" [(ngModel)]="pkFor"><option>Men</option><option>Women</option><option>Senior</option><option>Heart</option><option>Diabetes</option><option>Basic</option></select></div>
        }
        <button class="btn btn-p go">Search</button>
        <div class="qk"><span>Popular:</span><a routerLink="/specialities/cardiology">Cardiology</a><a routerLink="/specialities/orthopaedics">Knee replacement</a><a routerLink="/specialities/mother-child">Pregnancy</a></div>
      </form>
    </div>
  </section>

  <!-- QUICK ACTIONS -->
  <section class="wrap qa" aria-label="Quick actions">
    @for (q of quick; track q[0]; let i = $index) {
      @if (q[3]) { <button class="qc card" (click)="lock.gate(q[0])" [reveal]="i*40"><span class="qi" aria-hidden="true">{{ q[1] }}</span><b>{{ q[0] }}</b><small>{{ q[2] }}</small></button> }
      @else { <a class="qc card" [routerLink]="q[4]" [reveal]="i*40"><span class="qi" aria-hidden="true">{{ q[1] }}</span><b>{{ q[0] }}</b><small>{{ q[2] }}</small></a> }
    }
  </section>

  <!-- CENTRES OF EXCELLENCE -->
  <section class="sec" aria-labelledby="h-coe">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Centres of excellence</div><h2 id="h-coe">Specialised care, <em>one roof</em></h2></div><a class="btn btn-l" routerLink="/specialities">All specialities →</a></div>
      <div class="coe" reveal>
        <div class="coe-tabs" role="tablist" aria-label="Centres of excellence">
          @for (c of coe; track c.slug; let i = $index) {<button role="tab" [attr.aria-selected]="ci()===i" (click)="ci.set(i)"><span aria-hidden="true">{{ c.icon }}</span>{{ c.name }}</button>}
        </div>
        <div class="coe-p" role="tabpanel">
          <img [src]="coeImg[ci() % coeImg.length]" alt="" loading="lazy">
          <div class="coe-in">
            <span class="chip">Centre of excellence</span>
            <h3>{{ coe[ci()].name }}</h3>
            <p>{{ coe[ci()].blurb }}</p>
            <ul>@for (t of coe[ci()].treatments; track t) {<li>✓ {{ t }}</li>}</ul>
            <div class="cb"><a class="btn btn-p" [routerLink]="['/specialities', coe[ci()].slug]">Explore centre</a><a class="btn btn-l" routerLink="/doctors" [queryParams]="{ s: coe[ci()].slug }">Meet the doctors</a></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- DOCTORS -->
  <section class="sec docs-sec" aria-labelledby="h-d">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Our specialists</div><h2 id="h-d">Doctors you can <em>trust</em></h2></div>
        <div class="rb"><button class="ic" (click)="rail(-1)" aria-label="Previous doctors">←</button><button class="ic" (click)="rail(1)" aria-label="Next doctors">→</button><a class="btn btn-l" routerLink="/doctors">Find a doctor</a></div></div>
      <div class="drail" id="drail" tabindex="0" aria-label="Doctors, scrollable">
        @for (d of docs; track d.id) {
          <article class="dc card" tilt>
            <div class="dph"><img [src]="d.img" alt="" loading="lazy">@if (d.video) {<span class="vc">● Video consult</span>}</div>
            <div class="dcb"><h3>{{ d.name }}</h3><p class="sp">{{ d.spec }}</p><p class="dg">{{ d.deg }}</p>
              <div class="dm"><span>{{ d.exp }}+ yrs</span><span>{{ d.langs.join(', ') }}</span></div>
              <a class="btn btn-p" routerLink="/book" [queryParams]="{ d: d.id }">Book <span class="sr-only">with {{ d.name }}</span></a></div>
          </article>
        }
      </div>
    </div>
  </section>

  <!-- PACKAGES -->
  <section class="sec" aria-labelledby="h-p">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Preventive health checks</div><h2 id="h-p">Catch it early, <em>stay ahead</em></h2></div><a class="btn btn-l" routerLink="/health-checks">Compare all packages</a></div>
      <div class="pk">
        @for (p of pkgs; track p.id; let i = $index) {
          <article class="pc card" [class.hot]="p.hot" tilt [reveal]="i*70">
            @if (p.hot) {<span class="rib">Best seller</span>}
            <span class="cat">{{ p.cat }}</span><h3>{{ p.name }}</h3>
            <p class="tc">{{ p.tests }} tests included</p>
            <div class="pr"><b>₹{{ p.price | number }}</b><s>₹{{ p.mrp | number }}</s><em>{{ off(p) }}% off</em></div>
            <ul>@for (x of p.incl.slice(0,4); track x) {<li>{{ x }}</li>}</ul>
            <button class="btn btn-p" (click)="lock.pay(p.name, p.price, 'INR', [[p.name, p.price], ['Home sample collection', 0]])">Book now</button>
          </article>
        }
      </div>
    </div>
  </section>

  <!-- EMERGENCY BAND -->
  <section class="emg" aria-labelledby="h-em">
    <div class="wrap eg">
      <div><span class="sir" aria-hidden="true">🚑</span><div><h2 id="h-em">Medical emergency?</h2><p>24×7 emergency &amp; trauma with ambulance service across Ludhiana.</p></div></div>
      <div class="eb"><a class="btn big" [href]="'tel:' + h.emergency">Call {{ h.emergency }}</a><a class="btn btn-o" routerLink="/emergency">Emergency info</a></div>
    </div>
  </section>

  <!-- TOOLS -->
  <section class="sec tools" aria-labelledby="h-t">
    <div class="wrap tg">
      <div reveal>
        <div class="eyebrow">Health tools</div><h2 id="h-t" class="tt">Check your <em>numbers</em></h2>
        <p class="muted">Quick, private calculators. Nothing you enter leaves your device.</p>
        <div class="seg" role="tablist" aria-label="Calculator">@for (t of ['BMI','Water','Due date']; track t) {<button role="tab" [attr.aria-pressed]="tool()===t" [attr.aria-selected]="tool()===t" (click)="tool.set(t)">{{ t }}</button>}</div>
      </div>
      <div class="calc card" reveal="100">
        @switch (tool()) {
          @case ('BMI') {
            <div class="two"><div class="field"><label for="ht">Height (cm)</label><input id="ht" type="number" [ngModel]="hcm()" (ngModelChange)="hcm.set(+$event)"></div><div class="field"><label for="wt">Weight (kg)</label><input id="wt" type="number" [ngModel]="wkg()" (ngModelChange)="wkg.set(+$event)"></div></div>
            <div class="gauge" aria-hidden="true"><div class="gb"></div><i [style.left.%]="bmiPos()"></i></div>
            <p class="res" aria-live="polite">BMI <b>{{ bmi() | number:'1.1-1' }}</b> · {{ bmiLabel() }}</p>
          }
          @case ('Water') {
            <div class="field"><label for="ww">Weight (kg)</label><input id="ww" type="number" [ngModel]="wkg()" (ngModelChange)="wkg.set(+$event)"></div>
            <p class="res" aria-live="polite">About <b>{{ (wkg() * 0.033) | number:'1.1-1' }} litres</b> of water a day</p>
          }
          @case ('Due date') {
            <div class="field"><label for="lmp">First day of last period</label><input id="lmp" type="date" [ngModel]="lmp()" (ngModelChange)="lmp.set($event)"></div>
            <p class="res" aria-live="polite">Estimated due date: <b>{{ due() | date:'d MMMM y' }}</b></p>
          }
        }
        <p class="dis">For information only, not a diagnosis. Please consult a doctor.</p>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS -->
  <section class="sec tst" aria-labelledby="h-ts">
    <div class="wrap">
      <div class="sec-h" reveal><div><div class="eyebrow">Patient stories</div><h2 id="h-ts">Care, in their <em>words</em></h2></div></div>
      <div class="tsg">@for (t of tests; track t.who; let i = $index) {
        <figure class="tsc card" [reveal]="i*90"><img [src]="t.img" alt="" loading="lazy"><blockquote>“{{ t.q }}”</blockquote><figcaption>— {{ t.who }}</figcaption></figure>
      }</div>
    </div>
  </section>

  <!-- NEWS + LIBRARY -->
  <section class="sec" aria-labelledby="h-n">
    <div class="wrap nl">
      <div reveal>
        <div class="eyebrow">What's new</div><h2 id="h-n" class="tt">News &amp; <em>camps</em></h2>
        <ul class="news">@for (n of news; track n.t) {<li><span class="chip">{{ n.tag }}</span><b>{{ n.t }}</b><time [attr.datetime]="n.d">{{ n.d | date:'d MMM' }}</time></li>}</ul>
      </div>
      <div reveal="100">
        <div class="lh"><div class="eyebrow">Health library</div><a routerLink="/health-library">All articles →</a></div>
        <div class="blg">@for (b of blogs; track b.t) {<a class="bc card" routerLink="/health-library"><img [src]="b.img" alt="" loading="lazy"><span><small>{{ b.cat }} · {{ b.min }} min</small><b>{{ b.t }}</b></span></a>}</div>
      </div>
    </div>
  </section>

  <!-- INSURANCE -->
  <section class="ins" aria-labelledby="h-i">
    <div class="wrap"><h2 id="h-i" class="eyebrow" style="text-align:center">Cashless treatment with leading insurers &amp; schemes</h2></div>
    <div class="imq" aria-hidden="true"><div class="imt">@for (i of insX; track $index) {<span>🛡 {{ i }}</span>}</div></div>
    <p class="sr-only">Accepted: {{ insurers.join(', ') }}</p>
  </section>

  <!-- FAQ -->
  <section class="sec" aria-labelledby="h-f">
    <div class="wrap faq">
      <div reveal><div class="eyebrow">FAQs</div><h2 id="h-f" class="tt">Good to <em>know</em></h2><p class="muted">Can't find your answer? Ask Sehat, our assistant, at the bottom right.</p></div>
      <div reveal="100">@for (f of faqs; track f[0]; let i = $index) {<details [open]="i===0"><summary>{{ f[0] }}</summary><p>{{ f[1] }}</p></details>}</div>
    </div>
  </section>
  `,
  styleUrl: './home.scss',
})
export class HomePage implements OnInit, OnDestroy {
  lock = inject(LockService); toast = inject(ToastService); router = inject(Router);
  h = H; specs = SPECIALITIES; coe = SPECIALITIES.filter(s => s.coe); docs = DOCTORS; pkgs = PACKAGES.slice(1, 5); tests = TESTIMONIALS; news = NEWS; blogs = BLOGS.slice(0, 3); faqs = FAQS; insurers = INSURERS; insX = [...INSURERS, ...INSURERS];
  slides = [IMG.hero, IMG.hero2, IMG.hero3]; coeImg = [IMG.care, IMG.icu, IMG.surgery, IMG.lab, IMG.check, IMG.nurse, IMG.hero2];
  ftabs = ['Doctor', 'Symptom', 'Health check']; ftab = signal('Doctor'); fSpec = ''; fName = ''; symptom = ''; pkFor = 'Men';
  slide = signal(0); ci = signal(0); tool = signal('BMI'); hcm = signal(168); wkg = signal(72); lmp = signal(new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10));
  quick: [string, string, string, boolean, string][] = [
    ['Book Appointment', '📅', 'In-person or video', false, '/book'], ['Find a Doctor', '🩺', 'By speciality or name', false, '/doctors'], ['Health Checks', '🧪', 'From ₹1,499', false, '/health-checks'], ['Lab Reports', '🧾', 'Download securely', true, ''],
    ['Video Consult', '🎥', 'Talk from home', true, ''], ['Second Opinion', '🔎', 'Expert case review', false, '/second-opinion'], ['Home Care', '🏠', 'Nursing & sample pickup', false, '/home-care'], ['Pharmacy', '💊', 'Order medicines', false, '/pharmacy'],
  ];
  private t?: ReturnType<typeof setInterval>;
  ngOnInit() { if (!document.documentElement.classList.contains('rm')) this.t = setInterval(() => this.slide.set((this.slide() + 1) % this.slides.length), 6000); }
  ngOnDestroy() { clearInterval(this.t); }
  suggest() { const q = this.symptom.toLowerCase(); if (q.length < 3) return null;
    const map: [string[], string][] = [[['chest', 'heart', 'bp', 'palpit'], 'cardiology'], [['head', 'migraine', 'seiz', 'numb'], 'neurology'], [['knee', 'back', 'joint', 'bone', 'shoulder'], 'orthopaedics'], [['stomach', 'acid', 'liver', 'vomit'], 'gastro'], [['cough', 'breath', 'asthma'], 'pulmonology'], [['sugar', 'thyroid', 'weight'], 'diabetes'], [['preg', 'period', 'baby'], 'mother-child'], [['kidney', 'urine', 'stone'], 'nephrology'], [['ear', 'nose', 'throat'], 'ent'], [['skin', 'hair', 'rash'], 'dermatology']];
    const hit = map.find(m => m[0].some(k => q.includes(k))); return hit ? SPECIALITIES.find(s => s.slug === hit[1])! : null; }
  find() {
    if (this.ftab() === 'Doctor') this.router.navigate(['/doctors'], { queryParams: { s: this.fSpec || null, q: this.fName || null } });
    else if (this.ftab() === 'Symptom') { const s = this.suggest(); if (s) this.router.navigate(['/specialities', s.slug]); else this.toast.show('Try words like “knee pain” or “cough”, or ask our assistant.', 'info'); }
    else this.router.navigate(['/health-checks'], { queryParams: { c: this.pkFor } });
  }
  off(p: { price: number; mrp: number }) { return Math.round((1 - p.price / p.mrp) * 100); }
  rail(d: number) { const r = document.getElementById('drail'); r?.scrollBy({ left: d * r.clientWidth * .8, behavior: 'smooth' }); }
  bmi = computed(() => { const m = this.hcm() / 100; return m > 0 ? this.wkg() / (m * m) : 0; });
  bmiLabel = computed(() => { const b = this.bmi(); return b < 18.5 ? 'Underweight' : b < 23 ? 'Healthy (Asian cut-off)' : b < 25 ? 'Overweight' : 'Obese range: consider a consult'; });
  bmiPos = computed(() => Math.min(100, Math.max(0, (this.bmi() - 14) / (36 - 14) * 100)));
  due = computed(() => { const d = new Date(this.lmp()); d.setDate(d.getDate() + 280); return d; });
}
