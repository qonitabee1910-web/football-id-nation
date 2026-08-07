/**
 * IDN-UI-GEN-001: ROOT APP COMPONENT
 * 
 * Derives from:
 * - IDN-DS-001 (Design System Integration)
 * - EPOS-CORE-DOC-001 (Application Architecture)
 * 
 * Implements:
 * - Provider composition (Theme, Query, Error Boundary, Notifications)
 * - Global application state
 * - Root layout structure
 * - Accessibility setup
 */

import React from 'react';
import { ThemeProvider } from '~/components/providers/ThemeProvider';
import { NotificationCenter, NotificationContext } from '~/components/notifications/NotificationCenter';
import { ErrorBoundary } from '~/components/boundaries/ErrorBoundary';
import { useNotification } from '~/hooks/useCustom';

// =============================================================================
// NOTIFICATION PROVIDER
// =============================================================================

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notificationState = useNotification();

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
      <NotificationCenter
        notifications={notificationState.notifications}
        onClose={notificationState.dismiss}
        position="top-right"
      />
    </NotificationContext.Provider>
  );
};

// =============================================================================
// ROOT PROVIDERS COMPOSITION
// =============================================================================

interface RootProvidersProps {
  children: React.ReactNode;
}

export const RootProviders: React.FC<RootProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultMode="system">
        <NotificationProvider>
          {/* 
            TODO: Add additional providers as needed:
            - TanStack Query Provider (React Query)
            - Auth Provider (Session management)
            - Analytics Provider
            - Feature Flag Provider
          */}
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// =============================================================================
// ROOT APP COMPONENT
// =============================================================================

interface AppProps {
  children: React.ReactNode;
}

export const App: React.FC<AppProps> = ({ children }) => {
  return (
    <RootProviders>
      {children}
    </RootProviders>
  );
};

export default App;
