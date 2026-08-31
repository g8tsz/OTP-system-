import type { RefObject } from 'react';
import type { VerifyState } from '@/hooks/useVerificationFlow';
import { cn } from '@/utils/cn';

interface OtpInputGroupProps {
  digits: string[];
  activeIndex: number;
  verifyState: VerifyState;
  verifyError: string;
  otpLength: number;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  hiddenInputRef: RefObject<HTMLInputElement | null>;
  onHiddenChange: (value: string) => void;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent, startIndex: number) => void;
  onFocus: (index: number) => void;
}

export function OtpInputGroup({
  digits,
  activeIndex,
  verifyState,
  verifyError,
  otpLength,
  inputRefs,
  hiddenInputRef,
  onHiddenChange,
  onChange,
  onKeyDown,
  onPaste,
  onFocus,
}: OtpInputGroupProps) {
  const disabled = verifyState === 'verifying' || verifyState === 'success' || verifyState === 'locked';
  const otpValue = digits.join('');
  const errorId = verifyError ? 'otp-error' : undefined;

  return (
    <div
      role="group"
      aria-labelledby="otp-label"
      aria-describedby={errorId}
      className={cn('relative mb-6', verifyState === 'error' && 'animate-shake')}
    >
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={otpValue}
        onChange={(e) => onHiddenChange(e.target.value)}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute opacity-0 pointer-events-none h-0 w-0"
      />

      <div className="flex justify-center gap-2.5">
        {digits.map((digit, i) => (
          <div key={i} className="relative">
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              maxLength={1}
              value={digit}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={(e) => onPaste(e, i)}
              onFocus={() => onFocus(i)}
              disabled={disabled}
              aria-label={`Digit ${i + 1} of ${otpLength}`}
              aria-invalid={verifyState === 'error' || verifyState === 'locked'}
              className={cn(
                'w-12 h-14 md:w-[52px] md:h-[60px] text-center text-xl md:text-2xl font-semibold rounded-lg border outline-none transition-all duration-200',
                'bg-transparent text-[var(--text-primary)] caret-[var(--text-muted)] focus:ring-0',
                digit && 'animate-digit-pop',
                verifyState === 'success'
                  ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500'
                  : verifyState === 'error' || verifyState === 'locked'
                    ? 'border-red-500/50 bg-red-500/5 text-red-400'
                    : verifyState === 'verifying'
                      ? 'border-[var(--border-subtle)] bg-[var(--surface-muted)]'
                      : activeIndex === i
                        ? 'border-[var(--border-strong)] bg-[var(--surface-elevated)]'
                        : digit
                          ? 'border-[var(--border-subtle)] bg-[var(--surface-muted)]'
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              )}
            />
            {activeIndex === i && !digit && verifyState === 'idle' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-5 bg-[var(--text-muted)] animate-pulse rounded-full" />
            )}
          </div>
        ))}
      </div>

      {verifyError && (
        <p id="otp-error" className="sr-only" role="alert">
          {verifyError}
        </p>
      )}
    </div>
  );
}
