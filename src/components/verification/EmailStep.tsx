import type { RefObject } from 'react';
import type { EmailProvider } from '@/constants/providers';
import { StepProgress } from '@/components/verification/StepProgress';
import { cn } from '@/utils/cn';

interface EmailStepProps {
  email: string;
  emailError: string;
  sending: boolean;
  provider: EmailProvider;
  emailInputRef: RefObject<HTMLInputElement | null>;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailStep({
  email,
  emailError,
  sending,
  provider,
  emailInputRef,
  onEmailChange,
  onSubmit,
}: EmailStepProps) {
  return (
    <>
      <StepProgress currentStep={1} />

      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
          <svg
            className="w-8 h-8 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-7">
        <h1 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-1.5 tracking-tight">
          Verify your email
        </h1>
        <p className="text-sm text-[var(--text-muted)]">Enter your email to receive a verification code.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200',
              emailError
                ? 'border-red-500/40 bg-red-500/5'
                : 'border-[var(--border-subtle)] bg-[var(--surface-muted)] focus-within:border-[var(--border-strong)] focus-within:bg-[var(--surface-elevated)]'
            )}
          >
            <div className="shrink-0 transition-all duration-300" style={{ color: provider.color }}>
              {provider.icon}
            </div>
            <input
              ref={emailInputRef}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@gmail.com"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'email-error' : undefined}
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] outline-none"
            />
          </div>
          {emailError && (
            <p id="email-error" className="text-xs text-red-400/80 mt-1.5 ml-1" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={sending}
          className={cn(
            'w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
            sending
              ? 'bg-[var(--surface-muted)] text-[var(--text-faint)] cursor-not-allowed'
              : 'bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90'
          )}
        >
          {sending ? (
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending code…
            </span>
          ) : (
            'Send verification code'
          )}
        </button>
      </form>
    </>
  );
}
