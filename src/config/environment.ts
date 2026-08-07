/**
 * IDN-INFRA-001: CONFIGURATION & ENVIRONMENT LAYER
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Configuration Management)
 * - ADR-0001 (Environment Strategy)
 * - Lovable Cloud (Backend Configuration)
 * 
 * PURPOSE:
 * Centralized application configuration and environment management.
 * Load and validate environment variables on startup.
 * Provide typed configuration access throughout the app.
 * 
 * RESPONSIBILITIES:
 * - Load environment variables
 * - Validate configuration
 * - Type-safe config access
 * - Feature flags
 * - Build metadata
 * - Runtime environment detection
 * 
 * ENVIRONMENT VARIABLES (Required in .env files):
 * 
 * GENERAL:
 * - NODE_ENV: development|staging|production
 * - VITE_APP_NAME: Application name
 * - VITE_API_URL: Backend API URL
 * - VITE_API_TIMEOUT: API timeout in ms (default: 30000)
 * 
 * AUTHENTICATION:
 * - VITE_AUTH_ENABLED: Enable auth (default: true)
 * - VITE_AUTH_PROVIDER: auth provider type
 * 
 * FEATURES:
 * - VITE_FEATURE_*: Feature flags (e.g., VITE_FEATURE_IDENTITY_ENABLED)
 * 
 * ANALYTICS:
 * - VITE_ANALYTICS_ENABLED: Enable analytics (default: false)
 * - VITE_ANALYTICS_ID: Analytics provider ID
 * 
 * BUILD:
 * - VITE_BUILD_NUMBER: Build number
 * - VITE_BUILD_DATE: Build date
 * - VITE_GIT_COMMIT: Git commit hash
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import { z, ZodError } from 'zod';

// =========================================================================
// ENVIRONMENT VALIDATION SCHEMA
// =========================================================================

/**
 * Environment variables schema (Zod validation)
 */
