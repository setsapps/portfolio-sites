import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LockService, ThemeService, ToastService } from '@shared/core';
import { LockModalComponent, CheckoutComponent, CookieConsentComponent, ToastsComponent, SearchOverlayComponent, ChatbotComponent, BotIntent } from '@shared/ui';
import { H, SEARCH_INDEX, SPECIALITIES } from './data';
import { IconComponent } from '@shared/icons';

@Component({
  selector: 'app-root', standalone: true,
  imports: [IconComponent, RouterOutlet, RouterLink, RouterLinkActive, LockModalComponent, CheckoutComponent, CookieConsentComponent, ToastsComponent, SearchOverlayComponent, ChatbotComponent],
  template: `
  <div class="util">
    <div class="wrap ut">
      <a class="em" [href]="'tel:' + h.emergency"><span class="pulse" aria-hidden="true"></span>Emergency 24×7 <b>{{ h.emergency }}</b></a>
      <div class="ut-r">
        <a [href]="'tel:' + h.phone" class="hide-sm"><x-ic n="📞"></x-ic> Appointments {{ h.phone }}</a>
        <a href="#" class="hide-sm" (click)="$event.preventDefault(); toast.show('WhatsApp chat opens in the live site','info')"><x-ic n="💬"></x-ic> WhatsApp</a>
        <label class="lang"><span class="sr-only">Language</span><select (change)="lang($event)" aria-label="Language"><option>English</option><option>ਪੰਜਾਬੀ</option><option>हिन्दी</option></select></label>
        <button class="pl" (click)="lock.gate('Patient portal')"><x-ic n="👤"></x-ic> Patient login</button>
      </div>
    </div>
  </div>
  <header class="hd" [class.solid]="solid()">
    <div class="wrap nav">
      <a routerLink="/" class="logo" aria-label="Ludhiana Hospital home">
        <span class="mk" aria-hidden="true"><svg viewBox="0 0 48 48"><rect width="48" height="48" rx="14" fill="var(--primary)"/><path d="M20 10h8v10h10v8H28v10h-8V28H10v-8h10z" fill="#fff"/><circle cx="38" cy="10" r="5" fill="var(--accent)"/></svg></span>
        <span class="lt"><b>Ludhiana Hospital</b><small>{{ h.tagline }}</small></span>
      </a>
      <nav aria-label="Primary" class="pn">
        <ul>
          <li class="mm" (mouseenter)="mega.set('sp')" (mouseleave)="mega.set('')">
            <button [attr.aria-expanded]="mega()==='sp'" aria-controls="mg-sp" (click)="mega.set(mega()==='sp'?'':'sp')">Specialities ▾</button>
            @if (mega()==='sp') {
              <div class="mega" id="mg-sp"><div class="mg-in">
                <div class="mg-g">@for (s of specs; track s.slug) {<a [routerLink]="['/specialities', s.slug]" (click)="mega.set('')"><span aria-hidden="true"><x-ic [n]="s.icon"></x-ic></span>{{ s.name }}</a>}</div>
                <div class="mg-f"><b>Not sure who to see?</b><p>Describe your symptoms to our assistant or call the helpline.</p><a class="btn btn-p" routerLink="/specialities" (click)="mega.set('')">All specialities</a></div>
              </div></div>
            }
          </li>
          <li><a routerLink="/doctors" routerLinkActive="on">Find a Doctor</a></li>
          <li><a routerLink="/health-checks" routerLinkActive="on">Health Checks</a></li>
          <li class="mm" (mouseenter)="mega.set('pt')" (mouseleave)="mega.set('')">
            <button [attr.aria-expanded]="mega()==='pt'" aria-controls="mg-pt" (click)="mega.set(mega()==='pt'?'':'pt')">Patient Care ▾</button>
            @if (mega()==='pt') {
              <div class="mega sm" id="mg-pt"><div class="mg-in one">
                @for (p of patientLinks; track p[1]) {<a [routerLink]="p[1]" (click)="mega.set('')"><span aria-hidden="true"><x-ic [n]="p[2]"></x-ic></span><span><b>{{ p[0] }}</b><small>{{ p[3] }}</small></span></a>}
              </div></div>
            }
          </li>
          <li><a routerLink="/about" routerLinkActive="on">About</a></li>
        </ul>
      </nav>
      <div class="act">
        <button class="sb" (click)="lock.searchOpen.set(true)" aria-label="Search doctors, specialities, tests (Ctrl+K)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span class="hide-md">Search</span><kbd class="hide-md">Ctrl K</kbd></button>
        <a class="btn btn-a" routerLink="/book">Book Appointment</a>
        <button class="burger" (click)="drawer.set(true)" aria-label="Open menu" [attr.aria-expanded]="drawer()"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>

  @if (drawer()) {
    <div class="dr-ov" (click)="drawer.set(false)"></div>
    <nav class="drawer" aria-label="Mobile">
      <button class="cl" (click)="drawer.set(false)" aria-label="Close menu"><x-ic n="✕"></x-ic></button>
      @for (l of mobile; track l[1]) {<a [routerLink]="l[1]" (click)="drawer.set(false)">{{ l[0] }}</a>}
    </nav>
  }

  <main id="main" tabindex="-1"><router-outlet /></main>

  <footer class="ft">
    <div class="wrap">
      <div class="ft-top">
        <div class="ft-cta"><h2>Need help choosing a doctor?</h2><p>Our care coordinators are available 8 am – 10 pm, every day.</p></div>
        <div class="ft-b"><a class="btn btn-a" [href]="'tel:' + h.phone"><x-ic n="📞"></x-ic> Call now</a><a class="btn btn-o" routerLink="/book">Book online</a></div>
      </div>
      <div class="ft-g">
        <div class="fb">
          <a routerLink="/" class="logo"><span class="lt"><b>Ludhiana Hospital</b><small>{{ h.tagline }}</small></span></a>
          <p>{{ h.address }}</p>
          <p>Emergency: <b>{{ h.emergency }}</b><br>Email: {{ h.email }}</p>
          <div class="apps"><span><x-ic n="📱"></x-ic> Patient app</span><button (click)="lock.gate('Patient app')">App Store</button><button (click)="lock.gate('Patient app')">Google Play</button></div>
        </div>
        <div><h3>Specialities</h3>@for (s of specs.slice(0,7); track s.slug) {<a [routerLink]="['/specialities', s.slug]">{{ s.name }}</a>}</div>
        <div><h3>Patients</h3>@for (p of patientLinks; track p[1]) {<a [routerLink]="p[1]">{{ p[0] }}</a>}</div>
        <div><h3>Hospital</h3><a routerLink="/about">About us</a><a routerLink="/careers">Careers</a><a routerLink="/health-library">Health library</a><a routerLink="/contact">Contact &amp; directions</a><button class="lnk" (click)="lock.cookiePrefsOpen.set(true)">Cookie settings</button></div>
      </div>
      <div class="ft-bt"><span>© 2026 Ludhiana Hospital. All rights reserved.</span><span class="demo">Preview build · doctor profiles, prices and timings shown are sample data</span><span><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Patient rights</a> · <a href="#">Accessibility</a></span></div>
    </div>
  </footer>

  <nav class="mbar" aria-label="Quick actions">
    <a [href]="'tel:' + h.emergency" class="r"><x-ic n="🚑"></x-ic><span>Emergency</span></a>
    <a routerLink="/book"><x-ic n="📅"></x-ic><span>Book</span></a>
    <a routerLink="/doctors"><x-ic n="🩺"></x-ic><span>Doctors</span></a>
    <button (click)="lock.searchOpen.set(true)"><x-ic n="🔍"></x-ic><span>Search</span></button>
  </nav>

  <x-search [items]="index" [popular]="['Cardiologist','Knee replacement','Health check','Lab reports','Gynaecologist']" placeholder="Search doctors, specialities, symptoms, tests…" />
  <x-lock /><x-checkout /><x-cookies /><x-toasts />
  <x-bot name="Sehat · LH Assistant" avatar="🩺" hint="Namaste! How can I help?" greeting="Sat Sri Akal! I'm Sehat, the Ludhiana Hospital assistant. I can help you book, find a doctor, check packages or get emergency help." [starters]="['Book appointment','Chest pain','Health packages','Lab reports','Insurance']" [intents]="intents" fallback="I'll connect you with a care coordinator. Meanwhile, you can try:" />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  lock = inject(LockService); toast = inject(ToastService); router = inject(Router); th = inject(ThemeService);
  h = H; specs = SPECIALITIES; index = SEARCH_INDEX;
  solid = signal(false); drawer = signal(false); mega = signal('');
  patientLinks: [string, string, string, string][] = [
    ['Book appointment', '/book', '📅', 'In-person or video'], ['Lab reports & records', '/patient-portal', '🧾', 'Sign in with mobile OTP'], ['Insurance & TPA', '/insurance', '🛡', 'Cashless, CGHS, ECHS, PM-JAY'],
    ['International patients', '/international', '🌏', 'Visa, travel & stay'], ['Second opinion', '/second-opinion', '🔎', 'Expert case review'], ['Home care', '/home-care', '🏠', 'Nursing, physio, sample pickup'],
    ['Pharmacy', '/pharmacy', '💊', 'Order medicines'], ['Emergency', '/emergency', '🚑', '24×7 trauma & ambulance'],
  ];
  mobile: [string, string][] = [['Home', '/'], ['Specialities', '/specialities'], ['Find a Doctor', '/doctors'], ['Book Appointment', '/book'], ['Health Checks', '/health-checks'], ['Lab reports', '/patient-portal'], ['Emergency', '/emergency'], ['Insurance & TPA', '/insurance'], ['International patients', '/international'], ['Second opinion', '/second-opinion'], ['Home care', '/home-care'], ['Pharmacy', '/pharmacy'], ['Health library', '/health-library'], ['About', '/about'], ['Careers', '/careers'], ['Contact', '/contact']];
  intents: BotIntent[] = [
    { keys: ['chest', 'heart attack', 'breath', 'unconscious', 'bleeding', 'accident', 'stroke'], reply: 'Important: these can be signs of an emergency. Please call our 24×7 emergency line ' + H.emergency + ' now or go to the nearest emergency department. Opening Emergency info…', route: '/emergency' },
    { keys: ['book', 'appointment', 'consult', 'opd'], reply: 'Sure! You can book in 4 quick steps: speciality → doctor → time slot → patient details. Opening the booking page…', route: '/book' },
    { keys: ['package', 'health check', 'checkup', 'check-up'], reply: 'Our health checks start at ₹1,499. Popular: Executive Men ₹4,999, Executive Women ₹5,299, Senior Citizen ₹5,999. Opening packages…', route: '/health-checks' },
    { keys: ['report', 'result', 'lab'], reply: 'Lab reports are in the patient portal. You will sign in with your mobile OTP and doctor referral number.', lock: 'Lab reports' },
    { keys: ['insurance', 'tpa', 'cashless', 'cghs', 'echs', 'ayushman', 'pmjay'], reply: 'We accept major insurers and TPAs plus CGHS, ECHS and PM-JAY. Opening Insurance & TPA…', route: '/insurance' },
    { keys: ['knee', 'joint', 'bone', 'back'], reply: 'For joint and bone problems, our Orthopaedics team can help. Opening the speciality page…', route: '/specialities/orthopaedics' },
    { keys: ['pregnan', 'baby', 'delivery', 'child'], reply: 'Our Mother & Child centre covers pregnancy, delivery, NICU and paediatrics. Opening it…', route: '/specialities/mother-child' },
    { keys: ['sugar', 'diabet', 'thyroid'], reply: 'Our Diabetes & Endocrinology clinic can help. Opening it…', route: '/specialities/diabetes' },
    { keys: ['doctor', 'specialist'], reply: 'You can filter doctors by speciality, language, gender and availability. Opening Find a Doctor…', route: '/doctors' },
    { keys: ['timing', 'visiting', 'hours'], reply: 'OPD: Mon–Sat 9 am – 5 pm. Emergency, pharmacy and lab are open 24×7. Ward visiting hours are 4–7 pm.' },
    { keys: ['location', 'address', 'direction', 'parking'], reply: 'We are in Ludhiana, Punjab, with visitor parking on site. Opening directions…', route: '/contact' },
  ];
  constructor() { this.router.events.subscribe(e => { if (e instanceof NavigationEnd) { this.drawer.set(false); this.mega.set(''); } }); }
  @HostListener('window:scroll') onScroll() { this.solid.set(window.scrollY > 30); }
  @HostListener('document:keydown.escape') esc() { this.mega.set(''); this.drawer.set(false); }
  lang(e: Event) { const v = (e.target as HTMLSelectElement).value; if (v !== 'English') this.toast.show(`${v} translation is enabled in the live site (multilingual CMS).`, 'info'); }
}
