import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective, TiltDirective } from '@shared/core';
import { COURSES, Course, IMG } from '../data';

@Component({
  standalone: true, imports: [RouterLink, RevealDirective, TiltDirective],
  template: `
  <section class="page-hero"><img [src]="img.academy" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Learning Studio</span></nav>
      <h1 class="display">The Learning <em>Studio</em></h1><p>Practical courses built by operators. Learn at your own pace or join a live cohort, and earn a certificate you can add to LinkedIn.</p></div>
  </section>

  <section class="sec" style="padding-top:60px">
    <div class="wrap">
      <div class="lp card" reveal>
        <div><div class="eyebrow">Your learning path</div><h2 class="display">Pick a goal, we'll build the path</h2></div>
        <div class="pill-tabs" role="group" aria-label="Learning goal">
          @for (g of goals; track g[0]) { <button [attr.aria-pressed]="goal()===g[0]" (click)="goal.set(g[0])">{{ g[0] }}</button> }
        </div>
        <ol class="path">
          @for (c of pathFor(); track c.id; let i = $index) { <li><span class="n">{{ i+1 }}</span><b>{{ c.title }}</b><small>{{ c.hours }}h · {{ c.format }}</small></li> }
        </ol>
        <button class="btn btn-p" (click)="lock.gate('Enrol in learning path')">Enrol in this path</button>
      </div>

      <div class="sec-h" style="margin-top:80px" reveal><div><div class="eyebrow">Catalogue</div><h2>All <em>courses</em></h2></div>
        <div class="pill-tabs" role="group" aria-label="Filter by level">@for (l of levels; track l) {<button [attr.aria-pressed]="level()===l" (click)="level.set(l)">{{ l }}</button>}</div></div>
      <div class="cg">
        @for (c of list(); track c.id; let i = $index) {
          <article class="co card" tilt [reveal]="(i%4)*60">
            <div class="cv" [style.background]="cover(c.id)"><span class="lv">{{ c.level }}</span><span class="glyph" aria-hidden="true">{{ glyph(c.topic) }}</span></div>
            <div class="cb"><small>{{ c.topic }} · {{ c.format }}</small><h3>{{ c.title }}</h3>
              <div class="mt"><span>⏱ {{ c.hours }}h</span><span>▶ {{ c.lessons }} lessons</span><span>🎓 Certificate</span></div>
              <div class="cf"><b>{{ c.price ? ('$' + c.price) : 'Free' }}</b><button class="btn btn-p" (click)="enrol(c)">{{ c.price ? 'Enrol' : 'Start free' }}<span class="sr-only">: {{ c.title }}</span></button></div></div>
          </article>
        }
      </div>

      <div class="dash blur-lock" reveal style="margin-top:80px">
        <div class="inner card">
          <div class="dh"><b>My learning</b><span>3 courses in progress</span></div>
          @for (p of [72,40,15]; track p) { <div class="pr"><span>Course title</span><div class="b"><i [style.width.%]="p"></i></div><span>{{ p }}%</span></div> }
        </div>
        <div class="gate"><div class="eyebrow">Members only</div><h3 class="display" style="font-size:2rem">Track progress &amp; certificates</h3><button class="btn btn-p" (click)="lock.gate('My learning dashboard')">Sign in to view</button></div>
      </div>
    </div>
  </section>
  `,
  styles: [`
  .lp{padding:34px;display:grid;gap:18px;background:linear-gradient(135deg,var(--surface),var(--bg-2))}
  .lp h2{font-size:clamp(1.8rem,3vw,2.6rem);font-weight:500;margin-top:6px}
  .path{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;counter-reset:s}
  .path li{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:18px;display:grid;gap:4px;animation:pi .5s both}
  .path li:nth-child(2){animation-delay:.08s}.path li:nth-child(3){animation-delay:.16s}
  @keyframes pi{from{opacity:0;transform:translateY(10px)}}
  .path .n{width:34px;height:34px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;font-weight:800}
  .path small{color:var(--muted)}
  .lp .btn{justify-self:start}
  .cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
  .co{overflow:hidden;display:flex;flex-direction:column}
  .cv{height:150px;position:relative;display:grid;place-items:center;color:#fff}
  .lv{position:absolute;left:14px;top:14px;font-size:.72rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;background:rgba(255,255,255,.22);padding:5px 10px;border-radius:999px;backdrop-filter:blur(6px)}
  .glyph{font-size:3.4rem;filter:drop-shadow(0 10px 20px rgba(0,0,0,.25))}
  .cb{padding:20px;display:flex;flex-direction:column;gap:8px;flex:1}.cb small{color:var(--muted);font-weight:700}
  .cb h3{font:600 1.3rem/1.2 var(--font-display)}
  .mt{display:flex;gap:10px;flex-wrap:wrap;font-size:.8rem;color:var(--muted)}
  .cf{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:12px}.cf b{font:600 1.4rem var(--font-display)}.cf .btn{min-height:42px;padding:0 16px}
  .dash .inner{padding:30px;display:grid;gap:16px}.dh{display:flex;justify-content:space-between}
  .pr{display:grid;grid-template-columns:160px 1fr 50px;gap:14px;align-items:center}.b{height:10px;border-radius:10px;background:var(--bg-2)}.b i{display:block;height:100%;border-radius:10px;background:var(--grad)}
  `],
})
export class AcademyPage {
  lock = inject(LockService); img = IMG;
  levels = ['All', 'Foundation', 'Intermediate', 'Advanced'];
  goals: [string, string[]][] = [['Become a manager', ['Leadership', 'People']], ['Run the numbers', ['Finance', 'Operations']], ['Join a board', ['Governance', 'Leadership']], ['Look after myself', ['Wellbeing']]];
  level = signal('All'); goal = signal('Become a manager');
  list = computed(() => COURSES.filter(c => this.level() === 'All' || c.level === this.level()));
  pathFor = computed(() => { const t = this.goals.find(g => g[0] === this.goal())![1]; const l = COURSES.filter(c => t.includes(c.topic)); return (l.length >= 3 ? l : [...l, ...COURSES.filter(c => !l.includes(c))]).slice(0, 3); });
  cover(i: number) { return ['linear-gradient(135deg,#b8235a,#ef9a86)', 'linear-gradient(135deg,#4a1834,#b8235a)', 'linear-gradient(135deg,#c9974e,#e2577f)', 'linear-gradient(135deg,#7a2a55,#d9a066)'][i % 4]; }
  glyph(t: string) { return ({ Leadership: '★', Finance: '◆', Governance: '⚖', Wellbeing: '✿', Operations: '⚙', People: '☺' } as Record<string, string>)[t] || '✦'; }
  enrol(c: Course) { if (c.price) this.lock.pay(c.title, c.price, 'CAD', [['Course access (12 months)', c.price]]); else this.lock.gate('Course enrolment'); }
}
