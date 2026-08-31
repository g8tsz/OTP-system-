export type ApiErrorCode =
  | 'RATE_LIMITED'
  | 'INVALID_CODE'
  | 'EXPIRED'
  | 'TOO_MANY_ATTEMPTS'
  | 'NETWORK_ERROR'
  | 'INVALID_EMAIL'
  | 'SESSION_NOT_FOUND';

export interface AuthError {
  code: ApiErrorCode;
  message: string;
  retryAfterSeconds?: number;
}

export interface SendOtpResult {
  sessionId: string;
  expiresAt: string;
}

export interface VerifyOtpResult {
  verified: true;
}

export interface AuthService {
  sendOtp(email: string): Promise<SendOtpResult>;
  resendOtp(email: string, sessionId: string): Promise<SendOtpResult>;
  verifyOtp(email: string, sessionId: string, code: string): Promise<VerifyOtpResult>;
}

export class AuthServiceError extends Error {
  constructor(public readonly authError: AuthError) {
    super(authError.message);
    this.name = 'AuthServiceError';
  }
}

export function isAuthServiceError(error: unknown): error is AuthServiceError {
  return error instanceof AuthServiceError;
}

export function getAuthError(error: unknown): AuthError {
  if (isAuthServiceError(error)) return error.authError;
  return { code: 'NETWORK_ERROR', message: 'Something went wrong. Please try again.' };
}
