import { Component, inject, signal, computed, Input, ElementRef, ViewChild, effect, HostListener, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LockService, SITE, ThemeService, ToastService, store } from './core';
import { IconComponent } from './icons';
import { RefGateComponent } from './refgate';

/* =========================================================
   LOCK MODAL — the "advanced feature" gate (demo only)
   mode email: email + password → members-only → request access
   mode otp-referral: phone → OTP → doctor referral no. → pending
   ========================================================= */
@Component({
  selector: 'x-lock', standalone: true, imports: [IconComponent, FormsModule, RefGateComponent],
  template: `
  @if (lock.open()) {
  <div class="ov" (click)="close()"></div>
  <div class="dlg" role="dialog" aria-modal="true" aria-labelledby="lk-h" #dlg (keydown)="trap($event)">
    <button class="x" (click)="close()" aria-label="Close"><x-ic n="✕"></x-ic></button>
    @if (cfg.lockMode === 'email') {
    <div class="lk-top">
      <div class="lk-ico" aria-hidden="true"><x-ic n="lock" s="26"></x-ic></div>
      <div>
        <div class="lk-eb">Secure area · {{ lock.feature() }}</div>
        <h2 id="lk-h">{{ cfg.lockTitle }}</h2>
      </div>
    </div>
    } @else { <h2 id="lk-h" class="sr-only">{{ cfg.lockTitle }}</h2> }

    @if (cfg.lockMode === 'email') {
      @switch (step()) {
        @case (0) {
          <form (ngSubmit)="emailLogin()" class="f">
            <div class="sso">
              <button type="button" class="sso-b" (click)="sso('Google')"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6C12.3 13.5 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.4 28.8A14.5 14.5 0 0 1 9.5 24c0-1.7.3-3.3.9-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.4 0-11.7-4-13.6-9.6l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg>Continue with Google</button>
              <button type="button" class="sso-b" (click)="sso('LinkedIn')"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#0A66C2" d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.5V9h3.6v11.5z"/></svg>Continue with LinkedIn</button>
            </div>
            <div class="or"><span>or sign in with email</span></div>
            <label for="lk-e">Email</label>
            <input id="lk-e" type="email" name="e" [(ngModel)]="email" required autocomplete="username" placeholder="you@organization.com">
            <label for="lk-p">Password</label>
            <div class="pw"><input id="lk-p" [type]="showPw() ? 'text':'password'" name="p" [(ngModel)]="pw" required autocomplete="current-password">
              <button type="button" class="eye" (click)="showPw.set(!showPw())" [attr.aria-label]="showPw() ? 'Hide password' : 'Show password'">{{ showPw() ? 'Hide' : 'Show' }}</button></div>
            <div class="row"><label class="ck"><input type="checkbox" name="r" [(ngModel)]="remember"> Keep me signed in</label><a href="#" (click)="$event.preventDefault(); step.set(3)">Forgot password?</a></div>
            @if (err()) { <p class="err" role="alert">{{ err() }}</p> }
            <button class="go" [disabled]="busy()">@if (busy()) {<span class="spin"></span> Verifying…} @else { Sign in securely }</button>
            <p class="tiny"><x-ic n="🔒"></x-ic> 256-bit TLS · 2-step verification · {{ cfg.lockNote }}</p>
          </form>
        }
        @case (1) {
          <div class="state">
            <div class="badge-lock">Access restricted</div>
            <p>This area is available to <b>verified members</b> only. Your account <b>{{ email }}</b> doesn't have access yet.</p>
            <button class="go" (click)="step.set(2)">Request member access</button>
            <button class="ghost" (click)="step.set(0)">Try another account</button>
          </div>
        }
        @case (2) {
          <form class="f" (ngSubmit)="requested()">
            <label for="lk-n">Full name</label><input id="lk-n" name="n" [(ngModel)]="name" required autocomplete="name">
            <label for="lk-o">Organization</label><input id="lk-o" name="o" [(ngModel)]="org" autocomplete="organization">
            <label for="lk-w">Why do you need access?</label><textarea id="lk-w" name="w" rows="3" [(ngModel)]="why"></textarea>
            <button class="go">Send request</button>
          </form>
        }
        @case (3) {
          <form class="f" (ngSubmit)="resetSent()">
            <p>Enter your account email and we'll send a secure reset link.</p>
            <label for="lk-r">Email</label><input id="lk-r" type="email" name="r" [(ngModel)]="email" required>
            <button class="go">Send reset link</button>
            <button type="button" class="ghost" (click)="step.set(0)">Back to sign in</button>
          </form>
        }
        @case (4) {
          <div class="state ok"><div class="tick" aria-hidden="true"><x-ic n="✓"></x-ic></div><p role="status"><b>Request received.</b> An administrator reviews new access requests. You'll get an email once approved.</p><button class="go" (click)="close()">Done</button></div>
        }
      }
    } @else {
      <x-refgate [context]="lock.feature()" />
    }
  </div>
  }`,
  styles: [`
  .ov{position:fixed;inset:0;background:color-mix(in srgb,#000 55%,transparent);backdrop-filter:blur(6px);z-index:1000;animation:fd .25s}
  .dlg{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(460px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:var(--surface);color:var(--text);border-radius:24px;padding:28px;z-index:1001;box-shadow:0 40px 120px -20px rgba(0,0,0,.5);border:1px solid var(--line);animation:pp .35s cubic-bezier(.2,.8,.2,1)}
  @keyframes fd{from{opacity:0}} @keyframes pp{from{opacity:0;transform:translate(-50%,-46%) scale(.97)}}
  .x{position:absolute;right:14px;top:14px;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--text);cursor:pointer}
  .lk-top{display:flex;gap:14px;align-items:center;margin-bottom:18px;padding-right:40px}
  .lk-ico{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;background:var(--primary);color:var(--on-primary);flex:none}
  .lk-eb{font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:700}
  h2{margin:2px 0 0;font-family:var(--font-display);font-size:1.6rem;line-height:1.15}
  .f{display:grid;gap:8px}
  label{font-weight:600;font-size:.9rem}
  input,textarea{width:100%;min-height:48px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);padding:10px 14px;font:inherit}
  input:focus,textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--primary) 20%,transparent)}
  .pw{position:relative}.pw input{padding-right:70px}
  .eye{position:absolute;right:6px;top:6px;height:36px;padding:0 10px;border:0;background:transparent;color:var(--primary);font-weight:700;cursor:pointer}
  .row{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:.9rem;flex-wrap:wrap}
  .row a,.f a,.tiny a{color:var(--primary);font-weight:600}
  .ck{display:flex;gap:8px;align-items:center;font-weight:500}.ck input{width:18px;min-height:18px;height:18px;accent-color:var(--primary)}
  .go{margin-top:8px;min-height:52px;border:0;border-radius:14px;background:var(--primary);color:var(--on-primary);font:700 1rem var(--font-body);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;width:100%}
  .go:disabled{opacity:.75}
  .ghost{min-height:48px;border-radius:14px;border:1.5px solid var(--line);background:transparent;color:var(--text);font:600 .95rem var(--font-body);cursor:pointer;width:100%;margin-top:8px}
  .sso{display:grid;gap:8px}
  .sso-b{display:flex;align-items:center;justify-content:center;gap:10px;min-height:48px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font:600 .95rem var(--font-body);cursor:pointer}
  .or{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:.8rem;margin:8px 0}.or::before,.or::after{content:"";flex:1;height:1px;background:var(--line)}
  .err{color:var(--danger);font-weight:600;font-size:.9rem;margin:4px 0}
  .tiny{font-size:.8rem;color:var(--muted);margin:6px 0 0;text-align:center}
  small{color:var(--muted)}
  .spin{width:18px;height:18px;border-radius:50%;border:2.5px solid currentColor;border-right-color:transparent;animation:sp .7s linear infinite}
  @keyframes sp{to{transform:rotate(360deg)}}
  .state{text-align:center;display:grid;gap:10px}
  .badge-lock{justify-self:center;background:color-mix(in srgb,var(--danger) 14%,transparent);color:var(--danger);font-weight:700;padding:6px 14px;border-radius:999px;font-size:.85rem}
  .tick{justify-self:center;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-size:30px;background:color-mix(in srgb,var(--ok) 18%,transparent);color:var(--ok)}
  .steps{display:flex;gap:6px;list-style:none;padding:0;margin:0 0 16px;counter-reset:s}
  .steps li{flex:1;text-align:center;font-size:.78rem;font-weight:700;color:var(--muted);padding-top:10px;border-top:4px solid var(--line);counter-increment:s}
  .steps li.on{border-color:var(--primary);color:var(--text)}
  .phone{display:flex;border:1.5px solid var(--line);border-radius:12px;overflow:hidden;background:var(--bg)}
  .phone span{display:grid;place-items:center;padding:0 12px;border-right:1.5px solid var(--line);font-weight:600;white-space:nowrap}
  .phone input{border:0;border-radius:0}
  .otp{display:flex;gap:8px;justify-content:space-between}
  .otp input{width:100%;max-width:54px;text-align:center;font-size:1.4rem;font-weight:700;padding:0}
  .okline{color:var(--ok);font-weight:700}
  `]
})
export class LockModalComponent implements OnDestroy {
  lock = inject(LockService); cfg = inject(SITE); toast = inject(ToastService);
  step = signal(0); busy = signal(false); err = signal(''); showPw = signal(false); timer = signal(30);
  email = ''; pw = ''; remember = true; name = ''; org = ''; why = ''; phone = ''; ref = ''; otp = ['', '', '', '', '', ''];
  private t?: ReturnType<typeof setInterval>; private lastFocus: HTMLElement | null = null;
  @ViewChild('dlg') dlg?: ElementRef<HTMLElement>;
  constructor() {
    effect(() => {
      if (this.lock.open()) {
        this.lastFocus = document.activeElement as HTMLElement; this.step.set(0); this.err.set(''); this.otp = ['', '', '', '', '', ''];
        document.body.style.overflow = 'hidden';
        setTimeout(() => (this.dlg?.nativeElement.querySelector('input,button.sso-b') as HTMLElement | null)?.focus(), 60);
      } else { document.body.style.overflow = ''; }
    }, { allowSignalWrites: true });
  }
  @HostListener('document:keydown.escape') esc() { if (this.lock.open()) this.close(); }
  close() { this.lock.open.set(false); clearInterval(this.t); this.lastFocus?.focus?.(); }
  trap(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !this.dlg) return;
    const f = [...this.dlg.nativeElement.querySelectorAll<HTMLElement>('button,input,textarea,a[href]')].filter(x => !x.hasAttribute('disabled'));
    if (!f.length) return; const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  private fake(ms: number, then: () => void) { this.busy.set(true); this.err.set(''); setTimeout(() => { this.busy.set(false); then(); }, ms); }
  sso(p: string) { this.fake(900, () => { this.email = `your ${p} account`; this.step.set(1); }); }
  emailLogin() {
    if (!/^\S+@\S+\.\S+$/.test(this.email)) { this.err.set('Enter a valid email address.'); return; }
    if (this.pw.length < 6) { this.err.set('Password must be at least 6 characters.'); return; }
    this.fake(1300, () => this.step.set(1));
  }
  requested() { if (!this.name.trim()) return; this.fake(900, () => this.step.set(4)); }
  resetSent() { this.toast.show('If that email is registered, a reset link is on its way.', 'ok'); this.step.set(0); }
  sendOtp() {
    if (!/^[6-9]\d{9}$/.test(this.phone)) { this.err.set('Enter a valid 10-digit Indian mobile number.'); return; }
    this.fake(1100, () => { this.step.set(1); this.startTimer(); this.toast.show('OTP sent to +91 ' + this.phone.slice(0, 2) + '••••••' + this.phone.slice(8), 'ok');
      setTimeout(() => (this.dlg?.nativeElement.querySelector('.otp input') as HTMLElement | null)?.focus(), 50); });
  }
  startTimer() { this.timer.set(30); clearInterval(this.t); this.t = setInterval(() => { this.timer.update(v => v - 1); if (this.timer() <= 0) clearInterval(this.t); }, 1000); }
  otpIn(e: Event, i: number) {
    // handles typing, SMS autofill (one-time-code) and multi-char inserts by spreading digits across boxes
    const el = e.target as HTMLInputElement; const d = el.value.replace(/\D/g, '');
    const ins = this.dlg!.nativeElement.querySelectorAll<HTMLInputElement>('.otp input');
    if (d.length <= 1) { el.value = d; this.otp[i] = d; if (d && el.nextElementSibling) (el.nextElementSibling as HTMLElement).focus(); return; }
    d.slice(0, 6 - i).split('').forEach((c, k) => { ins[i + k].value = c; this.otp[i + k] = c; });
    ins[Math.min(5, i + d.length)].focus();
  }
  otpKey(e: KeyboardEvent, i: number) {
    const el = e.target as HTMLInputElement;
    if (/^\d$/.test(e.key)) {
      e.preventDefault(); el.value = e.key; this.otp[i] = e.key;
      const nx = el.nextElementSibling as HTMLInputElement | null; if (nx) { nx.focus(); nx.select(); }
      return;
    }
    if (e.key === 'Backspace' && !el.value && el.previousElementSibling) { e.preventDefault(); const pv = el.previousElementSibling as HTMLInputElement; pv.value = ''; this.otp[i - 1] = ''; pv.focus(); }
    if (e.key === 'ArrowLeft' && el.previousElementSibling) (el.previousElementSibling as HTMLElement).focus();
    if (e.key === 'ArrowRight' && el.nextElementSibling) (el.nextElementSibling as HTMLElement).focus();
  }
  otpPaste(e: ClipboardEvent) {
    const d = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (!d) return; e.preventDefault();
    const ins = this.dlg!.nativeElement.querySelectorAll<HTMLInputElement>('.otp input');
    d.split('').forEach((c, i) => { ins[i].value = c; this.otp[i] = c; }); ins[Math.min(d.length, 5)].focus();
  }
  verifyOtp() { if (this.otp.join('').length < 6) { this.err.set('Enter all 6 digits.'); return; } this.fake(1200, () => { clearInterval(this.t); this.step.set(2); setTimeout(() => (this.dlg?.nativeElement.querySelector('#ref') as HTMLElement | null)?.focus(), 50); }); }
  checkRef() { if (this.ref.trim().length < 5) { this.err.set('Enter the referral number from your doctor.'); return; } this.fake(1500, () => this.step.set(3)); }
  ngOnDestroy() { clearInterval(this.t); }
}

