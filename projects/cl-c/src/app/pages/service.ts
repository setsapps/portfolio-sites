import { Component, Input, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LockService, RevealDirective } from '@shared/core';
import { IMG } from '../data';

interface Svc { t: string; em: string; d: string; img: string; feats: [string, string, string][]; cta: string; steps?: string[]; }
const SV: Record<string, Svc> = {
  'international': { t: 'International', em: 'patients', d: 'For NRIs and patients from abroad: we help with medical visa letters, airport pickup, stay and interpreters.', img: IMG.hero2, cta: 'Request a treatment plan',
    feats: [['🛂', 'Visa assistance', 'Medical visa invitation letters.'], ['✈', 'Airport pickup', 'Transfers from Ludhiana and Chandigarh airports.'], ['🏨', 'Stay', 'Guest-house partners near the hospital.'], ['🗣', 'Interpreters', 'Language support on request.']], steps: ['Share reports', 'Get a plan & estimate', 'Plan your travel', 'Arrive & treatment'] },
  'second-opinion': { t: 'Expert', em: 'second opinion', d: 'Upload your reports and get a written opinion from a specialist, usually within 48 hours.', img: IMG.care, cta: 'Start a second opinion',
    feats: [['⬆', 'Upload reports', 'Scans, labs and prescriptions.'], ['👩‍⚕️', 'Specialist review', 'Matched to the right department.'], ['📝', 'Written opinion', 'Clear recommendations.'], ['🎥', 'Video follow-up', 'Discuss with the doctor.']], steps: ['Upload', 'Pay review fee', 'Specialist reviews', 'Receive opinion'] },
  'home-care': { t: 'Care at', em: 'home', d: 'Nursing, physiotherapy, sample collection and doctor visits at your doorstep across Ludhiana.', img: IMG.nurse, cta: 'Book a home visit',
    feats: [['🧪', 'Sample collection', 'Free with health checks.'], ['💉', 'Nursing care', 'Injections, dressings, post-op care.'], ['🧘', 'Physiotherapy', 'Rehab after surgery or stroke.'], ['👨‍⚕️', 'Doctor visit', 'For elderly and bed-bound patients.']] },
  'pharmacy': { t: 'Hospital', em: 'pharmacy', d: 'Genuine medicines from our 24×7 pharmacy. Upload a prescription for home delivery.', img: IMG.lab, cta: 'Upload prescription',
    feats: [['📄', 'Upload prescription', 'Photo or PDF.'], ['✅', 'Pharmacist check', 'Verified before dispatch.'], ['🛵', 'Home delivery', 'Same-day in Ludhiana.'], ['🔁', 'Refill reminders', 'Never miss a dose.']] },
  'careers': { t: 'Careers at', em: 'Ludhiana Hospital', d: 'Join a team of doctors, nurses and staff who care. See current openings and apply online.', img: IMG.surgery, cta: 'Apply online',
    feats: [['🩺', 'Doctors', 'Consultants and residents.'], ['👩‍⚕️', 'Nursing', 'Staff nurses and ICU nurses.'], ['🧪', 'Allied health', 'Lab, radiology, physio.'], ['🏢', 'Administration', 'Front office, billing, IT.']] },
};

@Component({
  standalone: true, imports: [RouterLink, RevealDirective],
  template: `
  @if (s(); as s) {
  <section class="page-hero"><img [src]="s.img" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>{{ s.t }} {{ s.em }}</span></nav>
      <h1>{{ s.t }} <em>{{ s.em }}</em></h1><p>{{ s.d }}</p>
      <button class="btn btn-a" style="margin-top:22px" (click)="lock.gate(s.t + ' ' + s.em)">{{ s.cta }}</button></div>
  </section>
  <section class="sec"><div class="wrap">
    <div class="g">@for (f of s.feats; track f[1]; let i = $index) {<div class="f card" [reveal]="i*60"><span aria-hidden="true">{{ f[0] }}</span><h2>{{ f[1] }}</h2><p>{{ f[2] }}</p></div>}</div>
    @if (s.steps) {<ol class="st" reveal>@for (x of s.steps; track x; let i = $index) {<li><span>{{ i+1 }}</span>{{ x }}</li>}</ol>}
  </div></section>
  } @else {
    <section class="sec"><div class="wrap"><h1>Page not found</h1><p><a routerLink="/">Back to home</a></p></div></section>
  }`,
  styles: [`
  .g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.f{padding:24px;display:grid;gap:6px}.f span{font-size:2rem}.f h2{font-size:1.2rem}.f p{color:var(--muted);margin:0}
  .st{list-style:none;padding:0;margin:30px 0 0;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;counter-reset:s}
  .st li{display:flex;gap:10px;align-items:center;padding:16px;border-radius:14px;background:var(--bg-2);font-weight:700}.st span{width:34px;height:34px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;flex:none}
  @media (max-width:860px){.g,.st{grid-template-columns:1fr 1fr}}
  `],
})
export class ServicePage {
  lock = inject(LockService); title = inject(Title); private k = signal('');
  @Input() set svc(v: string) { this.k.set(v); const s = SV[v]; if (s) this.title.setTitle(`${s.t} ${s.em} · Ludhiana Hospital`); }
  s = computed(() => SV[this.k()]);
}
