import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective } from '@shared/core';
import { IMG } from '../data';

@Component({
  standalone: true, imports: [RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.mentor" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Mentor Circles</span></nav>
      <h1 class="display">Mentor <em>Circles</em></h1><p>Six months. Five women. One experienced mentor. Small-group mentoring matched by your goals, sector and stage of career.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:26px"><a class="btn btn-p" href="#match">Find my circle</a><button class="btn btn-o" style="color:#fff" (click)="lock.gate('Mentor application')">Apply to mentor</button></div></div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="how">
        @for (s of steps; track s[0]; let i = $index) {
          <div class="hs card" [reveal]="i*90"><span class="n display">0{{ i+1 }}</span><h2>{{ s[0] }}</h2><p>{{ s[1] }}</p></div>
        }
      </div>
    </div>
  </section>

  <section class="sec quiz-sec" id="match" aria-labelledby="mq">
    <div class="wrap qz card" reveal>
      <div class="ql">
        <div class="eyebrow">Smart matching</div>
        <h2 id="mq" class="display">Find your circle in <em class="script">60 seconds</em></h2>
        <p>Answer three questions. Our matching engine compares your goals with mentors' strengths and circle availability.</p>
        <div class="prog"><i [style.width.%]="(q()/qs.length)*100"></i></div>
      </div>
      <div class="qr" aria-live="polite">
        @if (q() < qs.length) {
          <fieldset><legend><small>Question {{ q()+1 }} of {{ qs.length }}</small>{{ qs[q()].t }}</legend>
            <div class="opts">@for (o of qs[q()].o; track o) { <button (click)="pick(o)">{{ o }}</button> }</div></fieldset>
          @if (q() > 0) { <button class="lnk" (click)="q.set(q()-1)">← Back</button> }
        } @else {
          <div class="res">
            <div class="ring" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--primary)" stroke-width="10" stroke-linecap="round" stroke-dasharray="327" stroke-dashoffset="40" transform="rotate(-90 60 60)" class="arc"/></svg><b>3</b></div>
            <h3 class="display">3 circles match your answers</h3>
            <p>Based on: {{ answers.join(' · ') }}</p>
            <div class="blur-lock" style="width:100%"><div class="inner mlist">@for (m of [1,2,3]; track m) {<div class="mc"><i></i><span>Mentor name · Sector · Circle starts Jan</span></div>}</div>
              <div class="gate"><button class="btn btn-p" (click)="lock.gate('Mentor match results')">Sign in to see your matches</button></div></div>
            <button class="lnk" (click)="reset()">Start over</button>
          </div>
        }
      </div>
    </div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="wrap two">
      <div class="side card" reveal><div class="eyebrow">For mentees</div><h2 class="display">What you get</h2><ul>@for (x of mentee; track x) {<li>{{ x }}</li>}</ul><button class="btn btn-p" (click)="lock.gate('Mentee application')">Apply as a mentee</button></div>
      <div class="side card dark" reveal="120"><div class="eyebrow">For mentors</div><h2 class="display">Lift as you climb</h2><ul>@for (x of mentor; track x) {<li>{{ x }}</li>}</ul><button class="btn btn-p" (click)="lock.gate('Mentor application')">Volunteer as a mentor</button></div>
    </div>
  </section>
  `,
  styles: [`
  .how{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
  .hs{padding:28px;display:grid;gap:8px}.hs .n{font-size:3rem;font-style:italic;color:var(--primary);line-height:1}.hs h2{font:600 1.4rem var(--font-display)}.hs p{color:var(--muted);margin:0}
  @media (max-width:900px){.how{grid-template-columns:1fr 1fr}}@media (max-width:560px){.how{grid-template-columns:1fr}}
  .quiz-sec{background:var(--bg-2)}
  .qz{display:grid;grid-template-columns:.9fr 1.1fr;gap:40px;padding:44px;align-items:center}
  .qz h2{font-size:clamp(2rem,3.6vw,3.2rem);font-weight:500;margin:10px 0}.qz h2 em{font-size:1.2em}
  .ql p{color:var(--muted)}
  .prog{height:8px;border-radius:8px;background:var(--bg-2);overflow:hidden;margin-top:20px}.prog i{display:block;height:100%;background:var(--grad);transition:width .5s}
  fieldset{border:0;padding:0;margin:0}legend{font:500 1.7rem/1.2 var(--font-display);margin-bottom:18px}legend small{display:block;font:800 .75rem var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--primary);margin-bottom:6px}
  .opts{display:grid;gap:10px}
  .opts button{min-height:58px;text-align:left;padding:0 20px;border-radius:16px;border:1.5px solid var(--line);background:var(--surface);color:var(--text);font-weight:700;cursor:pointer;transition:.2s}
  .opts button:hover{border-color:var(--primary);transform:translateX(6px)}
  .lnk{background:none;border:0;color:var(--primary);font-weight:700;cursor:pointer;margin-top:12px;min-height:44px}
  .res{display:grid;justify-items:center;text-align:center;gap:10px}
  .ring{position:relative;width:120px;height:120px}.ring b{position:absolute;inset:0;display:grid;place-items:center;font:500 2.6rem var(--font-display)}
  .arc{animation:dr 1.2s cubic-bezier(.2,.8,.2,1) both}@keyframes dr{from{stroke-dashoffset:327}}
  .res h3{font-size:1.8rem;font-weight:500}.res p{color:var(--muted)}
  .mlist{display:grid;gap:8px;padding:10px}.mc{display:flex;gap:12px;align-items:center;padding:12px;border-radius:14px;background:var(--surface);border:1px solid var(--line)}.mc i{width:40px;height:40px;border-radius:50%;background:var(--grad)}
  @media (max-width:860px){.qz{grid-template-columns:1fr;padding:26px}}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .side{padding:36px;display:grid;gap:12px;align-content:start}.side h2{font-size:2.4rem;font-weight:500}
  .side ul{margin:0;padding-left:20px;display:grid;gap:8px}.side .btn{justify-self:start;margin-top:8px}
  .dark{background:var(--plum);color:#fff;border-color:transparent}.dark .eyebrow{color:var(--salmon)}
  @media (max-width:760px){.two{grid-template-columns:1fr}}
  `],
})
export class MentorshipPage {
  lock = inject(LockService); img = IMG;
  steps = [['Apply', 'Tell us your goals and what you want from a mentor.'], ['Match', 'We group five mentees with one mentor by sector and goals.'], ['Meet', 'Monthly circle sessions plus one-to-one check-ins.'], ['Grow', 'Finish with a plan, a network and a certificate.']];
  qs = [
    { t: 'Where are you in your career?', o: ['Early career (0–3 yrs)', 'Mid-level (4–10 yrs)', 'Senior / executive', 'Changing careers'] },
    { t: 'Which sector are you in?', o: ['Hotels & lodging', 'Food & beverage', 'Tourism & travel', 'Recreation & parks'] },
    { t: 'What is your main goal?', o: ['Get promoted', 'Start a business', 'Build confidence', 'Join a board'] },
  ];
  q = signal(0); answers: string[] = [];
  mentee = ['A matched circle of peers at a similar stage', 'Monthly facilitated sessions with your mentor', 'Goal-setting toolkit and progress check-ins', 'Certificate and alumni network access'];
  mentor = ['Two hours a month, fully online if you prefer', 'Mentor training and a facilitation guide', 'Recognition at the Rise Leadership Forum', 'A community of fellow mentors'];
  pick(o: string) { this.answers[this.q()] = o; this.q.set(this.q() + 1); }
  reset() { this.answers = []; this.q.set(0); }
}
