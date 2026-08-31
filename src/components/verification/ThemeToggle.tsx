import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { cycleTheme, themeLabel } = useTheme();

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="fixed top-4 right-4 z-20 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-muted)] backdrop-blur transition-colors hover:text-[var(--text-primary)]"
      aria-label={`Theme: ${themeLabel}. Click to change.`}
    >
      {themeLabel}
    </button>
  );
}
