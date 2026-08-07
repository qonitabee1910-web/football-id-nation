/**
 * IDN-UI-GEN-001: CUSTOM HOOKS
 * 
 * Derives from:
 * - EPOS-CORE-DOC-001 (Coding Standards)
 * - IDN-DS-001 (Design System Hooks)
 * 
 * Implements:
 * - useAuth: Authentication state & operations
 * - useTheme: Theme mode management
 * - useResponsive: Responsive breakpoint detection
 * - useNotification: Toast/banner notifications
 * - useMediaQuery: Generic media query hook
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import type { ThemeMode, AuthSession } from '~/types';

// =============================================================================
// USE AUTH HOOK (IDN-PRD-001: Authentication)
// =============================================================================

interface UseAuthReturn {
  session: AuthSession | null;
  isLoading: boolean;
  error?: Error;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    // Initialize auth state from browser/server
    const initAuth = async () => {
      try {
        // Placeholder: In production, fetch from server/API
        // const response = await fetch('/api/auth/session');
        // const data = await response.json();
        // setSession(data);
        
        setSession(null); // Default: unauthenticated
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Auth initialization failed'));
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = useCallback(async () => {
    try {
      // Placeholder: In production, call logout endpoint
      // await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      localStorage.clear();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
    }
  }, []);

  return { session, isLoading, error, logout };
};

// =============================================================================
// USE THEME HOOK (IDN-DS-001: Theme Management)
// =============================================================================

interface UseThemeReturn {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Get saved preference
    const saved = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (saved) {
      setMode(saved);
    }

    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (saved === 'system' && prefersDark) || (!saved && prefersDark);
    
    setResolvedMode(shouldBeDark ? 'dark' : 'light');
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const updateMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);

    if (newMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedMode(prefersDark ? 'dark' : 'light');
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      setResolvedMode(newMode);
      if (newMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'));
  }, []);

  if (!isMounted) {
    return { mode: 'system', resolvedMode: 'light', setMode, toggle };
  }

  return { mode, resolvedMode, setMode: updateMode, toggle };
};

// =============================================================================
// USE RESPONSIVE HOOK (IDN-DS-001: Responsive Breakpoints)
// =============================================================================

export type ResponsiveBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface UseResponsiveReturn {
  breakpoint: ResponsiveBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  width: number;
}

export const useResponsive = (): UseResponsiveReturn => {
  const [breakpoint, setBreakpoint] = useState<ResponsiveBreakpoint>('mobile');
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    const handleResize = () => {
      const w = window.innerWidth;
      setWidth(w);

      // Determine breakpoint (IDN-DS-001 PART 4.1)
      if (w < 768) {
        setBreakpoint('mobile');
      } else if (w < 1024) {
        setBreakpoint('tablet');
      } else if (w < 1440) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('wide');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isWide: breakpoint === 'wide',
    width,
  };
};

// =============================================================================
// USE MEDIA QUERY HOOK (IDN-DS-001: Media Query Detection)
// =============================================================================

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// =============================================================================
// USE NOTIFICATION HOOK (IDN-DS-001: Notifications)
// =============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface UseNotificationReturn {
  notifications: Notification[];
  show: (type: NotificationType, message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const show = useCallback((type: NotificationType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setNotifications((prev) => [...prev, { id, type, message, duration }]);

    if (duration > 0) {
      const timeout = setTimeout(() => {
        dismiss(id);
      }, duration);

      timeoutsRef.current.set(id, timeout);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    show('success', message, duration);
  }, [show]);

  const error = useCallback((message: string, duration?: number) => {
    show('error', message, duration);
  }, [show]);

  const warning = useCallback((message: string, duration?: number) => {
    show('warning', message, duration);
  }, [show]);

  const info = useCallback((message: string, duration?: number) => {
    show('info', message, duration);
  }, [show]);

  useEffect(() => {
    return () => {
      // Cleanup all timeouts on unmount
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  return {
    notifications,
    show,
    dismiss,
    success,
    error,
    warning,
    info,
  };
};

// =============================================================================
// USE LOCAL STORAGE HOOK
// =============================================================================

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

// =============================================================================
// USE PREVIOUS HOOK (Track previous value)
// =============================================================================

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// =============================================================================
// USE DEBOUNCE HOOK
// =============================================================================

export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// =============================================================================
// USE CLICK OUTSIDE HOOK
// =============================================================================

export const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
