import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective, ToastService } from '@shared/core';
import { IMG, JOBS, Job } from '../data';

@Component({
  standalone: true, imports: [FormsModule, RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.hotel" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Job board</span></nav>
      <h1 class="display">Careers that <em>move</em> you</h1><p>Roles from employers who are committed to women's advancement. Every posting is reviewed by our team before it goes live.</p>
      <div class="hero-b"><button class="btn btn-p" (click)="post.set(true)">Post a job</button><button class="btn btn-o" style="color:#fff" (click)="lock.gate('Job alerts')">🔔 Create job alert</button></div>
    </div>
  </section>
  <section class="sec" style="padding-top:50px">
    <div class="wrap">
      <div class="sbar card" role="search" reveal>
        <div class="field"><label for="jq">Keyword</label><input id="jq" [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Title or employer"></div>
        <div class="field"><label for="jl">Location</label><input id="jl" [ngModel]="loc()" (ngModelChange)="loc.set($event)" placeholder="City or “Remote”"></div>
        <div class="field"><label for="js">Sector</label><select id="js" [ngModel]="sector()" (ngModelChange)="sector.set($event)"><option value="">All sectors</option>@for (s of sectors; track s) {<option>{{ s }}</option>}</select></div>
        <div class="field"><label for="jt">Type</label><select id="jt" [ngModel]="type()" (ngModelChange)="type.set($event)"><option value="">All types</option>@for (t of types; track t) {<option>{{ t }}</option>}</select></div>
      </div>
      <div class="jl-g">
        <div>
          <p class="cnt" role="status" aria-live="polite"><b>{{ list().length }}</b> open roles</p>
          @for (j of list(); track j.id; let i = $index) {
            <article class="job card" [class.sel]="sel()?.id===j.id" [reveal]="i*40">
              <div class="lg" aria-hidden="true" [style.background]="tone(j.id)">{{ j.org[7] || j.org[0] }}</div>
              <div class="jb"><h2><button class="tl" (click)="sel.set(j)">{{ j.title }}</button></h2><p>{{ j.org }} · {{ j.city }}</p>
                <div class="tags"><span>{{ j.type }}</span><span>{{ j.sector }}</span><span>{{ j.salary }}</span>@if (j.featured) {<span class="ft">★ Featured</span>}</div></div>
              <div class="jr"><small>{{ j.days }}d ago</small><button class="btn btn-l" (click)="sel.set(j)">View</button></div>
            </article>
          } @empty { <p class="card" style="padding:30px;text-align:center">No roles match your search.</p> }
        </div>
        <aside class="detail card" aria-live="polite">
          @if (sel(); as j) {
            <span class="chip">{{ j.sector }}</span>
            <h2 class="display">{{ j.title }}</h2>
            <p class="org">{{ j.org }} · {{ j.city }}</p>
            <ul class="facts"><li><small>Type</small><b>{{ j.type }}</b></li><li><small>Salary</small><b>{{ j.salary }}</b></li><li><small>Posted</small><b>{{ j.days }} days ago</b></li></ul>
            <h3>About the role</h3>
            <p>Sample description. The employer's full posting appears here with responsibilities, requirements, benefits and how to apply.</p>
            <h3>Why this employer</h3>
            <p>Signed the CL-A employer pledge on flexible scheduling and transparent pay ranges.</p>
            <div class="da"><button class="btn btn-p" (click)="lock.gate('Apply with your CL-A profile')">Apply with CL-A profile</button><button class="btn btn-l" (click)="toast.show('Job saved to your list','ok')">♡ Save</button></div>
          } @else { <div class="ph"><div aria-hidden="true">💼</div><p>Select a role to see the details.</p></div> }
        </aside>
      </div>
    </div>
  </section>

  @if (post()) {
    <div class="ov" (click)="post.set(false)"></div>
    <div class="pm" role="dialog" aria-modal="true" aria-labelledby="pj">
      <button class="x" (click)="post.set(false)" aria-label="Close">✕</button>
      <ol class="st" aria-label="Steps">@for (s of ['Role','Details','Plan','Review']; track s; let i = $index) {<li [class.on]="i<=pstep()">{{ s }}</li>}</ol>
      <h2 id="pj" class="display">Post a job</h2>
      @switch (pstep()) {
        @case (0) { <div class="fg"><div class="field"><label for="p1">Job title *</label><input id="p1" [(ngModel)]="pj.title" required></div><div class="field"><label for="p2">Organization *</label><input id="p2" [(ngModel)]="pj.org"></div><div class="field"><label for="p3">Location</label><input id="p3" [(ngModel)]="pj.city"></div></div> }
        @case (1) { <div class="fg"><div class="field"><label for="p4">Sector</label><select id="p4" [(ngModel)]="pj.sector">@for (s of sectors; track s) {<option>{{ s }}</option>}</select></div><div class="field"><label for="p5">Salary range (required by our pay-transparency pledge)</label><input id="p5" [(ngModel)]="pj.salary" placeholder="$60k – $70k"></div><div class="field"><label for="p6">Description</label><textarea id="p6" rows="4"></textarea></div></div> }
        @case (2) { <div class="plans">@for (p of plans; track p.n) {<label class="plan"><input type="radio" name="pl" [value]="p.n" [(ngModel)]="pj.plan"><span><b>{{ p.n }}</b><small>{{ p.d }}</small></span><em>{{ '$' + p.p }}</em></label>}</div> }
        @case (3) { <div class="rev card"><p><b>{{ pj.title || 'Untitled role' }}</b> at {{ pj.org || '—' }}</p><p>{{ pj.city || 'Location TBC' }} · {{ pj.sector }} · {{ pj.salary || 'Salary TBC' }}</p><p>Plan: <b>{{ pj.plan }}</b>. Your post goes to our moderation queue and is usually reviewed within one business day.</p></div> }
      }
      <div class="pa">@if (pstep()>0) {<button class="btn btn-l" (click)="pstep.set(pstep()-1)">Back</button>}
        @if (pstep()<3) {<button class="btn btn-p" (click)="next()">Continue</button>} @else {<button class="btn btn-p" (click)="pay()">Pay &amp; submit for review</button>}</div>
    </div>
  }
  `,
  styles: [`
  .hero-b{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}
  .sbar{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:14px;padding:20px;margin-bottom:26px}
  .jl-g{display:grid;grid-template-columns:1.25fr .9fr;gap:24px;align-items:start}
  .cnt{color:var(--muted)}
  .job{display:grid;grid-template-columns:60px 1fr auto;gap:16px;align-items:center;padding:18px;margin-bottom:12px}
  .job.sel{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary) 20%,transparent)}
  .lg{width:60px;height:60px;border-radius:16px;display:grid;place-items:center;color:#fff;font:600 1.6rem var(--font-display)}
  .tl{background:none;border:0;padding:0;font:600 1.25rem var(--font-display);color:var(--text);cursor:pointer;text-align:left}.tl:hover{color:var(--primary)}
  .jb p{margin:2px 0 8px;color:var(--muted);font-size:.92rem}
  .tags{display:flex;flex-wrap:wrap;gap:6px}.tags span{font-size:.75rem;font-weight:700;padding:4px 10px;border-radius:999px;background:var(--bg-2)}.tags .ft{background:var(--primary);color:var(--on-primary)}
  .jr{display:grid;justify-items:end;gap:6px}.jr small{color:var(--muted)}.jr .btn{min-height:40px;padding:0 16px}
  .detail{position:sticky;top:90px;padding:28px;display:grid;gap:10px}.detail .chip{justify-self:start}.detail h2{font-size:2.1rem;font-weight:500}
  .org{color:var(--muted);margin:0}.facts{list-style:none;padding:0;margin:8px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .facts li{background:var(--bg);border-radius:14px;padding:10px}.facts small{display:block;color:var(--muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;font-weight:800}
  .detail h3{font:800 .78rem var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:6px}
  .detail p{margin:0}.da{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
  .ph{text-align:center;color:var(--muted);padding:40px 0}.ph div{font-size:3rem}
  @media (max-width:980px){.sbar{grid-template-columns:1fr 1fr}.jl-g{grid-template-columns:1fr}.detail{position:static}}
  @media (max-width:560px){.sbar{grid-template-columns:1fr}.job{grid-template-columns:48px 1fr}.lg{width:48px;height:48px}.jr{grid-column:1/-1;justify-items:start;grid-auto-flow:column;align-items:center}}
  .ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:400}
  .pm{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:var(--surface);border-radius:26px;padding:30px;z-index:401;display:grid;gap:14px}
  .x{position:absolute;right:14px;top:14px;width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer}
  .pm h2{font-size:2.2rem;font-weight:500}
  .st{display:flex;gap:6px;list-style:none;padding:0;margin:0 40px 0 0}.st li{flex:1;border-top:4px solid var(--line);padding-top:8px;font-size:.78rem;font-weight:800;color:var(--muted)}.st li.on{border-color:var(--primary);color:var(--text)}
  .fg{display:grid;gap:12px}
  .plans{display:grid;gap:10px}.plan{display:flex;align-items:center;gap:14px;padding:16px;border:1.5px solid var(--line);border-radius:16px;cursor:pointer}
  .plan:has(input:checked){border-color:var(--primary);background:color-mix(in srgb,var(--primary) 7%,transparent)}.plan input{accent-color:var(--primary);width:20px;height:20px}
  .plan span{flex:1;display:grid}.plan small{color:var(--muted)}.plan em{font:600 1.4rem var(--font-display);font-style:normal}
  .rev{padding:18px}.rev p{margin:0 0 6px}
  .pa{display:flex;justify-content:flex-end;gap:10px}
  `],
})
export class JobsPage {
  lock = inject(LockService); toast = inject(ToastService); img = IMG;
  sectors = [...new Set(JOBS.map(j => j.sector))]; types = [...new Set(JOBS.map(j => j.type))];
  q = signal(''); loc = signal(''); sector = signal(''); type = signal(''); sel = signal<Job | null>(JOBS[0]); post = signal(false); pstep = signal(0);
  pj = { title: '', org: '', city: '', sector: 'Hotels', salary: '', plan: 'Standard' };
  plans = [{ n: 'Standard', d: '30 days on the board', p: 149 }, { n: 'Featured', d: '30 days, pinned + newsletter mention', p: 299 }, { n: 'Partner bundle', d: '5 postings over 12 months', p: 599 }];
  list = computed(() => JOBS.filter(j => (!this.q() || (j.title + j.org).toLowerCase().includes(this.q().toLowerCase())) && (!this.loc() || j.city.toLowerCase().includes(this.loc().toLowerCase())) && (!this.sector() || j.sector === this.sector()) && (!this.type() || j.type === this.type())).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.days - b.days));
  tone(i: number) { return ['#b8235a', '#4a1834', '#c9974e', '#e2577f', '#7a2a55'][i % 5]; }
  next() { if (this.pstep() === 0 && !this.pj.title.trim()) { this.toast.show('Please add a job title', 'warn'); return; } this.pstep.set(this.pstep() + 1); }
  pay() { const p = this.plans.find(x => x.n === this.pj.plan)!; this.post.set(false); this.pstep.set(0); this.lock.pay('Job posting · ' + p.n, p.p, 'CAD', [[p.n + ' plan', p.p]]); }
}
