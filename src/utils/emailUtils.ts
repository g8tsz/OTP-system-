export function parseEmailAddress(email: string): { local: string; domain: string } | null {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === trimmed.length - 1) return null;
  return {
    local: trimmed.slice(0, atIndex),
    domain: trimmed.slice(atIndex + 1).toLowerCase(),
  };
}

export function maskEmail(email: string): string {
  const parsed = parseEmailAddress(email);
  if (!parsed) return email.trim();
  const { local, domain } = parsed;
  if (local.length === 1) return `${local[0]}•••@${domain}`;
  if (local.length === 2) return `${local[0]}•${local[1]}@${domain}`;
  return `${local[0]}${'•'.repeat(Math.min(local.length - 2, 4))}${local[local.length - 1]}@${domain}`;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}
