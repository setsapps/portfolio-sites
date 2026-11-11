import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LockService, ToastService } from '@shared/core';
import { LockModalComponent, CheckoutComponent, CookieConsentComponent, ToastsComponent, ThemePickerComponent, SearchOverlayComponent, ChatbotComponent, BotIntent } from '@shared/ui';
import { SEARCH_INDEX } from './data';
import { IconComponent } from '@shared/icons';

@Component({
  selector: 'app-root', standalone: true,
  imports: [IconComponent, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, LockModalComponent, CheckoutComponent, CookieConsentComponent, ToastsComponent, ThemePickerComponent, SearchOverlayComponent, ChatbotComponent],
  template: `
  <header class="hd" [class.hide]="hide()">
    <div class="pill glass">
      <a routerLink="/" class="logo" aria-label="CL-B home"><svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true"><defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#ffd28a"/><stop offset="1" stop-color="#ff5f8f"/></linearGradient></defs><path d="M6 50 26 18l10 14 7-9 15 27z" fill="url(#lg)"/><circle cx="46" cy="16" r="5" fill="#ffd28a"/></svg><b>CL-B</b></a>
      <nav aria-label="Primary"><ul>
        <li><a routerLink="/experiences" routerLinkActive="on">Experiences</a></li>
        <li><a routerLink="/events" routerLinkActive="on">Events</a></li>
        <li><a routerLink="/plan" routerLinkActive="on">Plan a trip</a></li>
        <li><a routerLink="/about" routerLinkActive="on">About</a></li>
      </ul></nav>
      <div class="act">
        <button class="ic" (click)="lock.searchOpen.set(true)" aria-label="Search (Ctrl+K)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>
        <button class="ic" (click)="lock.gate('Wishlist')" aria-label="Wishlist"><x-ic n="♡"></x-ic></button>
        <button class="ic hide-sm" (click)="lock.gate('Account')" aria-label="Sign in"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></button>
        <a class="btn btn-p cta" routerLink="/experiences">Book</a>
        <button class="ic menu" (click)="menu.set(true)" aria-label="Open menu" [attr.aria-expanded]="menu()"><x-ic n="☰"></x-ic></button>
      </div>
    </div>
  </header>

  @if (menu()) {
    <div class="mo" role="dialog" aria-modal="true" aria-label="Menu">
      <button class="ic x" (click)="menu.set(false)" aria-label="Close menu"><x-ic n="✕"></x-ic></button>
      <nav aria-label="Full menu">@for (l of links; track l[1]; let i = $index) {<a [routerLink]="l[1]" (click)="menu.set(false)" [style.animation-delay.ms]="i*60"><small>0{{ i+1 }}</small>{{ l[0] }}</a>}</nav>
      <div class="mo-f"><button class="btn btn-p" (click)="menu.set(false); lock.gate('Account')">Sign in</button><button class="btn btn-o" (click)="menu.set(false); lock.cookiePrefsOpen.set(true)">Cookie settings</button></div>
    </div>
  }

  <main id="main" tabindex="-1"><router-outlet /></main>

  <footer class="ft">
    <div class="wrap">
      <div class="big" aria-hidden="true">CL-B</div>
      <div class="fg">
        <div><p class="tag">Journeys that host the world.</p><form class="nl" (ngSubmit)="sub()"><label for="nl" class="sr-only">Email</label><input id="nl" name="nl" type="email" [(ngModel)]="nl" placeholder="Your email for journey notes" autocomplete="email"><button class="btn btn-p">Subscribe</button></form></div>
        <div><h3>Explore</h3><a routerLink="/experiences">Experiences</a><a routerLink="/events">Events</a><a routerLink="/plan">Trip planner</a></div>
        <div><h3>Company</h3><a routerLink="/about">About</a><a routerLink="/about" fragment="partners">Partners</a><button class="lnk" (click)="lock.cookiePrefsOpen.set(true)">Cookie settings</button></div>
        <div><h3>Members</h3><button class="lnk" (click)="lock.gate('Member lounge')">Member lounge</button><button class="lnk" (click)="lock.gate('Bookings')">My bookings</button><button class="lnk" (click)="lock.gate('Partner portal')">Partner portal</button></div>
      </div>
      <div class="fb"><span>© 2026 CL-B</span><span>3D journey rendered in real time with WebGL</span><span><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Accessibility</a></span></div>
    </div>
  </footer>

  <x-search [items]="index" [popular]="['Lodge','Aurora','Kayak','Culinary','Summit']" placeholder="Search experiences, stays, events…" />
  <x-lock /><x-checkout /><x-cookies /><x-toasts /><x-theme />
  <x-bot name="Nova · journey concierge" avatar="✦" hint="Plan a trip with me" greeting="Hi, I'm Nova, your journey concierge. Where should we take you?" [starters]="['Aurora nights','Lakeside lodge','Plan my trip','Group events']" [intents]="intents" fallback="Lovely idea. I can pass that to our concierge team, or try:" />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  lock = inject(LockService); toast = inject(ToastService); router = inject(Router); index = SEARCH_INDEX;
  menu = signal(false); hide = signal(false); nl = ''; private lastY = 0;
  links: [string, string][] = [['Journey', '/'], ['Experiences', '/experiences'], ['Events', '/events'], ['Plan a trip', '/plan'], ['About', '/about']];
  intents: BotIntent[] = [
    { keys: ['aurora', 'northern', 'night', 'star'], reply: 'Aurora Nights is our most-requested experience: heated domes, a guide and hot cocoa by the lake. Opening experiences…', route: '/experiences' },
    { keys: ['lodge', 'stay', 'hotel', 'cabin'], reply: 'The lakeside lodge has timber cabins, a sauna and a chef’s table. Opening stays…', route: '/experiences' },
    { keys: ['plan', 'itinerary', 'trip'], reply: 'Let’s build your itinerary. Opening the trip planner…', route: '/plan' },
    { keys: ['event', 'group', 'conference', 'summit'], reply: 'We host retreats, summits and team journeys. Opening events…', route: '/events' },
    { keys: ['book', 'price', 'pay'], reply: 'You can book any experience securely. Member rates need a sign-in.', lock: 'Booking' },
  ];
  constructor() { this.router.events.subscribe(e => { if (e instanceof NavigationEnd) this.menu.set(false); }); }
  @HostListener('window:scroll') onScroll() { const y = scrollY; this.hide.set(y > this.lastY && y > 300); this.lastY = y; }
  @HostListener('document:keydown.escape') esc() { this.menu.set(false); }
  sub() { if (!/^\S+@\S+\.\S+$/.test(this.nl)) { this.toast.show('Please enter a valid email', 'warn'); return; } this.toast.show('Welcome aboard. Journey notes are on their way.', 'ok'); this.nl = ''; }
}
