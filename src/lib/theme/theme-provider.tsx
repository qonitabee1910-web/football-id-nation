import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { THEME_COOKIE_NAME, THEME_STORAGE_KEY } from "./theme-script";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const themeOptions: readonly Theme[] = ["light", "dark", "system"] as const;

export interface ThemeContextValue {
  readonly theme: Theme;
  readonly setTheme: (theme: Theme) => void;
  readonly resolvedTheme: ResolvedTheme;
  readonly isDark: boolean;
  readonly themeOptions: readonly Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1] as string) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds = 31_536_000): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function readStorage(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode, etc.) */
  }
}

function detectSystemTheme(): ResolvedTheme {
  if (typeof matchMedia !== "function") return "light";
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? detectSystemTheme() : theme;
}

function applyResolvedTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function getInitialTheme(): Theme {
  const raw = readCookie(THEME_COOKIE_NAME) ?? readStorage(THEME_STORAGE_KEY);
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme,
}: ThemeProviderProps): ReactNode {
  const [theme, setThemeState] = useState<Theme>(() => defaultTheme ?? getInitialTheme());

  const resolvedTheme = useMemo<ResolvedTheme>(() => resolveTheme(theme), [theme]);
  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);

  const setTheme = useCallback((next: Theme): void => {
    setThemeState(next);
    writeCookie(THEME_COOKIE_NAME, next);
    writeStorage(THEME_STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    applyResolvedTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;
    if (typeof matchMedia !== "function") return;
    const mql = matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (): void => {
      applyResolvedTheme(resolveTheme("system"));
    };
    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      isDark,
      themeOptions,
    }),
    [theme, setTheme, resolvedTheme, isDark],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx == null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
