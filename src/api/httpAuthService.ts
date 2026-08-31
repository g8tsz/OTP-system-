import { env } from '@/config/env';
import type { ApiErrorCode, AuthService, SendOtpResult, VerifyOtpResult } from '@/api/types';
import { AuthServiceError } from '@/api/types';

async function request<T>(path: string, body: Record<string, string>): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as T & {
    code?: ApiErrorCode;
    message?: string;
    retryAfterSeconds?: number;
  };

  if (!response.ok) {
    throw new AuthServiceError({
      code: data.code ?? 'NETWORK_ERROR',
      message: data.message ?? 'Request failed.',
      retryAfterSeconds: data.retryAfterSeconds,
    });
  }

  return data;
}

export const httpAuthService: AuthService = {
  sendOtp(email: string): Promise<SendOtpResult> {
    return request<SendOtpResult>('/auth/send-otp', { email: email.trim() });
  },

  resendOtp(email: string, sessionId: string): Promise<SendOtpResult> {
    return request<SendOtpResult>('/auth/resend-otp', { email: email.trim(), sessionId });
  },

  verifyOtp(email: string, sessionId: string, code: string): Promise<VerifyOtpResult> {
    return request<VerifyOtpResult>('/auth/verify-otp', {
      email: email.trim(),
      sessionId,
      code,
    });
  },
};
