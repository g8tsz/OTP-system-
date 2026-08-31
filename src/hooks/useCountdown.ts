import { useEffect, useState } from 'react';

export function useCountdown(active: boolean, initialSeconds: number) {
  const [countdown, setCountdown] = useState(initialSeconds);

  const reset = (seconds = initialSeconds) => {
    setCountdown(seconds);
  };

  useEffect(() => {
    if (!active || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [active, countdown]);

  const canProceed = active && countdown <= 0;

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const progressPercent = ((initialSeconds - countdown) / initialSeconds) * 100;

  return { countdown, canProceed, reset, formatTime, progressPercent };
}

export function useOtpExpiry(expiresAt: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) {
    return { remainingSeconds: null, expired: false, expiryLabel: null };
  }

  const remainingSeconds = Math.floor((new Date(expiresAt).getTime() - now) / 1000);
  const expired = remainingSeconds <= 0;

  const formatExpiry = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const expiryLabel = remainingSeconds > 0 ? `Code expires in ${formatExpiry(remainingSeconds)}` : 'Code expired';

  return { remainingSeconds: Math.max(remainingSeconds, 0), expired, expiryLabel };
}

export { env } from '@/config/env';
