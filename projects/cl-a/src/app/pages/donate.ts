import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective } from '@shared/core';
import { IMG } from '../data';

@Component({
  standalone: true, imports: [FormsModule, RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.hero" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Donate</span></nav>
      <h1 class="display">Invest in <em>her</em> next step</h1><p>Your gift funds Forum scholarships, free webinars and Mentor Circles for women who couldn't otherwise take part. Tax receipts are issued for eligible gifts.</p></div>
  </section>
  <section class="sec">
    <div class="wrap dg">
      <form class="card dn" (ngSubmit)="give()" reveal>
        <div class="freq" role="group" aria-label="Frequency">@for (f of ['One-time','Monthly','Yearly']; track f) {<button type="button" [attr.aria-pressed]="freq()===f" (click)="freq.set(f)">{{ f }}</button>}</div>
        <fieldset><legend class="lg">Choose an amount (CAD)</legend>
          <div class="amts">@for (a of amounts; track a) {<label><input type="radio" name="a" [value]="a" [ngModel]="amt()" (ngModelChange)="amt.set(+$event); custom=''"><span>{{ '$' + a }}</span></label>}</div>
        </fieldset>
        <div class="field"><label for="ca">Other amount</label><input id="ca" name="ca" inputmode="numeric" [(ngModel)]="custom" (ngModelChange)="amt.set(+$event || 0)" placeholder="$"></div>
        <p class="imp" aria-live="polite">{{ impact() }}</p>
        <div class="field"><label for="ds">Direct my gift to</label><select id="ds" name="ds" [(ngModel)]="fund"><option>Where it's needed most</option><option>Forum scholarships</option><option>Mentor Circles</option><option>Free webinars</option></select></div>
        <label class="ck"><input type="checkbox" name="tr" [(ngModel)]="tribute"> Give in honour or memory of someone</label>
        @if (tribute) { <div class="field"><label for="tn">Honouree name</label><input id="tn" name="tn"></div> }
        <label class="ck"><input type="checkbox" name="fee" [(ngModel)]="fees"> Add {{ '$' + feeAmt() }} to cover processing fees</label>
        <label class="ck"><input type="checkbox" name="anon"> Keep my gift anonymous</label>
        <button class="btn btn-p big">Give {{ '$' + total() }} {{ freq()==='One-time' ? '' : freq().toLowerCase() }}</button>
        <p class="sec-n">🔒 Secure, PCI-compliant payment · Apple Pay · Google Pay · cards</p>
      </form>
      <div class="side">
        <div class="card goal" reveal="100">
          <div class="eyebrow">Scholarship fund · sample campaign</div>
          <h2 class="display">Send 20 women to the Forum</h2>
          <div class="bar"><i [style.width.%]="62"></i></div>
          <p class="muted">Progress bar shows how a live campaign appears. The client sets the real goal and amounts.</p>
        </div>
        <div class="card ways" reveal="180">
          <h3 class="display">Other ways to give</h3>
          @for (w of ways; track w[0]) { <button (click)="lock.gate(w[0])"><span aria-hidden="true">{{ w[1] }}</span><b>{{ w[0] }}</b><small>{{ w[2] }}</small></button> }
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
  .dg{display:grid;grid-template-columns:1.1fr .9fr;gap:26px;align-items:start}
  .dn{padding:34px;display:grid;gap:16px}
  .freq{display:flex;background:var(--bg-2);border-radius:999px;padding:5px}.freq button{flex:1;min-height:46px;border:0;border-radius:999px;background:transparent;font-weight:800;cursor:pointer;color:var(--muted)}
  .freq button[aria-pressed=true]{background:var(--surface);color:var(--text);box-shadow:0 4px 12px rgba(0,0,0,.08)}
  fieldset{border:0;margin:0;padding:0}.lg{font-weight:800;margin-bottom:10px}
  .amts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.amts label{position:relative}.amts input{position:absolute;opacity:0}
  .amts span{display:grid;place-items:center;min-height:64px;border-radius:16px;border:1.5px solid var(--line);font:500 1.6rem var(--font-display);cursor:pointer;transition:.2s}
  .amts input:checked+span{background:var(--primary);color:var(--on-primary);border-color:var(--primary);transform:scale(1.03)}
  .amts input:focus-visible+span{outline:3px solid var(--focus);outline-offset:3px}
  .imp{background:var(--bg-2);border-radius:14px;padding:14px 16px;margin:0;font-weight:600}
  .ck{display:flex;align-items:center;gap:10px;font-weight:600;cursor:pointer}.ck input{width:20px;height:20px;accent-color:var(--primary)}
  .big{min-height:60px;font-size:1.1rem}.sec-n{text-align:center;color:var(--muted);font-size:.85rem;margin:0}
  .side{display:grid;gap:20px}
  .goal{padding:30px;display:grid;gap:12px}.goal h2{font-size:2rem;font-weight:500}
  .bar{height:14px;border-radius:14px;background:var(--bg-2);overflow:hidden}.bar i{display:block;height:100%;background:var(--grad);border-radius:14px;animation:gr 1.6s cubic-bezier(.2,.8,.2,1)}@keyframes gr{from{width:0!important}}
  .muted{color:var(--muted);font-size:.85rem;margin:0}
  .ways{padding:24px;display:grid;gap:8px}.ways h3{font-size:1.6rem;font-weight:500;margin-bottom:6px}
  .ways button{display:grid;grid-template-columns:44px 1fr;gap:2px 12px;text-align:left;padding:14px;border-radius:16px;border:1px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer}
  .ways button span{grid-row:span 2;font-size:1.6rem;display:grid;place-items:center}.ways small{color:var(--muted)}
  @media (max-width:900px){.dg{grid-template-columns:1fr}}
  `],
})
export class DonatePage {
  lock = inject(LockService); img = IMG;
  amounts = [25, 50, 100, 250, 500, 1000]; amt = signal(100); freq = signal('Monthly'); custom = ''; fund = "Where it's needed most"; tribute = false; fees = true;
  feeAmt = computed(() => Math.round(this.amt() * 0.03 * 100) / 100);
  total = computed(() => Math.round((this.amt() + (this.fees ? this.feeAmt() : 0)) * 100) / 100);
  impact = computed(() => { const a = this.amt(); return a >= 500 ? 'Example: could underwrite a full Forum scholarship.' : a >= 100 ? 'Example: could fund a seat in a Mentor Circle.' : a > 0 ? 'Example: helps keep webinars free for everyone.' : 'Choose an amount to see its impact.'; });
  ways = [['Corporate matching', '🏢', 'Double your gift through your employer'], ['Gift of securities', '📈', 'Donate shares tax-efficiently'], ['Legacy giving', '🕊', 'Include CL-A in your will'], ['Sponsor an event', '🎟', 'Put your brand behind the Forum']];
  give() { const t = this.total(); this.lock.pay(`Donation · ${this.freq()}`, t, 'CAD', [[this.fund, this.amt()], ['Processing fees', this.fees ? this.feeAmt() : 0]]); }
}