const envSchema = z.object({
  // General
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_APP_NAME: z.string().default('Football ID Nation'),
  VITE_API_URL: z.string().url('Invalid API URL'),
  VITE_API_TIMEOUT: z.coerce.number().int().positive().default(30000),

  // Authentication
  VITE_AUTH_ENABLED: z.coerce.boolean().default(true),
  VITE_AUTH_PROVIDER: z.string().default('lovable'),

  // Feature Flags
  VITE_FEATURE_IDENTITY_ENABLED: z.coerce.boolean().default(true),
  VITE_FEATURE_ORGANIZATION_ENABLED: z.coerce.boolean().default(true),
  VITE_FEATURE_COMPETITION_ENABLED: z.coerce.boolean().default(true),
  VITE_FEATURE_REFEREE_ENABLED: z.coerce.boolean().default(true),
  VITE_FEATURE_FINANCE_ENABLED: z.coerce.boolean().default(false),
  VITE_FEATURE_MEDICAL_ENABLED: z.coerce.boolean().default(false),
  VITE_FEATURE_MATCH_ENABLED: z.coerce.boolean().default(true),
  VITE_FEATURE_TOURNAMENT_ENABLED: z.coerce.boolean().default(true),
  VITE_FEATURE_EDUCATION_ENABLED: z.coerce.boolean().default(false),

  // Analytics
  VITE_ANALYTICS_ENABLED: z.coerce.boolean().default(false),
  VITE_ANALYTICS_ID: z.string().optional(),

  // Logging
  VITE_LOGGING_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  VITE_LOG_TO_CONSOLE: z.coerce.boolean().default(true),

  // Build
  VITE_BUILD_NUMBER: z.string().optional(),
  VITE_BUILD_DATE: z.string().optional(),
  VITE_GIT_COMMIT: z.string().optional(),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

// =========================================================================
// APPLICATION CONFIGURATION
// =========================================================================

/**
 * Typed application configuration
 */
export interface AppConfig extends EnvironmentVariables {
  /**
   * Current environment
   */
  env: 'development' | 'staging' | 'production';

  /**
   * Is development environment
   */
  isDev: boolean;

  /**
   * Is staging environment
   */
  isStaging: boolean;

  /**
   * Is production environment
   */
  isProd: boolean;

  /**
   * Feature flags map
   */
  features: {
    identity: boolean;
    organization: boolean;
    competition: boolean;
    referee: boolean;
    finance: boolean;
    medical: boolean;
    match: boolean;
    tournament: boolean;
    education: boolean;
  };

  /**
   * Build information
   */
  build: {
    number?: string;
    date?: string;
    commit?: string;
    timestamp: number;
  };
}

// =========================================================================
// CONFIGURATION LOADER
// =========================================================================

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): AppConfig {
  try {
    const env = envSchema.parse(import.meta.env);

    const config: AppConfig = {
      ...env,
      env: env.NODE_ENV,
      isDev: env.NODE_ENV === 'development',
      isStaging: env.NODE_ENV === 'staging',
      isProd: env.NODE_ENV === 'production',

      features: {
        identity: env.VITE_FEATURE_IDENTITY_ENABLED,
        organization: env.VITE_FEATURE_ORGANIZATION_ENABLED,
        competition: env.VITE_FEATURE_COMPETITION_ENABLED,
        referee: env.VITE_FEATURE_REFEREE_ENABLED,
        finance: env.VITE_FEATURE_FINANCE_ENABLED,
        medical: env.VITE_FEATURE_MEDICAL_ENABLED,
        match: env.VITE_FEATURE_MATCH_ENABLED,
        tournament: env.VITE_FEATURE_TOURNAMENT_ENABLED,
        education: env.VITE_FEATURE_EDUCATION_ENABLED,
      },

      build: {
        number: env.VITE_BUILD_NUMBER,
        date: env.VITE_BUILD_DATE,
        commit: env.VITE_GIT_COMMIT,
        timestamp: Date.now(),
      },
    };

    return config;
  } catch (error) {
    if (error instanceof ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

// =========================================================================
// GLOBAL CONFIG INSTANCE
// =========================================================================

/**
 * Global application configuration
 * Loaded on app startup
 */
export const config = loadConfig();

// =========================================================================
// CONFIG HELPERS
// =========================================================================

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
  return config.features[feature];
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): (keyof AppConfig['features'])[] {
  return Object.entries(config.features)
    .filter(([, enabled]) => enabled)
    .map(([feature]) => feature as keyof AppConfig['features']);
}

/**
 * Get all disabled features
 */
export function getDisabledFeatures(): (keyof AppConfig['features'])[] {
  return Object.entries(config.features)
    .filter(([, enabled]) => !enabled)
    .map(([feature]) => feature as keyof AppConfig['features']);
}

// =========================================================================
// ENVIRONMENT DETECTION
// =========================================================================

/**
 * Current runtime environment
 */
export const runtime = {
  isDev: config.isDev,
  isStaging: config.isStaging,
  isProd: config.isProd,
  env: config.env,
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
};

/**
 * Browser detection
 */
export const browser = {
  isChrome: /Chrome/.test(navigator.userAgent),
  isFirefox: /Firefox/.test(navigator.userAgent),
  isSafari: /Safari/.test(navigator.userAgent),
  isEdge: /Edge/.test(navigator.userAgent),
  isMobile: /Mobile|Android|iPhone/.test(navigator.userAgent),
  isTablet: /iPad|Android/.test(navigator.userAgent),
  isDesktop: !/Mobile|Android|iPhone|iPad/.test(navigator.userAgent),
};

/**
 * Device detection
 */
export const device = {
  isMobile: browser.isMobile,
  isTablet: browser.isTablet,
  isDesktop: browser.isDesktop,
  pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  viewport: {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  },
};

// =========================================================================
// FEATURE FLAG MANAGEMENT
// =========================================================================

/**
 * Feature flag manager for runtime toggling
 */
export class FeatureFlagManager {
  private flags: Map<string, boolean> = new Map();
  private listeners: Array<(flag: string, enabled: boolean) => void> = [];

  constructor(initialFlags: Record<string, boolean> = {}) {
    Object.entries(initialFlags).forEach(([flag, enabled]) => {
      this.flags.set(flag, enabled);
    });
  }

  /**
   * Check if feature is enabled
   */
  isEnabled(flag: string): boolean {
    return this.flags.get(flag) ?? false;
  }

  /**
   * Enable feature
   */
  enable(flag: string): void {
    this.flags.set(flag, true);
    this._notify(flag, true);
  }

  /**
   * Disable feature
   */
  disable(flag: string): void {
    this.flags.set(flag, false);
    this._notify(flag, false);
  }

  /**
   * Toggle feature
   */
  toggle(flag: string): void {
    const enabled = !this.isEnabled(flag);
    this.flags.set(flag, enabled);
    this._notify(flag, enabled);
  }

  /**
   * Set multiple flags
   */
  setFlags(flags: Record<string, boolean>): void {
    Object.entries(flags).forEach(([flag, enabled]) => {
      this.flags.set(flag, enabled);
      this._notify(flag, enabled);
    });
  }

  /**
   * Get all flags
   */
  getAll(): Record<string, boolean> {
    return Object.fromEntries(this.flags);
  }

  /**
   * Subscribe to flag changes
   */
  onChange(listener: (flag: string, enabled: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private _notify(flag: string, enabled: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(flag, enabled);
      } catch (error) {
        console.error('Feature flag listener error:', error);
      }
    });
  }
}

/**
 * Global feature flag manager (initialized with config)
 */
export const featureFlagManager = new FeatureFlagManager(config.features);

// =========================================================================
// VERSION INFO
// =========================================================================

/**
 * Get version information
 */
export function getVersionInfo() {
  return {
    app: config.VITE_APP_NAME,
    buildNumber: config.build.number || 'unknown',
    buildDate: config.build.date || 'unknown',
    gitCommit: config.build.commit || 'unknown',
    buildTimestamp: config.build.timestamp,
    environment: config.env,
  };
}

/**
 * Log version info (on app startup)
 */
export function logVersionInfo(): void {
  const info = getVersionInfo();
  console.log('═══════════════════════════════════════');
  console.log(`🚀 ${info.app}`);
  console.log(`Environment: ${info.environment}`);
  console.log(`Build: ${info.buildNumber}`);
  console.log(`Date: ${info.buildDate}`);
  console.log(`Commit: ${info.gitCommit}`);
  console.log('═══════════════════════════════════════');
}

// =========================================================================
// EXPORTS
// =========================================================================

export {
  config,
  runtime,
  browser,
  device,
  featureFlagManager,
  loadConfig,
  isFeatureEnabled,
  getEnabledFeatures,
  getDisabledFeatures,
  getVersionInfo,
  logVersionInfo,
};

export type { AppConfig, EnvironmentVariables };
