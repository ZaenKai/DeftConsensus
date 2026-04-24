"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "deftconsensus-theme";
export const DEFAULT_THEME: ThemeMode = "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Applies the theme to the document element.
 *
 * The library's `styles.css` defines the dark palette on `:root`, so no class
 * is required for dark. Light mode is opt-in via the `light` class, which we
 * override in `globals.css`.
 */
function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("light", mode === "light");
  root.style.colorScheme = mode;
}

function readDomTheme(): ThemeMode {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);

  useEffect(() => {
    // The pre-hydration script has already set the initial class on <html>
    // before React mounted; sync React state to whatever that decided.
    const initial: ThemeMode =
      document.documentElement.classList.contains("light") ? "light" : "dark";
    setThemeState(initial);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // localStorage may be unavailable (private mode, SSR); ignore.
    }
    applyTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Standalone fallback used when `useTheme` is called outside a `ThemeProvider`.
 * Reads/writes the `light` class on `<html>` directly so isolated components
 * (e.g. tests that render a page without the root layout) still work.
 */
function useStandaloneTheme(): ThemeContextValue {
  const [theme, setThemeState] = useState<ThemeMode>(readDomTheme());

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    applyTheme(mode);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  const fallback = useStandaloneTheme();
  return ctx ?? fallback;
}

/**
 * Inline script stringified for `dangerouslySetInnerHTML` in the root layout.
 * Runs before React hydrates so the correct theme class is present on first
 * paint, preventing a light flash on dark-default pages.
 */
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var mode = stored === 'light' ? 'light' : 'dark';
    if (mode === 'light') {
      document.documentElement.classList.add('light');
    }
    document.documentElement.style.colorScheme = mode;
  } catch (e) {}
})();
`;