/* =========================================================
   CHECKOUT — Stripe-style payment sheet (test mode look).
   It opens BLURRED: a referral code + mobile OTP gate sits on
   top and never unlocks (demo of a protected payment flow).
   ========================================================= */
@Component({
  selector: 'x-checkout', standalone: true, imports: [IconComponent, FormsModule, RefGateComponent],
  template: `
  @if (lock.checkoutOpen() && lock.checkout(); as c) {
  <div class="ov" (click)="close()"></div>
  <div class="wrapx" role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <button class="x" (click)="close()" aria-label="Close checkout"><x-ic n="x"></x-ic></button>
    <div class="sheet veil" aria-hidden="true" inert>
      <div class="co-l">
        <div class="mer"><span class="back"><x-ic n="arrow-right" s="16" style="transform:rotate(180deg)"></x-ic></span><span class="mlogo">{{ cfg.brand.slice(0,1) }}</span><b>{{ cfg.brand }}</b><span class="tm">TEST MODE</span></div>
        <p class="pay">Pay {{ cfg.brand }}</p>
        <div class="amt">{{ money(c.amount, c.currency) }}</div>
        <ul class="lines">
          @for (l of (c.lines || [[c.title, c.amount]]); track $index) {
            <li><span class="th"><x-ic n="receipt" s="18"></x-ic></span><span class="nm">{{ l[0] }}<small>Qty 1</small></span><b>{{ money(l[1], c.currency) }}</b></li>
          }
        </ul>
        <div class="sum"><div><span>Subtotal</span><span>{{ money(c.amount, c.currency) }}</span></div><div><span>Tax</span><span>{{ money(0, c.currency) }}</span></div><div class="tot"><span>Total due</span><span>{{ money(c.amount, c.currency) }}</span></div></div>
        <div class="pw">Powered by <b>stripe</b> <span>|</span> Terms <span>·</span> Privacy</div>
      </div>
      <div class="co-r">
        <div class="xp"><span class="ap"><x-ic n="apple" s="18"></x-ic> Pay</span><span class="gp"><b>G</b> Pay</span><span class="lk"><b>link</b> Pay</span></div>
        <div class="or"><span>Or pay with card</span></div>
        <label>Email</label><div class="fx">you&#64;example.com</div>
        <label>Card information</label>
        <div class="cg"><div class="cn">1234 1234 1234 1234<span class="br"><i class="v">VISA</i><i class="m"><b></b><b></b></i><i class="a">AMEX</i></span></div><div class="cr"><span>MM / YY</span><span>CVC</span></div></div>
        <label>Cardholder name</label><div class="fx">Full name on card</div>
        <label>Country or region</label><div class="cg"><div class="cn">{{ c.currency === 'INR' ? 'India' : 'Canada' }}<x-ic n="chevron-down" s="16"></x-ic></div><div class="cn">{{ c.currency === 'INR' ? 'PIN code' : 'Postal code' }}</div></div>
        <div class="sv"><span class="cb"></span> Securely save my information for 1-click checkout</div>
        <div class="paybtn">Pay {{ money(c.amount, c.currency) }}</div>
      </div>
    </div>
    <div class="gate">
      <span id="gate-title" class="sr-only">Verify before payment</span>
      <x-refgate [context]="'Secure checkout · ' + money(c.amount, c.currency)" />
    </div>
  </div>
  }`,
  styles: [`
  .ov{position:fixed;inset:0;background:rgba(10,10,20,.55);backdrop-filter:blur(4px);z-index:990;animation:f .25s}
  @keyframes f{from{opacity:0}}
  .wrapx{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(940px,calc(100vw - 24px));max-height:calc(100vh - 24px);z-index:991;border-radius:22px;overflow:hidden;box-shadow:0 50px 140px -30px rgba(0,0,0,.6);animation:pp .35s cubic-bezier(.2,.8,.2,1)}
  @keyframes pp{from{opacity:0;transform:translate(-50%,-47%) scale(.98)}}
  .x{position:absolute;right:12px;top:12px;width:40px;height:40px;border-radius:50%;border:1px solid rgba(0,0,0,.1);background:#fff;color:#1a1f36;cursor:pointer;z-index:5;display:grid;place-items:center;box-shadow:0 6px 18px rgba(0,0,0,.18)}
  .sheet{display:grid;grid-template-columns:1fr 1fr;background:#fff;color:#1a1f36;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;min-height:560px}
  .veil{filter:blur(5px) saturate(.9);pointer-events:none;user-select:none;transform:scale(1.01)}
  .co-l{padding:34px 38px;background:#f6f8fa;display:flex;flex-direction:column;gap:6px;border-right:1px solid #e3e8ee}
  .mer{display:flex;align-items:center;gap:10px;font-size:.92rem}.back{color:#697386}
  .mlogo{width:26px;height:26px;border-radius:7px;background:var(--primary);color:var(--on-primary);display:grid;place-items:center;font-weight:800;font-size:.8rem}
  .tm{font-size:.62rem;font-weight:800;letter-spacing:.06em;color:#b3093c;background:#ffde92;padding:2px 6px;border-radius:4px}
  .pay{margin:22px 0 0;color:#697386;font-weight:600}
  .amt{font-size:2.3rem;font-weight:700;letter-spacing:-.02em}
  .lines{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:12px}
  .lines li{display:grid;grid-template-columns:42px 1fr auto;gap:12px;align-items:center;font-size:.9rem}
  .th{width:42px;height:42px;border-radius:8px;background:#fff;border:1px solid #e3e8ee;display:grid;place-items:center;color:#697386}
  .nm{display:grid}.nm small{color:#697386}
  .sum{margin-top:auto;display:grid;gap:8px;font-size:.88rem;border-top:1px solid #e3e8ee;padding-top:14px}
  .sum div{display:flex;justify-content:space-between}.tot{font-weight:700;font-size:.98rem}
  .pw{margin-top:18px;color:#a3acb9;font-size:.8rem}.pw b{color:#697386;font-weight:800}
  .co-r{padding:34px 38px;display:grid;gap:8px;align-content:start}
  .xp{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
  .xp span{display:flex;align-items:center;justify-content:center;gap:6px;height:44px;border-radius:7px;font-weight:600}
  .ap{background:#000;color:#fff}.gp{border:1px solid #d5dbe1}.gp b{color:#4285f4}.lk{background:#00d66f;color:#011e0f}
  .or{display:flex;align-items:center;gap:10px;color:#697386;font-size:.82rem;margin:8px 0}.or::before,.or::after{content:"";flex:1;height:1px;background:#e3e8ee}
  label{font-size:.82rem;font-weight:600;color:#4f566b;margin-top:4px}
  .fx,.cn,.cr span{height:42px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;color:#a3acb9;font-size:.92rem}
  .fx{border:1px solid #e0e6eb;border-radius:7px;box-shadow:0 1px 1px rgba(0,0,0,.03)}
  .cg{border:1px solid #e0e6eb;border-radius:7px;overflow:hidden}.cg>.cn+.cn,.cr{border-top:1px solid #e0e6eb}
  .cr{display:grid;grid-template-columns:1fr 1fr}.cr span+span{border-left:1px solid #e0e6eb}
  .br{display:flex;gap:4px}.br i{font-style:normal;font-size:.55rem;font-weight:900;padding:2px 4px;border-radius:3px;display:flex;align-items:center}
  .v{background:#1a1f71;color:#fff}.a{background:#2e77bc;color:#fff}.m{background:#f6f8fa;gap:0!important}.m b{width:9px;height:9px;border-radius:50%;background:#eb001b;display:block}.m b+b{background:#f79e1b;margin-left:-4px;opacity:.9}
  .sv{display:flex;gap:8px;align-items:center;font-size:.82rem;color:#4f566b;margin-top:6px}.cb{width:14px;height:14px;border:1px solid #c1c9d2;border-radius:3px}
  .paybtn{margin-top:12px;height:46px;border-radius:7px;background:var(--primary);color:var(--on-primary);display:grid;place-items:center;font-weight:700;box-shadow:0 6px 16px -6px var(--primary)}
  .gate{position:absolute;inset:0;display:grid;place-items:center;padding:20px;overflow:auto;background:radial-gradient(60% 60% at 50% 50%,rgba(10,10,20,.25),rgba(10,10,20,.05))}
  .gate>x-refgate{display:block;width:min(440px,100%);background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:22px;padding:24px;box-shadow:0 30px 80px -20px rgba(0,0,0,.55)}
  .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  @media (max-width:760px){.sheet{grid-template-columns:1fr}.co-r{display:none}.wrapx{height:calc(100vh - 24px)}.gate{align-items:start}}
  `]
})
export class CheckoutComponent {
  lock = inject(LockService); cfg = inject(SITE);
  @HostListener('document:keydown.escape') esc() { if (this.lock.checkoutOpen()) this.close(); }
  close() { this.lock.checkoutOpen.set(false); }
  money(v: number, c: string) { return new Intl.NumberFormat(c === 'INR' ? 'en-IN' : 'en-CA', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(v); }
}

/* =========================================================
   COOKIE CONSENT — banner + preferences centre
   ========================================================= */
@Component({
  selector: 'x-cookies', standalone: true, imports: [IconComponent, FormsModule],
  template: `
  @if (show() && !lock.cookiePrefsOpen()) {
    <div class="ck" role="region" aria-label="Cookie consent">
      <div class="ck-t"><b><x-ic n="🍪"></x-ic> We value your privacy</b><p>We use essential cookies to run this site and optional cookies for analytics and personalisation. You choose.</p></div>
      <div class="ck-b"><button class="o" (click)="lock.cookiePrefsOpen.set(true)">Customise</button><button class="o" (click)="save(false)">Reject optional</button><button class="p" (click)="save(true)">Accept all</button></div>
    </div>
  }
  @if (lock.cookiePrefsOpen()) {
    <div class="ov" (click)="lock.cookiePrefsOpen.set(false)"></div>
    <div class="pc" role="dialog" aria-modal="true" aria-labelledby="pc-h">
      <h2 id="pc-h">Privacy preference centre</h2>
      <p>Choose which cookies we may use. You can change this any time from the footer.</p>
      @for (c of cats; track c.k) {
        <div class="cat"><div><b>{{ c.l }}</b><p>{{ c.d }}</p></div>
          <label class="sw"><input type="checkbox" [(ngModel)]="prefs[c.k]" [disabled]="c.k==='nec'" [attr.aria-label]="c.l"><span></span></label></div>
      }
      <div class="ck-b"><button class="o" (click)="save(false)">Reject optional</button><button class="p" (click)="saveCustom()">Save choices</button></div>
    </div>
  }`,
  styles: [`
  .ck{position:fixed;left:16px;right:16px;bottom:16px;max-width:980px;margin:0 auto;z-index:900;background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:20px;padding:18px 20px;display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap;box-shadow:0 20px 60px -20px rgba(0,0,0,.45);animation:up .5s cubic-bezier(.2,.8,.2,1)}
  @keyframes up{from{transform:translateY(120%)}}
  .ck-t{flex:1 1 380px}.ck-t p{margin:4px 0 0;color:var(--muted);font-size:.9rem}
  .ck-b{display:flex;gap:8px;flex-wrap:wrap}
  button{min-height:44px;padding:0 16px;border-radius:12px;font:700 .9rem var(--font-body);cursor:pointer}
  .o{background:transparent;border:1.5px solid var(--line);color:var(--text)}.p{background:var(--primary);color:var(--on-primary);border:0}
  .ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:950}
  .pc{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:951;width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:var(--surface);color:var(--text);border-radius:22px;padding:26px;border:1px solid var(--line)}
  .pc h2{font-family:var(--font-display);margin:0 0 6px}.pc>p{color:var(--muted)}
  .cat{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:14px 0;border-top:1px solid var(--line)}.cat p{margin:2px 0 0;color:var(--muted);font-size:.85rem}
  .sw{position:relative;width:52px;height:30px;flex:none}.sw input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer;z-index:1}
  .sw span{position:absolute;inset:0;border-radius:999px;background:var(--line);transition:.2s}.sw span::after{content:"";position:absolute;width:24px;height:24px;left:3px;top:3px;border-radius:50%;background:#fff;transition:.2s}
  .sw input:checked+span{background:var(--primary)}.sw input:checked+span::after{left:25px}.sw input:focus-visible+span{outline:3px solid var(--focus);outline-offset:2px}
  .sw input:disabled+span{opacity:.6}
  `]
})
export class CookieConsentComponent {
  lock = inject(LockService); cfg = inject(SITE); toast = inject(ToastService);
  show = signal(!store.get(this.cfg.key + ':consent'));
  cats = [
    { k: 'nec', l: 'Strictly necessary', d: 'Security, load-balancing and your consent choice. Always on.' },
    { k: 'ana', l: 'Analytics', d: 'Anonymous usage stats that help us improve pages.' },
    { k: 'per', l: 'Personalisation', d: 'Remembers your theme, region and saved items.' },
    { k: 'mkt', l: 'Marketing', d: 'Measures campaign performance on partner sites.' },
  ];
  prefs: Record<string, boolean> = { nec: true, ana: false, per: true, mkt: false };
  save(all: boolean) { this.prefs = { nec: true, ana: all, per: all, mkt: all }; this.saveCustom(); }
  saveCustom() { store.set(this.cfg.key + ':consent', JSON.stringify(this.prefs)); this.show.set(false); this.lock.cookiePrefsOpen.set(false); this.toast.show('Cookie preferences saved', 'ok'); }
}

/* =========================================================
   TOASTS
   ========================================================= */
@Component({
  selector: 'x-toasts', standalone: true, imports: [IconComponent],
  template: `<div class="tw" role="status" aria-live="polite">@for (t of ts.items(); track t.id) {<div class="t" [class]="'t ' + t.kind">{{ t.text }}</div>}</div>`,
  styles: [`.tw{position:fixed;top:84px;right:16px;z-index:2000;display:grid;gap:8px;max-width:min(380px,calc(100vw - 32px))}
  .t{background:var(--text);color:var(--bg);padding:14px 18px;border-radius:14px;font-weight:600;box-shadow:0 14px 40px -10px rgba(0,0,0,.4);animation:in .4s cubic-bezier(.2,.8,.2,1);border-left:5px solid var(--primary)}
  .t.ok{border-left-color:var(--ok)}.t.warn{border-left-color:var(--danger)}@keyframes in{from{opacity:0;transform:translateX(30px)}}`]
})
export class ToastsComponent { ts = inject(ToastService); }

/* =========================================================
   THEME + ACCESSIBILITY PANEL
   ========================================================= */
@Component({
  selector: 'x-theme', standalone: true, imports: [IconComponent],
  template: `
  <button class="fab" (click)="open.set(!open())" [attr.aria-expanded]="open()" aria-controls="tp" aria-label="Theme and accessibility settings">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 3a9 9 0 0 1 0 18" fill="currentColor"/></svg>
  </button>
  @if (open()) {
  <div class="pn" id="tp" role="dialog" aria-label="Theme and accessibility">
    <div class="h"><b>Appearance</b><button (click)="open.set(false)" aria-label="Close settings"><x-ic n="✕"></x-ic></button></div>
    <div class="grid">
      @for (t of th.themes; track t.id) {
        <button class="sw" [attr.aria-pressed]="th.theme()===t.id" (click)="th.theme.set(t.id)">
          <span class="dots" aria-hidden="true"><i [style.background]="t.swatch[0]"></i><i [style.background]="t.swatch[1]"></i><i [style.background]="t.swatch[2]"></i></span>{{ t.label }}
        </button>
      }
    </div>
    @if (th.fonts.length) {
      <div class="h" style="margin-top:14px"><b>Typography</b><small>Premium pairings</small></div>
      <div class="fonts" role="group" aria-label="Font pairing">
        @for (f of th.fonts; track f.id) {
          <button class="fo" [attr.aria-pressed]="th.font()===f.id" (click)="th.font.set(f.id)">
            <span class="aa" [style.font-family]="f.display">Aa</span>
            <span class="fl"><b [style.font-family]="f.display">{{ f.label.split(' + ')[0] }}</b><small [style.font-family]="f.body">with {{ f.label.split(' + ')[1] }}</small></span>
            @if (th.font()===f.id) {<x-ic n="check-circle" s="18"></x-ic>}
          </button>
        }
      </div>
    }
    <div class="h" style="margin-top:14px"><b>Accessibility</b></div>
    <div class="row"><span>Text size</span><div class="seg"><button (click)="fs(-1)" aria-label="Smaller text">A−</button><button (click)="th.fontScale.set(1)" aria-label="Reset text size">A</button><button (click)="fs(1)" aria-label="Larger text">A+</button></div></div>
    <div class="row"><span>Reduce motion</span><button class="tg" role="switch" [attr.aria-checked]="th.reduceMotion()" (click)="th.reduceMotion.set(!th.reduceMotion())"><span></span></button></div>
  </div>
  }`,
  styles: [`
  .fab{position:fixed;left:16px;bottom:16px;z-index:880;width:52px;height:52px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--primary);cursor:pointer;box-shadow:0 10px 30px -8px rgba(0,0,0,.35);display:grid;place-items:center}
  .pn{position:fixed;left:16px;bottom:80px;z-index:881;width:min(320px,calc(100vw - 32px));background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:20px;padding:16px;box-shadow:0 24px 60px -16px rgba(0,0,0,.45);animation:in .3s}
  @keyframes in{from{opacity:0;transform:translateY(10px)}}
  .h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.h button{border:0;background:none;color:var(--text);font-size:18px;cursor:pointer;width:36px;height:36px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .h small{color:var(--muted);font-size:.72rem;font-weight:600}
  .pn{max-height:calc(100vh - 100px);overflow:auto}
  .fonts{display:grid;gap:6px}
  .fo{display:grid;grid-template-columns:46px 1fr auto;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer;text-align:left}
  .fo[aria-pressed=true]{border-color:var(--primary)}.fo x-ic{color:var(--primary)}
  .aa{width:46px;height:40px;border-radius:10px;background:var(--surface);border:1px solid var(--line);display:grid;place-items:center;font-size:1.35rem;line-height:1}
  .fl{display:grid;line-height:1.2;min-width:0}.fl b{font-size:.98rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fl small{color:var(--muted);font-size:.74rem}
  .sw{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 10px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font:600 .85rem var(--font-body);cursor:pointer;text-align:left}
  .sw[aria-pressed=true]{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary) 25%,transparent)}
  .dots{display:flex}.dots i{width:14px;height:14px;border-radius:50%;margin-right:-4px;border:2px solid var(--surface)}
  .row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-top:1px solid var(--line)}
  .seg{display:flex;gap:4px}.seg button{min-width:40px;height:36px;border-radius:9px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font-weight:700;cursor:pointer}
  .tg{width:50px;height:28px;border-radius:999px;border:0;background:var(--line);position:relative;cursor:pointer}.tg span{position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:.2s}
  .tg[aria-checked=true]{background:var(--primary)}.tg[aria-checked=true] span{left:25px}
  `]
})
export class ThemePickerComponent {
  th = inject(ThemeService); open = signal(false);
  constructor() { effect(() => { if (this.open()) this.th.fonts.forEach(f => this.th.loadFont(f.id)); }); }
  fs(d: number) { this.th.fontScale.set(Math.min(1.3, Math.max(.9, +(this.th.fontScale() + d * .1).toFixed(1)))); }
}

/* =========================================================
   SEARCH OVERLAY — instant search with keyboard nav
   ========================================================= */
export interface SearchItem { title: string; type: string; route: string; text?: string; }
@Component({
  selector: 'x-search', standalone: true, imports: [IconComponent, FormsModule],
  template: `
  @if (lock.searchOpen()) {
  <div class="ov" (click)="close()"></div>
  <div class="sr" role="dialog" aria-modal="true" aria-label="Site search">
    <div class="in"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input #q [(ngModel)]="query" (ngModelChange)="sel.set(0)" (keydown)="key($event)" [placeholder]="placeholder" aria-label="Search" role="combobox" aria-controls="sr-list" [attr.aria-expanded]="true" [attr.aria-activedescendant]="'sr-' + sel()">
      <kbd>Esc</kbd></div>
    @if (!query) { <div class="sug"><span>Popular:</span>@for (s of popular; track s) {<button (click)="query=s">{{ s }}</button>}</div> }
    <ul id="sr-list" role="listbox">
      @for (r of results(); track r.title; let i = $index) {
        <li [id]="'sr-' + i" role="option" [attr.aria-selected]="i===sel()" (click)="go(r)" (mouseenter)="sel.set(i)"><span class="ty">{{ r.type }}</span><span class="tt">{{ r.title }}</span><span class="ar" aria-hidden="true">↵</span></li>
      } @empty { <li class="no">No results for “{{ query }}”. Try a different word.</li> }
    </ul>
    <div class="ft"><span>↑↓ to navigate</span><span>↵ to open</span><span>AI-assisted search</span></div>
  </div>
  }`,
  styles: [`
  .ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);z-index:1100}
  .sr{position:fixed;left:50%;top:10vh;transform:translateX(-50%);width:min(680px,calc(100vw - 24px));background:var(--surface);color:var(--text);border-radius:22px;z-index:1101;border:1px solid var(--line);overflow:hidden;box-shadow:0 40px 120px -20px rgba(0,0,0,.5);animation:dn .3s cubic-bezier(.2,.8,.2,1)}
  @keyframes dn{from{opacity:0;transform:translate(-50%,-14px)}}
  .in{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--line);color:var(--muted)}
  .in input{flex:1;border:0;background:transparent;color:var(--text);font:500 1.15rem var(--font-body);min-height:44px;outline:none}
  kbd{font-size:.75rem;border:1px solid var(--line);border-radius:6px;padding:2px 6px}
  .sug{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:12px 18px;color:var(--muted);font-size:.85rem}
  .sug button{border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:999px;padding:6px 12px;cursor:pointer;font:600 .85rem var(--font-body)}
  ul{list-style:none;margin:0;padding:8px;max-height:52vh;overflow:auto}
  li{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer}
  li[aria-selected=true]{background:color-mix(in srgb,var(--primary) 12%,transparent)}
  .ty{font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--primary);min-width:84px}
  .tt{flex:1;font-weight:600}.ar{color:var(--muted)}.no{color:var(--muted);cursor:default}
  .ft{display:flex;gap:16px;padding:10px 18px;border-top:1px solid var(--line);font-size:.75rem;color:var(--muted);flex-wrap:wrap}
  `]
})
export class SearchOverlayComponent {
  lock = inject(LockService); router = inject(Router);
  @Input() items: SearchItem[] = []; @Input() popular: string[] = []; @Input() placeholder = 'Search…';
  @ViewChild('q') q?: ElementRef<HTMLInputElement>;
  query = ''; sel = signal(0);
  constructor() { effect(() => { if (this.lock.searchOpen()) setTimeout(() => this.q?.nativeElement.focus(), 40); }); }
  results() {
    const q = this.query.trim().toLowerCase(); if (!q) return this.items.slice(0, 7);
    return this.items.map(i => ({ i, s: (i.title.toLowerCase().includes(q) ? 3 : 0) + (i.type.toLowerCase().includes(q) ? 1 : 0) + ((i.text || '').toLowerCase().includes(q) ? 1 : 0) }))
      .filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.i).slice(0, 10);
  }
  @HostListener('document:keydown', ['$event']) hot(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.lock.searchOpen.set(true); }
    if (e.key === 'Escape' && this.lock.searchOpen()) this.close();
  }
  key(e: KeyboardEvent) {
    const n = this.results().length;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.sel.set((this.sel() + 1) % Math.max(1, n)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); this.sel.set((this.sel() - 1 + n) % Math.max(1, n)); }
    if (e.key === 'Enter') { const r = this.results()[this.sel()]; if (r) this.go(r); }
  }
  go(r: SearchItem) { this.close(); this.router.navigateByUrl(r.route); }
  close() { this.lock.searchOpen.set(false); this.query = ''; }
}

