import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { authService } from '@/api';
import { getAuthError } from '@/api/types';
import { env } from '@/config/env';
import { useCountdown } from '@/hooks/useCountdown';
import { maskEmail, isValidEmail } from '@/utils/emailUtils';
import { clearTimeoutRef } from '@/utils/timeout';

export type VerifyState = 'idle' | 'verifying' | 'success' | 'error' | 'locked';
export type AppStep = 'email' | 'otp';

export interface VerificationSuccessPayload {
  email: string;
  sessionId: string;
}

export interface UseVerificationFlowOptions {
  onSuccess?: (payload: VerificationSuccessPayload) => void;
  successRedirectUrl?: string;
}

export function useVerificationFlow(options: UseVerificationFlowOptions = {}) {
  const { onSuccess, successRedirectUrl } = options;
  const otpLength = env.otpLength;
  const resendCooldown = env.resendCooldownSeconds;

  const [step, setStep] = useState<AppStep>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [digits, setDigits] = useState<string[]>(() => Array(otpLength).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const [verifyError, setVerifyError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState('');
  const [successConfetti, setSuccessConfetti] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resendNoticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const countdownActive = step === 'otp';
  const {
    countdown,
    canProceed: canResend,
    reset: resetCountdown,
    formatTime,
    progressPercent,
  } = useCountdown(countdownActive, resendCooldown);

  const masked = useMemo(() => maskEmail(email), [email]);

  const clearFlowTimeouts = useCallback(() => {
    clearTimeoutRef(confettiTimeoutRef);
    clearTimeoutRef(errorResetTimeoutRef);
    clearTimeoutRef(resendNoticeTimeoutRef);
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const resetOtpState = useCallback(() => {
    clearFlowTimeouts();
    setDigits(Array(otpLength).fill(''));
    setActiveIndex(0);
    setVerifyState('idle');
    setVerifyError('');
    setResending(false);
    setResendNotice('');
    setSuccessConfetti(false);
    setSessionId(null);
    setExpiresAt(null);
    resetCountdown(resendCooldown);
  }, [clearFlowTimeouts, otpLength, resendCooldown, resetCountdown]);

  useEffect(() => () => clearFlowTimeouts(), [clearFlowTimeouts]);

  useEffect(() => {
    if (step === 'email') emailInputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (step === 'otp') hiddenInputRef.current?.focus();
  }, [step]);

  const focusInput = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, otpLength - 1));
      inputRefs.current[clamped]?.focus();
      hiddenInputRef.current?.focus();
      setActiveIndex(clamped);
    },
    [otpLength]
  );

  const cancelErrorReset = useCallback(() => {
    clearTimeoutRef(errorResetTimeoutRef);
    setVerifyState((s) => (s === 'error' ? 'idle' : s));
    setVerifyError('');
  }, []);

  const scheduleErrorReset = useCallback(() => {
    clearTimeoutRef(errorResetTimeoutRef);
    errorResetTimeoutRef.current = setTimeout(() => {
      errorResetTimeoutRef.current = null;
      setVerifyState('idle');
      setVerifyError('');
      setDigits(Array(otpLength).fill(''));
      focusInput(0);
    }, 1200);
  }, [focusInput, otpLength]);

  const showResendNotice = useCallback((message: string) => {
    setResendNotice(message);
    clearTimeoutRef(resendNoticeTimeoutRef);
    resendNoticeTimeoutRef.current = setTimeout(() => {
      resendNoticeTimeoutRef.current = null;
      setResendNotice('');
    }, 4000);
  }, []);

  const handleSendOtp = async (trimmedEmail: string, isResend = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result =
        isResend && sessionId
          ? await authService.resendOtp(trimmedEmail, sessionId)
          : await authService.sendOtp(trimmedEmail);

      if (controller.signal.aborted) return;

      setSessionId(result.sessionId);
      setExpiresAt(result.expiresAt);
      if (!isResend) setStep('otp');
      resetCountdown(resendCooldown);
      showResendNotice(`New code sent to ${maskEmail(trimmedEmail)}`);
      return true;
    } catch (error) {
      if (controller.signal.aborted) return false;
      const authError = getAuthError(error);
      if (isResend) {
        setVerifyError(authError.message);
      } else {
        setEmailError(authError.message);
      }
      return false;
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmail(trimmed);
    setEmailError('');
    setSending(true);
    await handleSendOtp(trimmed);
    setSending(false);
  };

  const triggerVerify = useCallback(
    async (otpDigits: string[]) => {
      const code = otpDigits.join('');
      if (code.length !== otpLength || !sessionId) return;

      clearFlowTimeouts();
      setVerifyState('verifying');
      setVerifyError('');

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await authService.verifyOtp(email.trim(), sessionId, code);
        if (controller.signal.aborted) return;

        setVerifyState('success');
        setSuccessConfetti(true);
        confettiTimeoutRef.current = setTimeout(() => {
          confettiTimeoutRef.current = null;
          setSuccessConfetti(false);
        }, 2500);

        const payload = { email: email.trim(), sessionId };
        onSuccess?.(payload);
      } catch (error) {
        if (controller.signal.aborted) return;
        const authError = getAuthError(error);
        setVerifyError(authError.message);

        if (authError.code === 'TOO_MANY_ATTEMPTS' || authError.code === 'EXPIRED') {
          setVerifyState('locked');
          setDigits(Array(otpLength).fill(''));
        } else {
          setVerifyState('error');
          scheduleErrorReset();
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [clearFlowTimeouts, email, onSuccess, otpLength, scheduleErrorReset, sessionId]
  );

  const applyDigits = useCallback(
    (nextDigits: string[], focusIndex: number) => {
      setDigits(nextDigits);
      focusInput(focusIndex);
      if (nextDigits.every(Boolean)) void triggerVerify(nextDigits);
    },
    [focusInput, triggerVerify]
  );

  const handleHiddenChange = (value: string) => {
    if (verifyState === 'verifying' || verifyState === 'success' || verifyState === 'locked') return;
    if (verifyState === 'error') cancelErrorReset();
    const cleaned = value.replace(/\D/g, '').slice(0, otpLength);
    const next = Array(otpLength).fill('');
    for (let i = 0; i < cleaned.length; i++) next[i] = cleaned[i];
    applyDigits(next, Math.min(cleaned.length, otpLength - 1));
  };

  const handleChange = (index: number, value: string) => {
    if (verifyState === 'verifying' || verifyState === 'success' || verifyState === 'locked') return;
    if (verifyState === 'error') cancelErrorReset();
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    applyDigits(next, digit && index < otpLength - 1 ? index + 1 : index);
  };

  const clearDigitAt = (index: number, moveToPrevious: boolean) => {
    const next = [...digits];
    if (digits[index]) {
      next[index] = '';
      setDigits(next);
    } else if (moveToPrevious && index > 0) {
      next[index - 1] = '';
      setDigits(next);
      focusInput(index - 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (verifyState === 'verifying' || verifyState === 'success' || verifyState === 'locked') return;
    if (verifyState === 'error') cancelErrorReset();

    if (e.key === 'Backspace') {
      e.preventDefault();
      clearDigitAt(index, true);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      clearDigitAt(index, false);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent, startIndex: number) => {
    if (verifyState === 'verifying' || verifyState === 'success' || verifyState === 'locked') return;
    if (verifyState === 'error') cancelErrorReset();
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, otpLength - startIndex);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[startIndex + i] = pasted[i]!;
    applyDigits(next, Math.min(startIndex + pasted.length, otpLength) - 1);
  };

  const handleResend = async () => {
    if (!canResend || resending || !email) return;
    setResending(true);
    setVerifyState('idle');
    setVerifyError('');
    setDigits(Array(otpLength).fill(''));
    await handleSendOtp(email.trim(), true);
    setResending(false);
    focusInput(0);
  };

  const handleGoBack = () => {
    clearFlowTimeouts();
    setStep('email');
    setSending(false);
    resetOtpState();
  };

  const handleContinue = () => {
    if (successRedirectUrl) {
      window.location.href = successRedirectUrl;
      return;
    }
    clearFlowTimeouts();
    setStep('email');
    setEmail('');
    setEmailError('');
    setSending(false);
    resetOtpState();
  };

  const statusMessage = useMemo(() => {
    if (step === 'email' && emailError) return emailError;
    if (resendNotice) return resendNotice;
    if (step !== 'otp') return '';
    if (verifyError) return verifyError;
    switch (verifyState) {
      case 'verifying':
        return 'Verifying code…';
      case 'success':
        return 'Email verified successfully.';
      case 'locked':
        return verifyError || 'Too many attempts. Request a new code.';
      default:
        return '';
    }
  }, [step, emailError, resendNotice, verifyError, verifyState]);

  return {
    step,
    email,
    setEmail,
    emailError,
    setEmailError,
    sending,
    masked,
    digits,
    activeIndex,
    verifyState,
    verifyError,
    resending,
    resendNotice,
    successConfetti,
    canResend,
    countdown,
    formatTime,
    progressPercent,
    expiresAt,
    otpLength,
    resendCooldown,
    statusMessage,
    inputRefs,
    hiddenInputRef,
    emailInputRef,
    handleEmailSubmit,
    handleGoBack,
    handleContinue,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleHiddenChange,
    handleResend,
    focusInput,
    setActiveIndex,
  };
}
