import { useMemo } from 'react';
import { env } from '@/config/env';
import { detectProvider } from '@/constants/providers';
import { useVerificationFlow, type VerificationSuccessPayload } from '@/hooks/useVerificationFlow';
import { Confetti } from '@/components/verification/Confetti';
import { EmailStep } from '@/components/verification/EmailStep';
import { OtpStep } from '@/components/verification/OtpStep';
import { ThemeToggle } from '@/components/verification/ThemeToggle';
import { cn } from '@/utils/cn';

export interface VerificationFlowProps {
  onSuccess?: (payload: VerificationSuccessPayload) => void;
  successRedirectUrl?: string;
}

export default function VerificationFlow({ onSuccess, successRedirectUrl }: VerificationFlowProps) {
  const flow = useVerificationFlow({ onSuccess, successRedirectUrl });
  const provider = useMemo(() => detectProvider(flow.email), [flow.email]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4 relative overflow-hidden">
      <ThemeToggle />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--glow)] rounded-full blur-3xl" />
      </div>

      {flow.successConfetti && <Confetti />}

      <div className="relative z-10 w-full max-w-md">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {flow.statusMessage}
        </div>

        <div
          className={cn(
            'bg-[var(--surface)] backdrop-blur-2xl border border-[var(--border-subtle)] rounded-2xl p-7 md:p-9 shadow-2xl',
            'animate-fade-in-up'
          )}
        >
          {flow.step === 'email' ? (
            <EmailStep
              email={flow.email}
              emailError={flow.emailError}
              sending={flow.sending}
              provider={provider}
              emailInputRef={flow.emailInputRef}
              onEmailChange={(value) => {
                flow.setEmail(value);
                flow.setEmailError('');
              }}
              onSubmit={flow.handleEmailSubmit}
            />
          ) : (
            <OtpStep
              masked={flow.masked}
              provider={provider}
              digits={flow.digits}
              activeIndex={flow.activeIndex}
              verifyState={flow.verifyState}
              verifyError={flow.verifyError}
              resending={flow.resending}
              resendNotice={flow.resendNotice}
              canResend={flow.canResend}
              countdown={flow.countdown}
              formatTime={flow.formatTime}
              progressPercent={flow.progressPercent}
              expiresAt={flow.expiresAt}
              otpLength={flow.otpLength}
              resendCooldown={flow.resendCooldown}
              inputRefs={flow.inputRefs}
              hiddenInputRef={flow.hiddenInputRef}
              onHiddenChange={flow.handleHiddenChange}
              onChange={flow.handleChange}
              onKeyDown={flow.handleKeyDown}
              onPaste={flow.handlePaste}
              onFocus={flow.setActiveIndex}
              onResend={flow.handleResend}
              onGoBack={flow.handleGoBack}
              onContinue={flow.handleContinue}
            />
          )}
        </div>

        {env.demoMode && (
          <p className="text-center text-[11px] text-[var(--text-faint)] mt-5 font-mono">
            demo: 123456 = success · anything else = error
          </p>
        )}
      </div>
    </div>
  );
}

export { VerificationFlow };
