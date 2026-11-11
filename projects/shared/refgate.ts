import { Component, ElementRef, Input, ViewChild, AfterViewInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SITE, ToastService } from './core';
import { IconComponent } from './icons';

/* =========================================================
   REFERRAL GATE (demo): step 1 referral code → always "not valid"
   → contact executive support. Step 2 (mobile OTP) stays locked
   until a valid referral code exists, which never happens here.
   ========================================================= */
@Component({
  selector: 'x-refgate', standalone: true, imports: [FormsModule, IconComponent],
  template: `
  <div class="rg">
    <div class="hd">
      <span class="sh" aria-hidden="true"><x-ic n="shield" s="24"></x-ic></span>
      <div><div class="eb">{{ context || 'Secure access' }}</div><h3 [id]="hid">Verify to continue</h3><p>Two-step check: a valid referral code, then a one-time password to your mobile.</p></div>
    </div>

    <ol class="stp" aria-label="Verification steps">
      <li class="on"><b>1</b>Referral code</li>
      <li [class.lk]="true"><b><x-ic n="lock" s="12"></x-ic></b>Mobile OTP</li>
    </ol>

    <form class="blk" (ngSubmit)="check()" novalidate>
      <label [for]="rid">Referral code</label>
      <div class="in" [class.bad]="state()==='invalid'">
        <x-ic n="ticket" s="18"></x-ic>
        <input #ref [id]="rid" name="ref" [(ngModel)]="code" autocomplete="off" spellcheck="false" [placeholder]="placeholder" [attr.aria-invalid]="state()==='invalid'" [attr.aria-describedby]="rid + '-msg'" (input)="state()==='invalid' && state.set('idle')">
      </div>
      <small class="hint">{{ hint }}</small>
      @if (state()==='invalid') {
        <div class="err" [id]="rid + '-msg'" role="alert">
          <x-ic n="warning" s="20"></x-ic>
          <div><b>This referral code is not valid.</b><span>Kindly contact our executive support team to get a valid referral code.</span></div>
        </div>
        <div class="sup">
          <button type="button" class="b2" (click)="support('call')"><x-ic n="phone" s="16"></x-ic> Call support</button>
          <button type="button" class="b2" (click)="support('chat')"><x-ic n="chat" s="16"></x-ic> Chat with us</button>
        </div>
      } @else if (state()==='empty') {
        <p class="err sm" [id]="rid + '-msg'" role="alert"><x-ic n="warning" s="16"></x-ic> Enter the referral code you received.</p>
      }
      <button class="go" [disabled]="busy()">@if (busy()) {<span class="spin"></span> Checking code…} @else {Verify referral code}</button>
    </form>

    <fieldset class="blk locked" disabled aria-describedby="otp-lock-note">
      <legend><span>Mobile verification</span><span class="chip"><x-ic n="lock" s="12"></x-ic> Locked</span></legend>
      <div class="ph"><span>{{ dial }}</span><input [placeholder]="phoneHint" aria-label="Mobile number (locked)"></div>
      <div class="otp" aria-hidden="true">@for (i of [0,1,2,3,4,5]; track i) {<input tabindex="-1">}</div>
      <button type="button" class="go ghost">Send OTP</button>
      <p class="note" id="otp-lock-note"><x-ic n="lock" s="14"></x-ic> Unlocks after a valid referral code is verified.</p>
    </fieldset>
  </div>`,
  styles: [`
  .rg{display:grid;gap:14px}
  .hd{display:flex;gap:14px;align-items:flex-start;padding-right:40px}
  .sh{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:var(--primary);color:var(--on-primary);flex:none;box-shadow:0 10px 24px -10px var(--primary)}
  .eb{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:700}
  h3{margin:2px 0 4px;font-family:var(--font-display);font-size:1.45rem;line-height:1.15}
  .hd p{margin:0;color:var(--muted);font-size:.88rem;line-height:1.45}
  .stp{display:flex;gap:6px;list-style:none;margin:0;padding:0}
  .stp li{flex:1;display:flex;align-items:center;gap:8px;padding:9px 10px;border-radius:12px;background:var(--bg);font-size:.8rem;font-weight:700;color:var(--muted);border:1px solid var(--line)}
  .stp li b{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:.72rem;background:var(--line);color:var(--text)}
  .stp li.on{border-color:var(--primary);color:var(--text)}.stp li.on b{background:var(--primary);color:var(--on-primary)}
  .blk{display:grid;gap:8px;border:1px solid var(--line);border-radius:18px;padding:16px;margin:0;background:var(--surface)}
  label{font-weight:700;font-size:.88rem}
  .in{display:flex;align-items:center;gap:10px;min-height:52px;border:1.5px solid var(--line);border-radius:14px;padding:0 14px;background:var(--bg);color:var(--muted);transition:.2s}
  .in:focus-within{border-color:var(--primary);box-shadow:0 0 0 4px color-mix(in srgb,var(--primary) 18%,transparent)}
  .in.bad{border-color:var(--danger);box-shadow:0 0 0 4px color-mix(in srgb,var(--danger) 14%,transparent)}
  .in input{flex:1;border:0;background:transparent;color:var(--text);font:600 1rem var(--font-body);letter-spacing:.06em;text-transform:uppercase;min-height:48px;outline:none;min-width:0}
  .in input::placeholder{text-transform:none;letter-spacing:0;font-weight:500;color:var(--muted)}
  .hint{color:var(--muted);font-size:.8rem}
  .err{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:color-mix(in srgb,var(--danger) 10%,var(--surface));color:var(--danger);border:1px solid color-mix(in srgb,var(--danger) 35%,transparent);animation:sh .4s}
  .err div{display:grid;gap:2px}.err span{color:var(--text);font-size:.86rem;opacity:.85}
  .err.sm{padding:8px 12px;margin:0;font-size:.85rem;font-weight:600;align-items:center}
  @keyframes sh{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
  .sup{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .b2{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:0 10px;white-space:nowrap;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font:700 .85rem var(--font-body);cursor:pointer}
  .b2:hover{border-color:var(--primary);color:var(--primary)}
  .go{min-height:50px;border:0;border-radius:14px;background:var(--primary);color:var(--on-primary);font:700 .98rem var(--font-body);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;margin-top:4px}
  .go:disabled{opacity:.75}
  .spin{width:16px;height:16px;border-radius:50%;border:2.5px solid currentColor;border-right-color:transparent;animation:sp .7s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
  .locked{position:relative;opacity:.62;background:repeating-linear-gradient(-45deg,transparent 0 10px,color-mix(in srgb,var(--line) 45%,transparent) 10px 11px),var(--surface)}
  .locked legend{display:flex;justify-content:space-between;align-items:center;width:100%;padding:0;font-weight:700;font-size:.88rem;float:left;margin-bottom:8px}
  .locked legend+*{clear:both}
  .chip{display:inline-flex;align-items:center;gap:5px;font-size:.72rem;font-weight:800;padding:4px 9px;border-radius:999px;background:var(--line);color:var(--text)}
  .ph{display:flex;border:1.5px solid var(--line);border-radius:12px;overflow:hidden;background:var(--bg)}
  .ph span{display:grid;place-items:center;padding:0 12px;border-right:1.5px solid var(--line);font-weight:700;font-size:.9rem}
  .ph input{flex:1;border:0;background:transparent;min-height:46px;padding:0 12px;min-width:0;color:var(--muted)}
  .otp{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.otp input{min-height:44px;border-radius:10px;border:1.5px solid var(--line);background:var(--bg);min-width:0}
  .ghost{background:var(--line);color:var(--muted);cursor:not-allowed}
  .note{display:flex;align-items:center;gap:6px;margin:0;font-size:.8rem;color:var(--muted);font-weight:600}
  fieldset:disabled *{cursor:not-allowed}
  `],
})
export class RefGateComponent implements AfterViewInit {
  cfg = inject(SITE); toast = inject(ToastService);
  @Input() context = '';
  @ViewChild('ref') refEl?: ElementRef<HTMLInputElement>;
  private static n = 0;
  rid = 'rg' + (++RefGateComponent.n); hid = this.rid + '-h';
  code = ''; busy = signal(false); state = signal<'idle' | 'empty' | 'invalid'>('idle');
  get dial() { return this.cfg.dial || '+1'; }
  get phoneHint() { return this.dial === '+91' ? '98XXX XXXXX' : '(604) 555-0123'; }
  get placeholder() { return this.cfg.lockMode === 'otp-referral' ? 'e.g. LH-REF-2026-00000' : 'e.g. REF-2026-XXXX'; }
  get hint() { return this.cfg.lockMode === 'otp-referral' ? 'Printed on your prescription or referral slip from your consulting doctor.' : 'Issued by our executive team with your invitation.'; }
  ngAfterViewInit() { setTimeout(() => this.refEl?.nativeElement.focus(), 80); }
  check() {
    if (!this.code.trim()) { this.state.set('empty'); this.refEl?.nativeElement.focus(); return; }
    this.busy.set(true); this.state.set('idle');
    setTimeout(() => { this.busy.set(false); this.state.set('invalid'); this.refEl?.nativeElement.select(); }, 1300);
  }
  support(k: 'call' | 'chat') {
    this.toast.show(k === 'call' ? 'Request sent. An executive will call you shortly with a valid referral code.' : 'Connecting you to executive support…', 'ok');
  }
}
