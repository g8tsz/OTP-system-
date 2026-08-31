import type { EmailProvider } from '@/constants/providers';
import type { VerifyState } from '@/hooks/useVerificationFlow';
import { useOtpExpiry } from '@/hooks/useCountdown';
import { OtpInputGroup } from '@/components/verification/OtpInputGroup';
import { ProviderButton } from '@/components/verification/ProviderButton';
import { StepProgress } from '@/components/verification/StepProgress';
import { cn } from '@/utils/cn';
import type { RefObject } from 'react';

interface OtpStepProps {
  masked: string;
  provider: EmailProvider;
  digits: string[];
  activeIndex: number;
  verifyState: VerifyState;
  verifyError: string;
  resending: boolean;
  resendNotice: string;
  canResend: boolean;
  countdown: number;
  formatTime: (seconds: number) => string;
  progressPercent: number;
  expiresAt: string | null;
  otpLength: number;
  resendCooldown: number;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  hiddenInputRef: RefObject<HTMLInputElement | null>;
  onHiddenChange: (value: string) => void;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent, startIndex: number) => void;
  onFocus: (index: number) => void;
  onResend: () => void;
  onGoBack: () => void;
  onContinue: () => void;
}

export function OtpStep({
  masked,
  provider,
  digits,
  activeIndex,
  verifyState,
  verifyError,
  resending,
  resendNotice,
  canResend,
  countdown,
  formatTime,
  progressPercent,
  expiresAt,
  otpLength,
  inputRefs,
  hiddenInputRef,
  onHiddenChange,
  onChange,
  onKeyDown,
  onPaste,
  onFocus,
  onResend,
  onGoBack,
  onContinue,
}: OtpStepProps) {
  const { expiryLabel, expired } = useOtpExpiry(expiresAt);

  const title =
    verifyState === 'success'
      ? 'Verified!'
      : verifyState === 'error'
        ? 'Invalid Code'
        : verifyState === 'locked'
          ? 'Code Locked'
          : 'Check your email';

  return (
    <>
      <StepProgress currentStep={2} />

      <div className="flex justify-center mb-5">
        <div className="relative">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500',
              verifyState === 'success'
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/25 animate-success-pop'
                : verifyState === 'error' || verifyState === 'locked'
                  ? 'bg-red-500 shadow-lg shadow-red-500/25'
                  : 'bg-[var(--surface-muted)] border border-[var(--border-subtle)]'
            )}
          >
            {verifyState === 'verifying' ? (
              <svg
                className="w-7 h-7 text-[var(--text-muted)] animate-spin-slow"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : verifyState === 'success' ? (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : verifyState === 'error' || verifyState === 'locked' ? (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div style={{ color: provider.color }}>{provider.icon}</div>
            )}
          </div>
          {verifyState === 'verifying' && (
            <div className="absolute inset-0 rounded-2xl border-2 border-[var(--border-subtle)] animate-pulse-ring" />
          )}
        </div>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-1.5 tracking-tight">{title}</h1>
        <p id="otp-label" className="text-sm text-[var(--text-muted)] leading-relaxed">
          {verifyState === 'success' ? (
            'Your identity has been confirmed successfully.'
          ) : verifyState === 'error' || verifyState === 'locked' ? (
            <span className="text-red-400/70">{verifyError || 'The code you entered is incorrect. Try again.'}</span>
          ) : (
            <>
              We sent a {otpLength}-digit code to{' '}
              <span className="text-[var(--text-secondary)] font-medium">{masked}</span>
            </>
          )}
        </p>
        {verifyState !== 'success' && expiryLabel && (
          <p className={cn('text-xs mt-2 font-mono', expired ? 'text-red-400/70' : 'text-[var(--text-faint)]')}>
            {expiryLabel}
          </p>
        )}
        {resendNotice && (
          <p className="text-xs mt-2 text-emerald-400/80 animate-fade-in-up" role="status">
            {resendNotice}
          </p>
        )}
      </div>

      <OtpInputGroup
        digits={digits}
        activeIndex={activeIndex}
        verifyState={verifyState}
        verifyError={verifyError}
        otpLength={otpLength}
        inputRefs={inputRefs}
        hiddenInputRef={hiddenInputRef}
        onHiddenChange={onHiddenChange}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
      />

      {verifyState === 'verifying' && (
        <div className="mb-5 animate-fade-in-up">
          <div className="h-0.5 bg-[var(--surface-muted)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--text-faint)] rounded-full animate-shimmer w-full" />
          </div>
          <p className="text-center text-xs text-[var(--text-faint)] mt-2">Verifying…</p>
        </div>
      )}

      {verifyState !== 'success' && verifyState !== 'verifying' && provider.url && (
        <div className="mb-5 animate-fade-in-up">
          <ProviderButton provider={provider} />
        </div>
      )}

      {verifyState !== 'success' && (
        <div className="flex flex-col items-center gap-3">
          {!canResend && verifyState !== 'verifying' && (
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
                  <circle cx="20" cy="20" r="17" fill="none" stroke="var(--border-subtle)" strokeWidth="2.5" />
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 17}`}
                    strokeDashoffset={`${2 * Math.PI * 17 * (progressPercent / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-[var(--text-faint)]">
                  {countdown}
                </span>
              </div>
              <span className="text-xs text-[var(--text-faint)]">
                Resend in{' '}
                <span className="text-[var(--text-muted)] font-mono font-medium">{formatTime(countdown)}</span>
              </span>
            </div>
          )}

          {(canResend || verifyState === 'locked' || expired) && (
            <button
              type="button"
              onClick={onResend}
              disabled={resending || (!canResend && !expired && verifyState !== 'locked')}
              className={cn(
                'group inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all duration-200 animate-fade-in-up',
                resending
                  ? 'bg-[var(--surface-muted)] text-[var(--text-faint)] cursor-not-allowed'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] active:scale-95'
              )}
            >
              {resending ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Resend code
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onGoBack}
            className="text-[11px] text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
          >
            Wrong email? Go back
          </button>
        </div>
      )}

      {verifyState === 'success' && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3 rounded-lg bg-[var(--accent)] text-[var(--accent-text)] font-semibold text-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
          >
            Continue →
          </button>
        </div>
      )}
    </>
  );
}
