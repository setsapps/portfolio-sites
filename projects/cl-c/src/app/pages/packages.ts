import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LockService, RevealDirective, TiltDirective, ToastService } from '@shared/core';
import { IMG, PACKAGES, Pkg } from '../data';

@Component({
  standalone: true, imports: [RouterLink, DecimalPipe, RevealDirective, TiltDirective],
  template: `
  <section class="page-hero"><img [src]="img.lab" alt="" fetchpriority="high">
    <div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a routerLink="/">Home</a> / <span>Health Checks</span></nav>
      <h1>Preventive <em>health checks</em></h1><p>Packages for every age and need, with free home sample collection and same-day digital reports.</p></div>
  </section>
  <section class="sec" style="padding-top:40px">
    <div class="wrap">
      <div class="top" reveal>
        <div class="seg" role="group" aria-label="Category">@for (c of cats; track c) {<button [attr.aria-pressed]="cat()===c" (click)="cat.set(c)">{{ c }}</button>}</div>
        <button class="btn btn-l cartb" (click)="showCart.set(!showCart())" [attr.aria-expanded]="showCart()">🛒 Cart ({{ cart().length }})</button>
      </div>
      <div class="pg">
        @for (p of list(); track p.id; let i = $index) {
          <article class="pc card" [class.hot]="p.hot" tilt [reveal]="(i%3)*70">
            @if (p.hot) {<span class="rib">Best seller</span>}
            <span class="cat">{{ p.cat }}</span><h2>{{ p.name }}</h2>
            <div class="pr"><b>₹{{ p.price | number }}</b><s>₹{{ p.mrp | number }}</s><em>{{ off(p) }}% off</em></div>
            <p class="tc">🧪 {{ p.tests }} tests · 🏠 Home collection · 📱 Digital report</p>
            <details><summary>What's included</summary><ul>@for (x of p.incl; track x) {<li>{{ x }}</li>}</ul></details>
            <div class="pa">
              <button class="btn" [class.btn-p]="!inCart(p)" [class.btn-l]="inCart(p)" (click)="toggle(p)">{{ inCart(p) ? '✓ In cart' : 'Add to cart' }}</button>
              <label class="cmp"><input type="checkbox" [checked]="cmp().has(p.id)" (change)="tc(p)" [disabled]="!cmp().has(p.id) && cmp().size>=3"> Compare</label>
            </div>
          </article>
        }
      </div>
      @if (cmp().size >= 2) {
        <div class="cmpt card" reveal>
          <h2>Compare packages</h2>
          <div class="tw"><table><caption class="sr-only">Package comparison</caption>
            <thead><tr><th scope="col">Feature</th>@for (p of cmpList(); track p.id) {<th scope="col">{{ p.name }}</th>}</tr></thead>
            <tbody>
              <tr><th scope="row">Price</th>@for (p of cmpList(); track p.id) {<td>₹{{ p.price | number }}</td>}</tr>
              <tr><th scope="row">Tests</th>@for (p of cmpList(); track p.id) {<td>{{ p.tests }}</td>}</tr>
              @for (f of allIncl(); track f) {<tr><th scope="row">{{ f }}</th>@for (p of cmpList(); track p.id) {<td>{{ p.incl.includes(f) ? '✓' : '—' }}</td>}</tr>}
            </tbody></table></div>
        </div>
      }
    </div>
  </section>
  @if (showCart()) {
    <aside class="cart card" aria-label="Cart">
      <div class="ch"><b>Your cart</b><button (click)="showCart.set(false)" aria-label="Close cart">✕</button></div>
      @for (p of cart(); track p.id) {<div class="ci"><span>{{ p.name }}</span><b>₹{{ p.price | number }}</b><button (click)="toggle(p)" [attr.aria-label]="'Remove ' + p.name">✕</button></div>} @empty {<p class="muted">Your cart is empty.</p>}
      @if (cart().length) {<div class="ctot"><span>Total</span><b>₹{{ total() | number }}</b></div><button class="btn btn-a" (click)="checkout()">Checkout</button>}
    </aside>
  }
  `,
  styles: [`
  .top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px}
  .pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
  .pc{padding:24px;display:flex;flex-direction:column;gap:10px;position:relative;overflow:hidden}
  .pc.hot{border-color:var(--accent)}
  .rib{position:absolute;right:-34px;top:18px;transform:rotate(45deg);background:var(--accent);color:#fff;font-size:.7rem;font-weight:800;padding:5px 40px}
  .cat{font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
  .pc h2{font-size:1.35rem}
  .pr{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.pr b{font:700 2rem var(--font-display);color:var(--primary)}.pr s{color:var(--muted)}
  .pr em{font-style:normal;font-size:.75rem;font-weight:800;color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,transparent);padding:3px 8px;border-radius:6px}
  .tc{margin:0;font-size:.85rem;color:var(--muted)}
  details summary{cursor:pointer;font-weight:700;color:var(--primary);min-height:36px;display:flex;align-items:center}
  details ul{margin:6px 0;padding-left:18px;font-size:.88rem;color:var(--muted)}
  .pa{display:flex;justify-content:space-between;align-items:center;margin-top:auto;gap:10px}
  .cmp{display:flex;align-items:center;gap:6px;font-weight:700;font-size:.85rem}.cmp input{width:18px;height:18px;accent-color:var(--primary)}
  .cmpt{margin-top:30px;padding:24px}.cmpt h2{font-size:1.6rem;margin-bottom:14px}
  .tw{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:560px}th,td{padding:10px 14px;border-bottom:1px solid var(--line);text-align:left}
  thead th{background:var(--bg-2);font-family:var(--font-display)}td{color:var(--muted)}
  .cart{position:fixed;right:16px;top:150px;width:min(360px,calc(100vw - 32px));z-index:300;padding:20px;display:grid;gap:10px;box-shadow:0 30px 70px -20px rgba(0,0,0,.4);animation:s .3s}
  @keyframes s{from{opacity:0;transform:translateY(-10px)}}
  .ch{display:flex;justify-content:space-between}.ch button,.ci button{border:0;background:none;color:var(--muted);cursor:pointer;min-width:32px;min-height:32px}
  .ci{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;font-size:.9rem;padding:8px 0;border-bottom:1px dashed var(--line)}
  .ctot{display:flex;justify-content:space-between;font-size:1.2rem}.muted{color:var(--muted)}
  `],
})
export class PackagesPage {
  lock = inject(LockService); toast = inject(ToastService); route = inject(ActivatedRoute); img = IMG;
  cats = ['All', 'Basic', 'Men', 'Women', 'Senior', 'Heart', 'Diabetes'];
  cat = signal(this.route.snapshot.queryParamMap.get('c') || 'All'); cart = signal<Pkg[]>([]); cmp = signal(new Set<number>()); showCart = signal(false);
  list = computed(() => PACKAGES.filter(p => this.cat() === 'All' || p.cat === this.cat()));
  cmpList = computed(() => PACKAGES.filter(p => this.cmp().has(p.id)));
  allIncl = computed(() => [...new Set(this.cmpList().flatMap(p => p.incl))]);
  total = computed(() => this.cart().reduce((s, p) => s + p.price, 0));
  off(p: Pkg) { return Math.round((1 - p.price / p.mrp) * 100); }
  inCart(p: Pkg) { return this.cart().some(x => x.id === p.id); }
  toggle(p: Pkg) { if (this.inCart(p)) this.cart.update(c => c.filter(x => x.id !== p.id)); else { this.cart.update(c => [...c, p]); this.toast.show(p.name + ' added to cart', 'ok'); } }
  tc(p: Pkg) { const n = new Set(this.cmp()); n.has(p.id) ? n.delete(p.id) : n.add(p.id); this.cmp.set(n); }
  checkout() { this.showCart.set(false); this.lock.pay('Health check booking', this.total(), 'INR', [...this.cart().map(p => [p.name, p.price] as [string, number]), ['Home sample collection', 0]]); }
}
