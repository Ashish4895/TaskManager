"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  COLOR_STORAGE_KEY,
  isColorMode,
  isTheme,
  THEME_STORAGE_KEY,
  type ColorMode,
  type Theme,
} from "@/lib/themes";

interface ThemeContextValue {
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (theme: Theme) => void;
  setColorMode: (color: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorMode, setColorModeState] = useState<ColorMode>("blue");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const storedColor = localStorage.getItem(COLOR_STORAGE_KEY);
    if (storedTheme && isTheme(storedTheme)) setThemeState(storedTheme);
    if (storedColor && isColorMode(storedColor)) setColorModeState(storedColor);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-color", colorMode);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(COLOR_STORAGE_KEY, colorMode);
  }, [theme, colorMode, ready]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const setColorMode = useCallback((next: ColorMode) => setColorModeState(next), []);

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
