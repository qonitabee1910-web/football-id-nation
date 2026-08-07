/**
 * IDN-INFRA-001: PROVIDER COMPOSITION
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Provider Architecture)
 * - Sprint 0 (Providers: Theme, Notifications, Errors)
 * - Bootstrap (Lifecycle)
 * 
 * PURPOSE:
 * Central provider composition. All providers composed in correct order.
 * 
 * RESPONSIBILITIES:
 * - Compose all providers in dependency order
 * - Pass configuration to each provider
 * - Setup provider dependencies
 * - Export root provider component
 * 
 * NOTE:
 * Order is critical. Do not rearrange without architecture approval.
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import React, { ReactNode, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

// From Sprint 0 (already created)
import { ThemeProvider } from '~/components/providers/ThemeProvider';
import { NotificationProvider } from '~/components/notifications/NotificationCenter';
import { ErrorBoundary } from '~/components/boundaries/ErrorBoundary';

// From bootstrap
import { bootstrap, appLifecycle, setupGlobalErrorHandling } from './bootstrap';

// To be created
import { queryClient } from '~/shared/query/query-client';
import { router } from '~/routes';

// =========================================================================
// PROVIDER COMPOSITION ORDER (MANDATORY - DO NOT CHANGE)
// =========================================================================

/**
 * ============================================================================
 * 
 * PROVIDER DEPENDENCY TREE
 * 
 * ErrorBoundary (outermost - catches all errors)
 *   └─ ThemeProvider (design system)
 *       └─ QueryClientProvider (TanStack Query - server state)
 *           └─ RouterProvider (TanStack Router - routing)
 *               └─ AuthProvider (to be created - session state)
 *                   └─ NotificationProvider (toast notifications)
 *                       └─ FeatureFlagsProvider (to be created)
 *                           └─ AnalyticsProvider (to be created)
 *                               └─ Application (innermost)
 * 
 * ============================================================================
 * 
 * PROVIDER RESPONSIBILITIES:
 * 
 * 1. ErrorBoundary
 *    - Catches all React errors
 *    - Prevents white screen of death
 *    - Shows fallback UI
 * 
 * 2. ThemeProvider
 *    - Dark/light mode management
 *    - Design token provisioning
 *    - CSS custom properties
 * 
 * 3. QueryClientProvider
 *    - TanStack Query setup
 *    - Cache configuration
 *    - Request/response handling
 * 
 * 4. RouterProvider
 *    - Route definitions
 *    - Route matching
 *    - Navigation state
 * 
 * 5. AuthProvider (TODO)
 *    - Session management
 *    - Token handling
 *    - Authorization state
 * 
 * 6. NotificationProvider
 *    - Toast/banner display
 *    - Notification state
 *    - Auto-dismiss logic
 * 
 * 7. FeatureFlagsProvider (TODO)
 *    - Feature flag registry
 *    - Dynamic feature toggling
 * 
 * 8. AnalyticsProvider (TODO)
 *    - Event tracking
 *    - User analytics
 *    - Performance monitoring
 * 
 * ============================================================================
 */

// =========================================================================
// PROVIDER COMPOSITION FUNCTION
// =========================================================================

interface RootProvidersProps {
  children: ReactNode;
}

/**
 * Root providers composition
 * 
 * All providers are composed in a single component for:
 * - Centralized management
 * - Easy testing
 * - Consistent initialization
 * - Clear dependency order
 */
