/**
 * IDN-DS-001: DESIGN TOKENS & CONSTANTS
 * 
 * Derives from:
 * - IDN-DS-001 (Design System)
 * - EPOS-CORE-DOC-001 (Constants standards)
 * 
 * Implements:
 * - Color palette
 * - Typography scale
 * - Spacing system
 * - Breakpoints
 * - Component sizes
 */

// =============================================================================
// COLORS (IDN-DS-001 PART 3.1)
// =============================================================================

export const COLORS = {
  // Primary (Navy Blue)
  primary: {
    navy: '#0F172A',
    navy_50: '#F8FAFC',
    navy_100: '#F1F5F9',
    navy_200: '#E2E8F0',
    navy_300: '#CBD5E1',
    navy_400: '#94A3B8',
    navy_500: '#64748B',
    navy_600: '#475569',
    navy_700: '#334155',
    navy_800: '#1E293B',
    navy_900: '#0F172A',
  },

  // Secondary (Football Green)
  secondary: {
    green: '#15803D',
    green_50: '#F0FDF4',
    green_100: '#DCFCE7',
    green_200: '#BBF7D0',
    green_300: '#86EFAC',
    green_400: '#4ADE80',
    green_500: '#22C55E',
    green_600: '#16A34A',
    green_700: '#15803D',
    green_800: '#166534',
    green_900: '#145231',
  },

  // Semantic Colors
  semantic: {
    success: '#16A34A',    // Green
    warning: '#FBBF24',    // Amber
    danger: '#DC2626',     // Red
    error: '#DC2626',
    info: '#3B82F6',       // Blue
  },

  // Neutral
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    light: '#F8FAFC',
    surface: '#F1F5F9',
    border: '#CBD5E1',
    secondary: '#64748B',
    tertiary: '#1E293B',
    disabled: '#E2E8F0',
  },
};

// =============================================================================
// TYPOGRAPHY (IDN-DS-001 PART 3.2)
// =============================================================================

export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    heading: 'Oswald, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Roboto Mono, monospace',
  },

  // Font Sizes
  fontSize: {
    tiny: '0.75rem',       // 12px
    small: '0.875rem',     // 14px
    base: '1rem',          // 16px
    lg: '1.125rem',        // 18px
    xl: '1.25rem',         // 20px
    h6: '1rem',            // 16px
    h5: '1.125rem',        // 18px
    h4: '1.25rem',         // 20px
    h3: '1.5rem',          // 24px
    h2: '2rem',            // 32px
    h1: '2.5rem',          // 40px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.02em',
  },
};

// =============================================================================
// SPACING (IDN-DS-001 PART 3.3)
// =============================================================================

export const SPACING = {
  // 8-point grid system
  0: '0px',
  1: '0.5rem',    // 8px (xs)
  2: '1rem',      // 16px (sm)
  3: '1.5rem',    // 24px (md)
  4: '2rem',      // 32px (lg)
  5: '2.5rem',    // 40px (xl)
  6: '3rem',      // 48px (2xl)
  7: '3.5rem',    // 56px (3xl)
  8: '4rem',      // 64px (4xl)
  10: '5rem',     // 80px
  12: '6rem',     // 96px
  16: '8rem',     // 128px
  20: '10rem',    // 160px
  24: '12rem',    // 192px
};

// =============================================================================
// BORDER RADIUS (IDN-DS-001 PART 3.4)
// =============================================================================

export const BORDER_RADIUS = {
  none: '0px',
  sm: '4px',
  md: '8px',      // Standard radius
  lg: '12px',
  full: '9999px',
};

// =============================================================================
// SHADOWS (IDN-DS-001 PART 3.5)
// =============================================================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  md: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
  lg: '0 10px 25px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)',
  xl: '0 15px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.12)',
  focus: '0 0 0 3px rgba(59, 130, 246, 0.5)',
};

// =============================================================================
// MOTION (IDN-DS-001 PART 3.6)
// =============================================================================

export const MOTION = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '600ms',
  },

  // Easing
  easing: {
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
    linear: 'linear',
  },
};

// =============================================================================
// BREAKPOINTS (IDN-DS-001 PART 4.1)
// =============================================================================

export const BREAKPOINTS = {
  mobile: 375,       // Small phone
  mobileL: 425,      // Larger phone
  tablet: 768,       // Tablet horizontal
  laptop: 1024,      // Laptop
  desktop: 1440,     // Large monitors
  wide: 1920,        // Ultra-wide
};

// =============================================================================
// TOUCH TARGETS (WCAG AA, IDN-DS-001 PART 3.3)
// =============================================================================

export const TOUCH_TARGET = {
  min: '44px',       // Minimum 44×44px
  default: '48px',
  large: '56px',
};

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  popover: 40,
  modal: 50,
  tooltip: 60,
  notification: 70,
};

// =============================================================================
// PAGINATION & LIMITS
// =============================================================================

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxPageSize: 100,
};

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const VALIDATION = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  email: {
    maxLength: 254,
  },
  username: {
    minLength: 3,
    maxLength: 32,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  phone: {
    minLength: 10,
    maxLength: 15,
  },
};

// =============================================================================
// HTTP & API CONSTANTS
// =============================================================================

export const HTTP = {
  statusCodes: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  timeout: 30000,  // 30 seconds
};

// =============================================================================
// ANIMATION KEYFRAMES
// =============================================================================

export const ANIMATIONS = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideInFromTop: {
    from: { transform: 'translateY(-100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInFromRight: {
    from: { transform: 'translateX(100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInFromBottom: {
    from: { transform: 'translateY(100%)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInFromLeft: {
    from: { transform: 'translateX(-100%)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
};

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

export const LAYOUT = {
  headerHeight: '64px',      // 4rem
  sidebarWidth: '256px',     // 16rem
  maxContentWidth: '1280px',
  mobileBottomNavHeight: '64px',
};

// =============================================================================
// COMMON MESSAGES
// =============================================================================

export const MESSAGES = {
  loading: 'Loading...',
  error: 'Something went wrong',
  success: 'Operation successful',
  confirm: 'Are you sure?',
  delete: 'This action cannot be undone',
  noData: 'No data available',
  noResults: 'No results found',
  tryAgain: 'Try again',
};
