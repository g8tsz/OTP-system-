import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCountdown } from '@/hooks/useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down and enables proceed at zero', () => {
    const { result } = renderHook(() => useCountdown(true, 3));

    expect(result.current.countdown).toBe(3);
    expect(result.current.canProceed).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.countdown).toBe(0);
    expect(result.current.canProceed).toBe(true);
  });

  it('resets countdown', () => {
    const { result } = renderHook(() => useCountdown(true, 5));

    act(() => {
      vi.advanceTimersByTime(2000);
      result.current.reset(10);
    });

    expect(result.current.countdown).toBe(10);
    expect(result.current.canProceed).toBe(false);
  });
});
