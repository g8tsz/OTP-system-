const parseIntEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  apiUrl: import.meta.env.VITE_API_URL?.trim() || '',
  demoMode:
    import.meta.env.VITE_DEMO_MODE !== 'false' && (import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true'),
  otpLength: parseIntEnv(import.meta.env.VITE_OTP_LENGTH, 6),
  resendCooldownSeconds: parseIntEnv(import.meta.env.VITE_RESEND_COOLDOWN_SECONDS, 30),
  otpExpiryMinutes: parseIntEnv(import.meta.env.VITE_OTP_EXPIRY_MINUTES, 10),
  useMockApi: !import.meta.env.VITE_API_URL?.trim(),
} as const;
