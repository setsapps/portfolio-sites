import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LockService, RevealDirective, ToastService, store } from '@shared/core';
import { IMG, RESOURCES, Resource } from '../data';
import { IconComponent } from '@shared/icons';

@Component({
  standalone: true, imports: [IconComponent, DatePipe, FormsModule, RouterLink, RevealDirective],
  template: `
  <section class="page-hero"><img [src]="img.talk" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Resources</span></nav>
      <h1 class="display">The resource <em>library</em></h1><p>Guides, toolkits, templates, webinars and podcasts, curated by the CL-A community. Search, filter and save what you need.</p>
      <div class="big-search"><label for="rq" class="sr-only">Search the library</label><input id="rq" type="search" placeholder="Try “negotiation”, “policy”, “hiring”…" [ngModel]="q()" (ngModelChange)="q.set($event)"><span aria-hidden="true"><x-ic n="⌕"></x-ic></span></div>
    </div>
  </section>
  <section class="sec" style="padding-top:56px">
    <div class="wrap lib">
      <aside class="filters card" [class.open]="fo()" aria-label="Filters">
        <div class="fh"><b>Filters</b><button class="lnk" (click)="clear()">Clear all</button></div>
        <fieldset><legend>Format</legend>
          @for (t of types; track t) { <label class="ck"><input type="checkbox" [checked]="tsel().has(t)" (change)="tog(tsel, t)"> {{ t }} <span class="n">{{ countBy('type', t) }}</span></label> }
        </fieldset>
        <fieldset><legend>Topic</legend>
          @for (t of topics; track t) { <label class="ck"><input type="checkbox" [checked]="psel().has(t)" (change)="tog(psel, t)"> {{ t }} <span class="n">{{ countBy('topic', t) }}</span></label> }
        </fieldset>
        <fieldset><legend>Access</legend>
          @for (a of ['All','Free','Members']; track a) { <label class="ck"><input type="radio" name="acc" [checked]="acc()===a" (change)="acc.set(a)"> {{ a }}</label> }
        </fieldset>
        <label class="ck"><input type="checkbox" [checked]="savedOnly()" (change)="savedOnly.set(!savedOnly())"> <x-ic n="♥"></x-ic> Saved only ({{ saved().size }})</label>
      </aside>
      <div>
        <div class="bar">
          <button class="btn btn-l fbtn" (click)="fo.set(!fo())" [attr.aria-expanded]="fo()">Filters</button>
          <span role="status" aria-live="polite"><b>{{ list().length }}</b> of {{ all.length }} resources</span>
          <div class="active">@for (c of chips(); track c) {<button class="chip" (click)="rm(c)" [attr.aria-label]="'Remove filter ' + c">{{ c }} <x-ic n="✕"></x-ic></button>}</div>
          <label class="sort">Sort <select [ngModel]="sort()" (ngModelChange)="sort.set($event)"><option value="new">Newest</option><option value="az">A–Z</option><option value="short">Quickest read</option></select></label>
        </div>
        <div class="grid">
          @for (r of list(); track r.id; let i = $index) {
            <article class="rc card" [reveal]="(i%3)*60">
              <div class="top"><span class="fmt" [class]="'fmt f-' + r.type"><x-ic [n]="icon(r.type)"></x-ic> {{ r.type }}</span>
                <button class="heart" [attr.aria-pressed]="saved().has(r.id)" (click)="save(r)" [attr.aria-label]="(saved().has(r.id) ? 'Unsave ' : 'Save ') + r.title"><x-ic [n]="saved().has(r.id) ? 'heart-fill' : 'heart'"></x-ic></button></div>
              <h2>{{ r.title }}</h2><p>{{ r.blurb }}</p>
              <div class="ft"><span>{{ r.topic }} · {{ r.date | date:'MMM y' }} · {{ r.mins }} min</span>
                <button class="btn" [class.btn-p]="r.access==='Free'" [class.btn-l]="r.access!=='Free'" (click)="openR(r)">@if (r.access === 'Free') {Open} @else {<x-ic n="lock"></x-ic> Members}<span class="sr-only">: {{ r.title }}</span></button></div>
            </article>
          } @empty { <div class="empty card"><b>No matches.</b><p>Try removing a filter or searching another word.</p><button class="btn btn-p" (click)="clear()">Reset filters</button></div> }
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
  .big-search{position:relative;margin-top:30px;max-width:640px}
  .big-search input{width:100%;min-height:64px;border-radius:999px;border:0;padding:0 64px 0 26px;font-size:1.1rem;background:rgba(255,255,255,.95);color:#2a1320;box-shadow:0 20px 50px -20px rgba(0,0,0,.5)}
  .big-search span{position:absolute;right:24px;top:50%;transform:translateY(-50%);font-size:1.6rem;color:#b8235a}
  .lib{display:grid;grid-template-columns:280px 1fr;gap:30px}
  .filters{position:sticky;top:90px;align-self:start;padding:22px;max-height:calc(100vh - 110px);overflow:auto}
  .fh{display:flex;justify-content:space-between;margin-bottom:10px}.lnk{background:none;border:0;color:var(--primary);font-weight:700;cursor:pointer}
  fieldset{border:0;padding:0;margin:0 0 18px}legend{font-size:.75rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
  .ck{display:flex;align-items:center;gap:10px;min-height:38px;cursor:pointer;font-weight:600}.ck input{width:18px;height:18px;accent-color:var(--primary)}
  .n{margin-left:auto;font-size:.75rem;background:var(--bg-2);padding:2px 8px;border-radius:999px}
  .bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;color:var(--muted)}
  .active{display:flex;gap:6px;flex-wrap:wrap;flex:1}.active .chip{border:0;cursor:pointer}
  .sort select{min-height:42px;border-radius:12px;border:1.5px solid var(--line);background:var(--surface);color:var(--text);padding:0 10px;margin-left:6px}
  .fbtn{display:none}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:18px}
  .rc{padding:22px;display:flex;flex-direction:column;gap:10px}
  .top{display:flex;justify-content:space-between;align-items:center}
  .fmt{font-size:.75rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:6px 10px;border-radius:8px;background:var(--bg-2);color:var(--primary)}
  .heart{width:40px;height:40px;border-radius:50%;border:1.5px solid var(--line);background:var(--surface);color:var(--primary);font-size:1.2rem;cursor:pointer;transition:transform .2s}
  .heart[aria-pressed=true]{background:var(--primary);color:var(--on-primary);transform:scale(1.08)}
  .rc h2{font:600 1.35rem/1.2 var(--font-display)}.rc p{color:var(--muted);margin:0;font-size:.95rem}
  .ft{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:12px;border-top:1px dashed var(--line);font-size:.8rem;color:var(--muted);flex-wrap:wrap}
  .ft .btn{min-height:40px;padding:0 14px;font-size:.85rem}
  .empty{grid-column:1/-1;padding:40px;text-align:center;display:grid;gap:8px;justify-items:center}
  @media (max-width:900px){.lib{grid-template-columns:1fr}.filters{position:static;display:none;max-height:none}.filters.open{display:block}.fbtn{display:inline-flex}}
  `],
})
export class ResourcesPage {
  lock = inject(LockService); toast = inject(ToastService); img = IMG; all = RESOURCES;
  types = [...new Set(RESOURCES.map(r => r.type))]; topics = [...new Set(RESOURCES.map(r => r.topic))];
  q = signal(''); tsel = signal(new Set<string>()); psel = signal(new Set<string>()); acc = signal('All'); sort = signal('new'); fo = signal(false); savedOnly = signal(false);
  saved = signal(new Set<number>(JSON.parse(store.get('cla:saved') || '[]')));
  list = computed(() => {
    const q = this.q().trim().toLowerCase();
    const l = RESOURCES.filter(r => (!q || (r.title + r.blurb + r.topic + r.type).toLowerCase().includes(q)) && (!this.tsel().size || this.tsel().has(r.type)) && (!this.psel().size || this.psel().has(r.topic)) && (this.acc() === 'All' || r.access === this.acc()) && (!this.savedOnly() || this.saved().has(r.id)));
    return l.sort((a, b) => this.sort() === 'az' ? a.title.localeCompare(b.title) : this.sort() === 'short' ? a.mins - b.mins : b.date.localeCompare(a.date));
  });
  chips = computed(() => [...this.tsel(), ...this.psel(), ...(this.acc() !== 'All' ? [this.acc()] : [])]);
  countBy(k: 'type' | 'topic', v: string) { return RESOURCES.filter(r => r[k] === v).length; }
  tog(s: typeof this.tsel, v: string) { const n = new Set(s()); n.has(v) ? n.delete(v) : n.add(v); s.set(n); }
  rm(c: string) { if (this.tsel().has(c)) this.tog(this.tsel, c); else if (this.psel().has(c)) this.tog(this.psel, c); else this.acc.set('All'); }
  clear() { this.tsel.set(new Set()); this.psel.set(new Set()); this.acc.set('All'); this.q.set(''); this.savedOnly.set(false); }
  save(r: Resource) { const n = new Set(this.saved()); n.has(r.id) ? n.delete(r.id) : n.add(r.id); this.saved.set(n); store.set('cla:saved', JSON.stringify([...n])); this.toast.show(n.has(r.id) ? 'Saved to your library' : 'Removed from saved', 'ok'); }
  openR(r: Resource) { if (r.access === 'Members') this.lock.gate('Members-only resource'); else this.lock.gate('Resource download'); }
  icon(t: string) { return ({ Guide: '📘', Toolkit: '🧰', Webinar: '🎥', Report: '📊', Podcast: '🎧', Template: '📄' } as Record<string, string>)[t] || '•'; }
}
