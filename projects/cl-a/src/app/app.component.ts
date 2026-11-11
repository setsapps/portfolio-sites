import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LockService, ThemeService, ToastService } from '@shared/core';
import { LockModalComponent, CheckoutComponent, CookieConsentComponent, ToastsComponent, ThemePickerComponent, SearchOverlayComponent, ChatbotComponent, BotIntent } from '@shared/ui';
import { BRAND, IMG, SEARCH_INDEX } from './data';
import { IconComponent } from '@shared/icons';

@Component({
  selector: 'app-root', standalone: true,
  imports: [IconComponent, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, LockModalComponent, CheckoutComponent, CookieConsentComponent, ToastsComponent, ThemePickerComponent, SearchOverlayComponent, ChatbotComponent],
  template: `
  @if (bar()) {
  <div class="ann" role="region" aria-label="Announcement">
    <span class="ann-dot" aria-hidden="true"></span>
    <span><b>Rise Leadership Forum 2027</b> · Early-bird tickets are open. <a routerLink="/summit">Get tickets →</a></span>
    <button (click)="bar.set(false)" aria-label="Dismiss announcement"><x-ic n="✕"></x-ic></button>
  </div>
  }
  <header class="hd" [class.solid]="solid()" [class.over]="overHero()">
    <div class="wrap nav">
      <a routerLink="/" class="logo" aria-label="CL-A home">
        <span class="mk" aria-hidden="true"><svg viewBox="0 0 48 48"><defs><linearGradient id="lg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e2577f"/><stop offset="1" stop-color="#b8235a"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#lg)"/><circle cx="24" cy="24" r="17" fill="none" stroke="#fff" stroke-opacity=".5" stroke-dasharray="2 3"/><text x="24" y="31" text-anchor="middle" font-family="Bodoni Moda,Georgia,serif" font-style="italic" font-size="20" fill="#fff">A</text></svg></span>
        <span class="lt"><b>{{ brand.name }}</b><small>{{ brand.long }}</small></span>
      </a>
      <nav aria-label="Primary" class="pn">
        <ul>
          <li class="mm" (mouseenter)="mega.set('prog')" (mouseleave)="mega.set('')">
            <button [attr.aria-expanded]="mega()==='prog'" aria-controls="mm-prog" (click)="mega.set(mega()==='prog'?'':'prog')">Programs <i aria-hidden="true">▾</i></button>
            @if (mega()==='prog') {
            <div class="mega" id="mm-prog">
              <div class="mg-col">
                <a routerLink="/summit" (click)="mega.set('')"><b>Rise Leadership Forum</b><span>Our annual summit</span></a>
                <a routerLink="/mentorship" (click)="mega.set('')"><b>Mentor Circles</b><span>Six-month small-group mentoring</span></a>
                <a routerLink="/academy" (click)="mega.set('')"><b>Learning Studio</b><span>Courses and live cohorts</span></a>
                <a routerLink="/events" (click)="mega.set('')"><b>The Kitchen Table</b><span>Culinary supper series</span></a>
              </div>
              <a class="mg-feat" routerLink="/summit" (click)="mega.set('')"><img [src]="img.summit" alt="" loading="lazy"><span class="chip">Apr 2027</span><b>Rise Leadership Forum 2027</b><small>Early-bird tickets now open →</small></a>
            </div>
            }
          </li>
          <li><a routerLink="/events" routerLinkActive="on">Events</a></li>
          <li><a routerLink="/resources" routerLinkActive="on">Resources</a></li>
          <li><a routerLink="/jobs" routerLinkActive="on">Jobs</a></li>
          <li class="mm" (mouseenter)="mega.set('inv')" (mouseleave)="mega.set('')">
            <button [attr.aria-expanded]="mega()==='inv'" aria-controls="mm-inv" (click)="mega.set(mega()==='inv'?'':'inv')">Get involved <i aria-hidden="true">▾</i></button>
            @if (mega()==='inv') {
            <div class="mega sm" id="mm-inv">
              <div class="mg-col">
                <a routerLink="/membership" (click)="mega.set('')"><b>Become a member</b><span>Plans for individuals and teams</span></a>
                <a routerLink="/donate" (click)="mega.set('')"><b>Donate</b><span>Fund scholarships and programs</span></a>
                <a routerLink="/mentorship" (click)="mega.set('')"><b>Volunteer as a mentor</b><span>Give back to the next generation</span></a>
                <a routerLink="/about" (click)="mega.set('')"><b>About us</b><span>Mission, team and board</span></a>
              </div>
            </div>
            }
          </li>
        </ul>
      </nav>
      <div class="act">
        <button class="ic" (click)="lock.searchOpen.set(true)" aria-label="Search (Ctrl+K)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>
        <button class="ic hide-sm" (click)="lock.gate('Members’ Lounge')" aria-label="Member sign in"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></button>
        <a class="btn btn-p hide-sm" routerLink="/donate">Donate</a>
        <a class="btn btn-o hide-md" routerLink="/membership">Join</a>
        <button class="ic burger" (click)="drawer.set(true)" aria-label="Open menu" [attr.aria-expanded]="drawer()"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>

  @if (drawer()) {
  <div class="dr-ov" (click)="drawer.set(false)"></div>
  <nav class="drawer" aria-label="Mobile">
    <button class="ic cl" (click)="drawer.set(false)" aria-label="Close menu"><x-ic n="✕"></x-ic></button>
    @for (l of mobile; track l[0]) { <a [routerLink]="l[1]" (click)="drawer.set(false)">{{ l[0] }}</a> }
    <div class="dr-b"><a class="btn btn-p" routerLink="/donate" (click)="drawer.set(false)">Donate</a><button class="btn btn-o" (click)="drawer.set(false); lock.gate('Members’ Lounge')">Member sign in</button></div>
  </nav>
  }

  <main id="main" tabindex="-1"><router-outlet /></main>

  <footer class="ft">
    <div class="wrap">
      <div class="ft-cta">
        <h2 class="display">Your seat at the table <em class="script">is waiting.</em></h2>
        <div class="ft-cta-b"><a class="btn btn-p" routerLink="/membership">Become a member</a><a class="btn btn-o" routerLink="/donate">Support our work</a></div>
      </div>
      <div class="ft-g">
        <div class="ft-brand">
          <a routerLink="/" class="logo"><span class="lt"><b>{{ brand.name }}</b><small>{{ brand.long }}</small></span></a>
          <p>A non-profit association creating opportunity for women across recreation, tourism and hospitality.</p>
          <form class="nl" (ngSubmit)="sub()"><label for="nl" class="sr-only">Email for newsletter</label><input id="nl" name="nl" type="email" [(ngModel)]="nl" placeholder="Your email" autocomplete="email"><button class="btn btn-p">Subscribe</button></form>
          <div class="soc">@for (s of socials; track s) {<a href="#" [attr.aria-label]="s">{{ s[0] }}</a>}</div>
        </div>
        <div><h3>Programs</h3><a routerLink="/summit">Leadership Forum</a><a routerLink="/mentorship">Mentor Circles</a><a routerLink="/academy">Learning Studio</a><a routerLink="/events">Kitchen Table</a></div>
        <div><h3>Explore</h3><a routerLink="/events">Events</a><a routerLink="/resources">Resources</a><a routerLink="/jobs">Job board</a><a routerLink="/members">Members’ Lounge</a></div>
        <div><h3>Organization</h3><a routerLink="/about">About</a><a routerLink="/donate">Donate</a><a routerLink="/contact">Contact</a><button class="lnk" (click)="lock.cookiePrefsOpen.set(true)">Cookie settings</button></div>
      </div>
      <div class="ft-b"><span>© 2026 {{ brand.name }} · Registered non-profit · {{ brand.city }}</span><span><a href="#">Privacy</a> · <a href="#">Accessibility (WCAG 2.2 AA)</a> · <a href="#">Terms</a></span></div>
    </div>
  </footer>

  <x-search [items]="index" [popular]="['Mentorship','Webinar','Toolkit','Hotels','Forum']" placeholder="Search events, courses, resources, jobs…" />
  <x-lock /><x-checkout /><x-cookies /><x-toasts /><x-theme />
  <x-bot name="Rosie · CL-A assistant" avatar="✿" hint="Hi! Ask me anything" greeting="Hi, I'm Rosie! I can help you find events, mentorship, courses or membership info." [starters]="['Upcoming events','Find a mentor','Membership prices','Post a job']" [intents]="intents" fallback="Good question! I'll pass that to our team, or you can try one of these:" />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  lock = inject(LockService); th = inject(ThemeService); toast = inject(ToastService); router = inject(Router);
  brand = BRAND; img = IMG; index = SEARCH_INDEX;
  bar = signal(true); solid = signal(false); overHero = signal(true); drawer = signal(false); mega = signal(''); nl = '';
  socials = ['Instagram', 'LinkedIn', 'Facebook', 'YouTube'];
  mobile: [string, string][] = [['Home', '/'], ['Leadership Forum', '/summit'], ['Mentor Circles', '/mentorship'], ['Learning Studio', '/academy'], ['Events', '/events'], ['Resources', '/resources'], ['Job board', '/jobs'], ['Membership', '/membership'], ['About', '/about'], ['Contact', '/contact']];
  intents: BotIntent[] = [
    { keys: ['event', 'upcoming', 'forum', 'summit'], reply: 'Next up: our Negotiating Your Next Role webinar (Nov 26), The Kitchen Table winter supper (Dec 4) and the Holiday Members Social (Dec 11). Taking you to Events now…', route: '/events', chips: ['Forum tickets', 'Find a mentor'] },
    { keys: ['mentor'], reply: 'Mentor Circles are six-month small groups matched by goals and sector. Applications for the January cohort are open. Opening Mentorship…', route: '/mentorship', chips: ['Membership prices'] },
    { keys: ['price', 'membership', 'join', 'cost'], reply: 'Plans start at $0 for students, $95/yr for individuals and $1,200/yr for organizations (up to 10 seats). Opening Membership…', route: '/membership' },
    { keys: ['job', 'hire', 'post'], reply: 'Employers can post roles to our job board. Posts are reviewed before they go live. Opening the job board…', route: '/jobs' },
    { keys: ['ticket'], reply: 'Forum early-bird tickets are $295. Opening the Forum page…', route: '/summit' },
    { keys: ['donat', 'give', 'support'], reply: 'Thank you! Gifts fund scholarships and free programming. Opening Donate…', route: '/donate' },
    { keys: ['course', 'learn', 'academy'], reply: 'The Learning Studio has self-paced courses and live cohorts. Several foundation courses are free. Opening it now…', route: '/academy' },
    { keys: ['login', 'sign in', 'account', 'lounge'], reply: 'The Members’ Lounge needs a member sign-in. Let me open that for you.', lock: 'Members’ Lounge' },
  ];
  constructor() {
    this.router.events.subscribe(e => { if (e instanceof NavigationEnd) { this.drawer.set(false); this.mega.set(''); this.onScroll(); } });
  }
  @HostListener('window:scroll') onScroll() { this.solid.set(window.scrollY > 40); }
  @HostListener('document:keydown.escape') esc() { this.mega.set(''); this.drawer.set(false); }
  sub() { if (!/^\S+@\S+\.\S+$/.test(this.nl)) { this.toast.show('Please enter a valid email address', 'warn'); return; } this.toast.show('You’re subscribed. Welcome to the letter.', 'ok'); this.nl = ''; }
}
