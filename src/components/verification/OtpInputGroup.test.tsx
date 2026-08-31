import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OtpInputGroup } from '@/components/verification/OtpInputGroup';

function renderGroup(overrides: Partial<Parameters<typeof OtpInputGroup>[0]> = {}) {
  const inputRefs = { current: [] as (HTMLInputElement | null)[] };
  const hiddenInputRef = { current: null as HTMLInputElement | null };

  const props = {
    digits: ['', '', '', '', '', ''],
    activeIndex: 0,
    verifyState: 'idle' as const,
    verifyError: '',
    otpLength: 6,
    inputRefs,
    hiddenInputRef,
    onHiddenChange: vi.fn(),
    onChange: vi.fn(),
    onKeyDown: vi.fn(),
    onPaste: vi.fn(),
    onFocus: vi.fn(),
    ...overrides,
  };

  render(<OtpInputGroup {...props} />);
  return props;
}

describe('OtpInputGroup', () => {
  it('renders six digit inputs and a hidden autofill input', () => {
    const { hiddenInputRef } = renderGroup();
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(hiddenInputRef.current).toBeTruthy();
  });

  it('forwards delete key handling', async () => {
    const user = userEvent.setup();
    const props = renderGroup();
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]!);
    await user.keyboard('{Delete}');
    expect(props.onKeyDown).toHaveBeenCalled();
  });
});
