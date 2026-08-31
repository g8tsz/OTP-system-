import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'otp-theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? 'system';
  });

  const resolved = resolveTheme(theme);

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, resolved]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      document.documentElement.dataset.theme = getSystemTheme();
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const cycleTheme = () => {
    setThemeState((current) => {
      if (current === 'system') return 'light';
      if (current === 'light') return 'dark';
      return 'system';
    });
  };

  const themeLabel = theme === 'system' ? `System (${resolved})` : theme.charAt(0).toUpperCase() + theme.slice(1);

  return { theme, resolved, cycleTheme, themeLabel };
}
