/**
 * IDN-UI-GEN-001: THEME PROVIDER & DESIGN TOKENS
 * 
 * Derives from:
 * - IDN-DS-001 (Design System: colors, spacing, typography)
 * - EPOS-CORE-DOC-001 (Coding Standards)
 * 
 * Implements:
 * - Dark/Light mode support
 * - Design token integration
 * - Tailwind CSS configuration
 * - System preference detection
 * 
 * Traceability: All tokens from IDN-DS-001 design system
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeMode } from '~/types';

// =============================================================================
// DESIGN TOKENS (IDN-DS-001)
// =============================================================================

const DESIGN_TOKENS = {
  // Colors from IDN-DS-001 PART 3.1
  colors: {
    primary: {
      navy: '#0F172A',      // Primary: Navy Blue
      light: '#1E293B',
      lighter: '#334155',
      lightest: '#64748B',
    },
    secondary: {
      green: '#15803D',     // Secondary: Football Green
      light: '#22C55E',
      lighter: '#86EFAC',
      lightest: '#DCFCE7',
    },
    semantic: {
      success: '#16A34A',   // Green
      warning: '#FBBF24',   // Amber
      danger: '#DC2626',    // Red
      info: '#3B82F6',      // Blue
    },
    neutral: {
      white: '#FFFFFF',
      light: '#F8FAFC',
      surface: '#F1F5F9',
      border: '#CBD5E1',
      secondary: '#64748B',
      tertiary: '#1E293B',
      black: '#0F172A',
    },
  },
  
  // Spacing: 8-point grid (IDN-DS-001 PART 3.3)
  spacing: {
    xs: '0.5rem',     // 8px
    sm: '1rem',       // 16px
    md: '1.5rem',     // 24px
    lg: '2rem',       // 32px
    xl: '2.5rem',     // 40px
    '2xl': '3rem',    // 48px
    '3xl': '3.5rem',  // 56px
    '4xl': '4rem',    // 64px
  },
  
  // Typography (IDN-DS-001 PART 3.2)
  typography: {
    fontSize: {
      tiny: '0.75rem',      // 12px
      small: '0.875rem',    // 14px
      base: '1rem',         // 16px
      lg: '1.125rem',       // 18px
      xl: '1.25rem',        // 20px
      h6: '1rem',           // 16px
      h5: '1.125rem',       // 18px
      h4: '1.25rem',        // 20px
      h3: '1.5rem',         // 24px
      h2: '2rem',           // 32px
      h1: '2.5rem',         // 40px
    },
    fontFamily: {
      heading: '"Oswald", sans-serif',
      body: '"Inter", sans-serif',
      mono: '"Roboto Mono", monospace',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Border Radius (IDN-DS-001 PART 3.4)
  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',      // Standard radius
    lg: '12px',
    full: '9999px',
  },
  
  // Shadows (IDN-DS-001 PART 3.5)
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    lg: '0 10px 25px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1)',
    focus: '0 0 0 2px var(--primary-color)',
  },
  
  // Motion (IDN-DS-001 PART 3.6)
  motion: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '600ms',
    },
    easing: {
      in: 'ease-in',
      out: 'ease-out',
      inOut: 'ease-in-out',
    },
  },
  
  // Responsive Breakpoints (IDN-DS-001 PART 4.1)
  breakpoints: {
    mobile: 375,      // Small phone
    tablet: 768,      // Tablet horizontal
    desktop: 1024,    // Laptop
    wide: 1440,       // Large monitors
  },
  
  // Touch Targets (WCAG AA, IDN-DS-001 PART 3.3)
  touchTarget: {
    min: '44px',      // Minimum 44×44px
    default: '48px',
  },
};

// =============================================================================
// THEME CONTEXT
// =============================================================================

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: 'light' | 'dark';
  tokens: typeof DESIGN_TOKENS;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =============================================================================
// THEME PROVIDER COMPONENT
// =============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'system',
  storageKey = 'theme-mode',
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Get saved preference
    const saved = localStorage.getItem(storageKey) as ThemeMode | null;
    if (saved) {
      setMode(saved);
    }

    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkModePreference = saved === 'dark' || 
      (saved === 'system' && prefersDark) ||
      (!saved && prefersDark);

    setResolvedMode(darkModePreference ? 'dark' : 'light');
    
    // Apply to DOM
    const html = document.documentElement;
    if (darkModePreference) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    setIsMounted(true);
  }, [storageKey]);

  // Listen for system preference changes
  useEffect(() => {
    if (!isMounted || mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? 'dark' : 'light';
      setResolvedMode(newMode);
      
      const html = document.documentElement;
      if (e.matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, isMounted]);

  // Update theme when mode changes
  const updateMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem(storageKey, newMode);

    // Resolve the actual mode
    if (newMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedMode(prefersDark ? 'dark' : 'light');
    } else {
      setResolvedMode(newMode);
    }

    // Apply to DOM
    const html = document.documentElement;
    if (newMode === 'dark' || (newMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode: updateMode, resolvedMode, tokens: DESIGN_TOKENS }}>
      {children}
    </ThemeContext.Provider>
  );
};

// =============================================================================
// THEME HOOK
// =============================================================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// =============================================================================
// DESIGN TOKENS EXPORT
// =============================================================================

export default DESIGN_TOKENS;
