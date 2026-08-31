import type { MutableRefObject } from 'react';

export function clearTimeoutRef(ref: MutableRefObject<ReturnType<typeof setTimeout> | null>) {
  if (ref.current) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}