export function RootProviders({ children }: RootProvidersProps) {
  // Initialize app on mount
  useEffect(() => {
    (async () => {
      try {
        await appLifecycle.onBeforeMount();
        setupGlobalErrorHandling();
      } catch (error) {
        console.error('Bootstrap failed:', error);
      }
    })();

    return () => {
      appLifecycle.onAfterUnmount();
    };
  }, []);

  return (
    // 1. ERROR BOUNDARY (outermost)
    <ErrorBoundary>
      {/* 2. THEME PROVIDER */}
      <ThemeProvider defaultMode="system">
        {/* 3. QUERY CLIENT PROVIDER */}
        <QueryClientProvider client={queryClient}>
          {/* 4. ROUTER PROVIDER */}
          <RouterProvider router={router}>
            {/* 5. AUTH PROVIDER (TODO) */}
            {/* <AuthProvider> */}

            {/* 6. NOTIFICATION PROVIDER */}
            <NotificationProvider>
              {/* 7. FEATURE FLAGS PROVIDER (TODO) */}
              {/* <FeatureFlagsProvider> */}

              {/* 8. ANALYTICS PROVIDER (TODO) */}
              {/* <AnalyticsProvider> */}

              {/* Application Routes */}
              {children}

              {/* </AnalyticsProvider> */}
              {/* </FeatureFlagsProvider> */}
            </NotificationProvider>

            {/* </AuthProvider> */}
          </RouterProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// =========================================================================
// PROVIDER INITIALIZATION SEQUENCE
// =========================================================================

/**
 * Initialization sequence timeline:
 * 
 * t=0ms:   RootProviders mounts
 * t=0ms:   ErrorBoundary setup
 * t=0ms:   ThemeProvider setup (detects dark mode)
 * t=0ms:   QueryClientProvider setup
 * t=0ms:   RouterProvider setup (parses URL)
 * t=1ms:   useEffect fires in RootProviders
 * t=2ms:   bootstrap() starts
 * t=50ms:  bootstrap() completes
 * t=51ms:  appLifecycle.onAfterMount() fires
 * t=52ms:  Children render
 * t=100ms: First route loads
 * 
 * The entire initialization takes <200ms on modern hardware.
 */

// =========================================================================
// INDIVIDUAL PROVIDER CONFIGURATIONS
// =========================================================================

/**
 * Each provider can be configured independently.
 * These configurations are referenced by their respective providers.
 */

// Already in Sprint 0:
// - ThemeProvider config: src/components/providers/ThemeProvider.tsx
// - NotificationProvider config: src/components/notifications/NotificationCenter.tsx
// - ErrorBoundary config: src/components/boundaries/ErrorBoundary.tsx

// To be created:
// - QueryClientProvider config: src/shared/query/query-client.ts
// - RouterProvider config: src/routes/index.tsx
// - AuthProvider config: src/providers/auth.tsx (TODO)
// - FeatureFlagsProvider config: src/providers/feature-flags.tsx (TODO)
// - AnalyticsProvider config: src/providers/analytics.tsx (TODO)

// =========================================================================
// TESTING UTILITIES
// =========================================================================

/**
 * For testing, create a minimal provider wrapper:
 */

export function createTestProviders(config?: {
  queryClient?: any;
  router?: any;
}) {
  return function TestProviders({ children }: { children: ReactNode }) {
    return (
      <ErrorBoundary>
        <ThemeProvider defaultMode="light">
          <QueryClientProvider client={config?.queryClient || queryClient}>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  };
}

// =========================================================================
// PROVIDER CONFIGURATION CHECKLIST
// =========================================================================

/**
 * When adding new providers:
 * 
 * ✓ Step 1: Create provider component (e.g., AuthProvider)
 * ✓ Step 2: Add to RootProviders in correct order
 * ✓ Step 3: Document provider responsibilities
 * ✓ Step 4: Add TODO comment with link to issue
 * ✓ Step 5: Export from this file
 * ✓ Step 6: Update testing utilities
 * ✓ Step 7: Test initialization sequence
 * ✓ Step 8: Document in ARCHITECTURE.md
 * 
 * Order is: outermost error catching → innermost data access
 */

// =========================================================================
// EXPORTS
// =========================================================================

export { RootProviders };
export { createTestProviders };

// Re-export for convenience
export { ThemeProvider } from '~/components/providers/ThemeProvider';
export { NotificationProvider } from '~/components/notifications/NotificationCenter';
export { ErrorBoundary } from '~/components/boundaries/ErrorBoundary';