/* =========================================================
   CHATBOT — scripted assistant with quick replies + typing
   ========================================================= */
export interface BotIntent { keys: string[]; reply: string; chips?: string[]; route?: string; lock?: string; }
interface Msg { me: boolean; text: string; chips?: string[]; }
@Component({
  selector: 'x-bot', standalone: true, imports: [IconComponent, FormsModule],
  template: `
  <button class="fab" (click)="toggle()" [attr.aria-expanded]="open()" aria-controls="bot" [attr.aria-label]="open() ? 'Close assistant' : 'Open ' + name">
    @if (!open()) { <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-linecap="round" stroke-width="3"/></svg> } @else { <x-ic n="✕"></x-ic> }
    @if (!open() && !seen()) { <span class="ping" aria-hidden="true"></span> }
  </button>
  @if (!open() && !seen()) { <div class="hint" aria-hidden="true">{{ hint }}</div> }
  @if (open()) {
  <section class="bot" id="bot" role="dialog" [attr.aria-label]="name">
    <header><div class="av" aria-hidden="true"><x-ic [n]="avatar" s="22"></x-ic></div><div><b>{{ name }}</b><small><i></i> Online · replies instantly</small></div></header>
    <div class="log" #log aria-live="polite">
      @for (m of msgs(); track $index) {
        <div class="m" [class.me]="m.me">{{ m.text }}</div>
        @if (m.chips && $last) { <div class="chips">@for (c of m.chips; track c) {<button (click)="send(c)">{{ c }}</button>}</div> }
      }
      @if (typing()) { <div class="m typing" aria-label="Assistant is typing"><span></span><span></span><span></span></div> }
    </div>
    <form (ngSubmit)="send(text)"><label class="sr-only" for="bot-in">Message</label><input id="bot-in" [(ngModel)]="text" name="t" placeholder="Type your question…" autocomplete="off"><button aria-label="Send"><x-ic n="➤"></x-ic></button></form>
  </section>
  }`,
  styles: [`
  .fab{position:fixed;right:16px;bottom:16px;z-index:880;width:60px;height:60px;border-radius:50%;border:0;background:var(--primary);color:var(--on-primary);cursor:pointer;box-shadow:0 14px 36px -8px var(--primary);display:grid;place-items:center;font-size:20px}
  .ping{position:absolute;right:2px;top:2px;width:14px;height:14px;border-radius:50%;background:var(--accent);border:2px solid var(--surface)}
  .hint{position:fixed;right:84px;bottom:28px;z-index:879;background:var(--surface);color:var(--text);border:1px solid var(--line);padding:10px 14px;border-radius:14px 14px 4px 14px;font-weight:600;font-size:.9rem;box-shadow:0 10px 30px -10px rgba(0,0,0,.3);animation:bob 3s ease-in-out infinite}
  @keyframes bob{50%{transform:translateY(-4px)}}
  .bot{position:fixed;right:16px;bottom:88px;z-index:881;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100vh - 120px));background:var(--surface);color:var(--text);border:1px solid var(--line);border-radius:22px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.5);animation:in .35s cubic-bezier(.2,.8,.2,1)}
  @keyframes in{from{opacity:0;transform:translateY(16px) scale(.98)}}
  header{display:flex;gap:12px;align-items:center;padding:14px 16px;background:var(--primary);color:var(--on-primary)}
  header small{display:flex;align-items:center;gap:6px;opacity:.9;font-size:.78rem}header small i{width:8px;height:8px;border-radius:50%;background:#4ade80}
  .av{width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.2);display:grid;place-items:center;font-size:20px}
  .log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:8px}
  .m{max-width:85%;padding:10px 14px;border-radius:16px 16px 16px 4px;background:var(--bg);font-size:.92rem;line-height:1.45;white-space:pre-line;animation:in .25s}
  .m.me{align-self:flex-end;background:var(--primary);color:var(--on-primary);border-radius:16px 16px 4px 16px}
  .chips{display:flex;flex-wrap:wrap;gap:6px}.chips button{border:1.5px solid var(--primary);background:transparent;color:var(--primary);border-radius:999px;padding:6px 12px;font:600 .82rem var(--font-body);cursor:pointer}
  .typing{display:flex;gap:4px}.typing span{width:7px;height:7px;border-radius:50%;background:var(--muted);animation:b 1s infinite}.typing span:nth-child(2){animation-delay:.15s}.typing span:nth-child(3){animation-delay:.3s}
  @keyframes b{50%{transform:translateY(-4px);opacity:.5}}
  form{display:flex;gap:8px;padding:10px;border-top:1px solid var(--line)}
  form input{flex:1;min-height:46px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);padding:0 12px;font:inherit}
  form button{width:46px;border-radius:12px;border:0;background:var(--primary);color:var(--on-primary);cursor:pointer}
  .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  @media (max-width:600px){.hint{display:none}}
  `]
})
export class ChatbotComponent {
  router = inject(Router); lock = inject(LockService);
  @Input() name = 'Assistant'; @Input() avatar = '✦'; @Input() hint = 'Hi! Need help?';
  @Input() greeting = 'Hi! How can I help you today?'; @Input() starters: string[] = [];
  @Input() intents: BotIntent[] = []; @Input() fallback = 'I can help with that. Would you like to speak to our team?';
  @ViewChild('log') log?: ElementRef<HTMLElement>;
  open = signal(false); seen = signal(false); typing = signal(false); msgs = signal<Msg[]>([]); text = '';
  toggle() {
    this.open.set(!this.open()); this.seen.set(true);
    if (this.open() && !this.msgs().length) this.bot({ me: false, text: this.greeting, chips: this.starters });
  }
  private scroll() { setTimeout(() => { const l = this.log?.nativeElement; if (l) l.scrollTop = l.scrollHeight; }, 30); }
  private bot(m: Msg, delay = 700) { this.typing.set(true); this.scroll(); setTimeout(() => { this.typing.set(false); this.msgs.update(l => [...l, m]); this.scroll(); }, delay); }
  send(t: string) {
    t = (t || '').trim(); if (!t) return; this.text = '';
    this.msgs.update(l => [...l, { me: true, text: t }]); this.scroll();
    const q = t.toLowerCase(); const hit = this.intents.find(i => i.keys.some(k => q.includes(k)));
    if (!hit) { this.bot({ me: false, text: this.fallback, chips: this.starters }); return; }
    this.bot({ me: false, text: hit.reply, chips: hit.chips }, 650 + Math.min(900, hit.reply.length * 6));
    if (hit.route) setTimeout(() => this.router.navigateByUrl(hit.route!), 1400);
    if (hit.lock) setTimeout(() => this.lock.gate(hit.lock!), 1600);
  }
}
