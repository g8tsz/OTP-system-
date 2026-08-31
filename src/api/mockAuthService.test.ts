import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthServiceError } from '@/api/types';
import { mockAuthService, resetMockAuthState } from '@/api/mockAuthService';

describe('mockAuthService', () => {
  beforeEach(() => {
    resetMockAuthState();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function runTimed<T>(operation: () => Promise<T>) {
    const promise = operation();
    await vi.advanceTimersByTimeAsync(1000);
    return promise;
  }

  it('sends OTP and verifies the demo code', async () => {
    const { sessionId } = await runTimed(() => mockAuthService.sendOtp('user@gmail.com'));
    await expect(runTimed(() => mockAuthService.verifyOtp('user@gmail.com', sessionId, '123456'))).resolves.toEqual({
      verified: true,
    });
  });

  it('rejects invalid codes with remaining attempts', async () => {
    const { sessionId } = await runTimed(() => mockAuthService.sendOtp('user@gmail.com'));
    const promise = mockAuthService.verifyOtp('user@gmail.com', sessionId, '000000');
    const assertion = expect(promise).rejects.toThrow(AuthServiceError);
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it('locks after too many failed attempts', async () => {
    const { sessionId } = await runTimed(() => mockAuthService.sendOtp('user@gmail.com'));
    for (let i = 0; i < 5; i++) {
      const promise = mockAuthService.verifyOtp('user@gmail.com', sessionId, '000000');
      const assertion = expect(promise).rejects.toThrow(AuthServiceError);
      await vi.advanceTimersByTimeAsync(1000);
      await assertion;
    }
    const promise = mockAuthService.verifyOtp('user@gmail.com', sessionId, '123456');
    const assertion = expect(promise).rejects.toThrow(AuthServiceError);
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it('rate-limits repeated send requests', async () => {
    await runTimed(() => mockAuthService.sendOtp('rate@gmail.com'));
    await runTimed(() => mockAuthService.sendOtp('rate@gmail.com'));
    await runTimed(() => mockAuthService.sendOtp('rate@gmail.com'));
    const promise = mockAuthService.sendOtp('rate@gmail.com');
    const assertion = expect(promise).rejects.toThrow(AuthServiceError);
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });
});
