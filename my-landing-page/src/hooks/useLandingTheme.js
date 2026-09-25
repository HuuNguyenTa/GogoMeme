import { useCallback, useLayoutEffect, useState } from 'react';

export const THEME_STORAGE_KEY = 'tram-yeu-thuong-theme-v1';
const isTheme = (value) => value === 'day' || value === 'night';

function initialTheme() {
  // The pre-paint bootstrap already resolved storage/system preferences.
  const bootstrapped = document.documentElement.dataset.theme;
  if (isTheme(bootstrapped)) return bootstrapped;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(saved)) return saved;
  } catch { /* Storage may be disabled; an in-memory choice remains usable. */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
}

export default function useLandingTheme() {
  const [theme, setTheme] = useState(initialTheme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme === 'night' ? 'dark' : 'light';
    root.style.backgroundColor = theme === 'night' ? '#11182d' : '#fffdf9';
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'night' ? 'day' : 'night';
    try { window.localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Optional persistence. */ }
    setTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}
