import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from '@/contexts/ThemeContext';
import {
  DARK_MODE,
  LIGHT_MODE,
  THEME_STORAGE_KEY,
} from '@/constants/themeConstants';

/**
 * Get old theme setting in localStorage
 * @returns ThemeMode
 */
const getInitialTheme = (): ThemeMode => {
  const oldSettingTheme = localStorage.getItem(THEME_STORAGE_KEY);

  // If there is any setting saved in localStorage, use it instead
  if (oldSettingTheme && [LIGHT_MODE, DARK_MODE].includes(oldSettingTheme)) {
    return oldSettingTheme as ThemeMode;
  }

  const isSettingDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  return isSettingDarkMode ? DARK_MODE : LIGHT_MODE;
};

/**
 * Add context for light mode/dark mode theme for children components
 * @returns Theme provider for children component
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  const themeValue = useMemo(
    () => ({
      theme: currentTheme,
      toggleTheme: () =>
        setCurrentTheme((prev) =>
          prev === LIGHT_MODE ? DARK_MODE : LIGHT_MODE,
        ),
    }),
    [currentTheme],
  );

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};
