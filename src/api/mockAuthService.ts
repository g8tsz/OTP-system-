import type { AuthError, AuthService, SendOtpResult, VerifyOtpResult } from '@/api/types';
import { AuthServiceError } from '@/api/types';
import { env } from '@/config/env';

const DEMO_CODE = '123456';
const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_MS = 15 * 60 * 1000;
export const MAX_VERIFY_ATTEMPTS = 5;
const MOCK_LATENCY_MS = 800;

interface OtpSession {
  email: string;
  code: string;
  sessionId: string;
  expiresAt: number;
  attempts: number;
  locked: boolean;
}

interface SendHistory {
  timestamps: number[];
}

const sessions = new Map<string, OtpSession>();
const sendHistory = new Map<string, SendHistory>();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateCode(): string {
  if (env.demoMode) return DEMO_CODE;
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateSessionId(): string {
  return crypto.randomUUID();
}

function getExpiryMs(): number {
  return env.otpExpiryMinutes * 60 * 1000;
}

function checkSendRateLimit(email: string): AuthError | null {
  const now = Date.now();
  const history = sendHistory.get(email) ?? { timestamps: [] };
  const recent = history.timestamps.filter((t) => now - t < SEND_WINDOW_MS);

  if (recent.length >= MAX_SENDS_PER_WINDOW) {
    const oldest = recent[0]!;
    const retryAfterSeconds = Math.ceil((SEND_WINDOW_MS - (now - oldest)) / 1000);
    return {
      code: 'RATE_LIMITED',
      message: `Too many code requests. Try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
      retryAfterSeconds,
    };
  }

  sendHistory.set(email, { timestamps: [...recent, now] });
  return null;
}

function createSession(email: string): OtpSession {
  const code = generateCode();
  const sessionId = generateSessionId();
  const session: OtpSession = {
    email,
    code,
    sessionId,
    expiresAt: Date.now() + getExpiryMs(),
    attempts: 0,
    locked: false,
  };
  sessions.set(sessionId, session);

  if (env.demoMode && import.meta.env.DEV) {
    console.info(`[mock auth] OTP for ${email}: ${code}`);
  }

  return session;
}

export const mockAuthService: AuthService = {
  async sendOtp(email: string): Promise<SendOtpResult> {
    await delay(MOCK_LATENCY_MS);
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes('@')) {
      throw new AuthServiceError({ code: 'INVALID_EMAIL', message: 'Enter a valid email address.' });
    }

    const rateError = checkSendRateLimit(normalized);
    if (rateError) throw new AuthServiceError(rateError);

    const session = createSession(normalized);
    return {
      sessionId: session.sessionId,
      expiresAt: new Date(session.expiresAt).toISOString(),
    };
  },

  async resendOtp(email: string, sessionId: string): Promise<SendOtpResult> {
    await delay(MOCK_LATENCY_MS);
    const normalized = email.trim().toLowerCase();
    sessions.delete(sessionId);

    const rateError = checkSendRateLimit(normalized);
    if (rateError) throw new AuthServiceError(rateError);

    const session = createSession(normalized);
    return {
      sessionId: session.sessionId,
      expiresAt: new Date(session.expiresAt).toISOString(),
    };
  },

  async verifyOtp(email: string, sessionId: string, code: string): Promise<VerifyOtpResult> {
    await delay(MOCK_LATENCY_MS);
    const normalized = email.trim().toLowerCase();
    const session = sessions.get(sessionId);

    if (!session || session.email !== normalized) {
      throw new AuthServiceError({
        code: 'SESSION_NOT_FOUND',
        message: 'Session expired. Please request a new code.',
      });
    }

    if (session.locked) {
      throw new AuthServiceError({
        code: 'TOO_MANY_ATTEMPTS',
        message: 'Too many failed attempts. Request a new code.',
      });
    }

    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionId);
      throw new AuthServiceError({
        code: 'EXPIRED',
        message: 'This code has expired. Request a new one.',
      });
    }

    session.attempts += 1;

    if (code !== session.code) {
      if (session.attempts >= MAX_VERIFY_ATTEMPTS) {
        session.locked = true;
        throw new AuthServiceError({
          code: 'TOO_MANY_ATTEMPTS',
          message: 'Too many failed attempts. Request a new code.',
        });
      }
      const remaining = MAX_VERIFY_ATTEMPTS - session.attempts;
      throw new AuthServiceError({
        code: 'INVALID_CODE',
        message: `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      });
    }

    sessions.delete(sessionId);
    return { verified: true };
  },
};

/** Test helper — reset in-memory mock state between tests. */
export function resetMockAuthState() {
  sessions.clear();
  sendHistory.clear();
}
