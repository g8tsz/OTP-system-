import { describe, expect, it } from 'vitest';
import { isValidEmail, maskEmail, parseEmailAddress } from '@/utils/emailUtils';

describe('parseEmailAddress', () => {
  it('parses standard emails', () => {
    expect(parseEmailAddress('user@gmail.com')).toEqual({ local: 'user', domain: 'gmail.com' });
  });

  it('uses the last @ for unusual addresses', () => {
    expect(parseEmailAddress('foo@bar@gmail.com')).toEqual({
      local: 'foo@bar',
      domain: 'gmail.com',
    });
  });

  it('returns null for invalid input', () => {
    expect(parseEmailAddress('invalid')).toBeNull();
    expect(parseEmailAddress('@domain.com')).toBeNull();
  });
});

describe('maskEmail', () => {
  it('masks one- and two-character locals', () => {
    expect(maskEmail('a@gmail.com')).toBe('a•••@gmail.com');
    expect(maskEmail('ab@gmail.com')).toBe('a•b@gmail.com');
  });

  it('masks longer locals', () => {
    expect(maskEmail('username@gmail.com')).toBe('u••••e@gmail.com');
  });
});

describe('isValidEmail', () => {
  it('validates basic email format', () => {
    expect(isValidEmail('user@gmail.com')).toBe(true);
    expect(isValidEmail('bad')).toBe(false);
  });
});
