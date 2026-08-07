/**
 * IDN-UI-GEN-001: ERROR BOUNDARY & LOADING BOUNDARY
 * 
 * Derives from:
 * - IDN-SCR-DETAILS-001 (Error States)
 * - IDN-DS-001 (Error state styling)
 * - EPOS-CORE-DOC-001 (Error handling standards)
 * 
 * Implements:
 * - Global error catching
 * - Error state UI display
 * - Loading state UI display
 * - Child protection on error (no data leakage)
 */

import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import type { ApiErrorResponse } from '~/types';

// =============================================================================
// ERROR BOUNDARY (IDN-SCR-DETAILS-001: Error States)
// =============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to monitoring service (non-sensitive only)
    console.error('Error caught by boundary:', {
      message: error.message,
      // Do NOT log stack trace (child protection)
      timestamp: new Date().toISOString(),
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error when resetKeys change (IDN-SCR-DETAILS-001)
    const keysChanged = this.props.resetKeys?.some(
      (key, i) => key !== prevProps.resetKeys?.[i]
    );

    if (keysChanged) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

// =============================================================================
// DEFAULT ERROR FALLBACK (IDN-SCR-DETAILS-001: SCR-SYS-01 Error Screen)
// =============================================================================

interface ErrorFallbackProps {
  error: Error;
  onReset: () => void;
  action?: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset, action }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light dark:bg-neutral-900 px-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 p-8">
          {/* Error Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <AlertCircle className="h-8 w-8 text-danger" aria-hidden="true" />
          </div>

          {/* Error Message */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              We encountered an unexpected error. Please try again or return to the home page.
            </p>
          </div>

          {/* Error Code (for debugging, non-sensitive) */}
          <div className="w-full bg-neutral-50 dark:bg-neutral-800 rounded-md p-3">
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate">
              {error.message || 'Unknown error'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <Button
              variant="secondary"
              onClick={onReset}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>

          {/* Child Protection: Do not expose technical details */}
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Your data is safe. Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </Card>
    </div>
  );
};

// =============================================================================
// ROUTE ERROR BOUNDARY
// =============================================================================

export interface RouteErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ error, reset }) => {
  return <DefaultErrorFallback error={error} onReset={reset} />;
};

// =============================================================================
// LOADING BOUNDARY (IDN-SCR-DETAILS-001: Loading States)
// =============================================================================

interface LoadingBoundaryProps {
  isLoading: boolean;
  children: ReactNode;
  loadingFallback?: ReactNode;
  error?: ApiErrorResponse | null;
  errorFallback?: (error: ApiErrorResponse) => ReactNode;
}

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  isLoading,
  children,
  loadingFallback,
  error,
  errorFallback,
}) => {
  // Show error state if present (IDN-SCR-DETAILS-001)
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light dark:bg-neutral-900 px-4">
        {errorFallback ? (
          errorFallback(error)
        ) : (
          <Card className="w-full max-w-md">
            <div className="flex flex-col items-center gap-6 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
                <AlertCircle className="h-8 w-8 text-danger" aria-hidden="true" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {error.message}
                </h1>
                {error.code && (
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                    Error: {error.code}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Show loading state if requested
  if (isLoading) {
    return (
      loadingFallback || (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      )
    );
  }

  return <>{children}</>;
};

// =============================================================================
// LOADING SPINNER (IDN-DS-001: Loading State)
// =============================================================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClasses[size]} animate-spin text-primary-navy`}>
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {label && (
        <p
          className="text-sm text-neutral-600 dark:text-neutral-400"
          role="status"
          aria-label={label}
        >
          {label}
        </p>
      )}
    </div>
  );
};

// =============================================================================
// SKELETON LOADER (IDN-DS-001: Loading State)
// =============================================================================

interface SkeletonProps {
  variant?: 'text' | 'rounded' | 'circular';
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = '1.5rem',
  className = '',
}) => {
  const variantClasses = {
    text: 'rounded-sm',
    rounded: 'rounded-md',
    circular: 'rounded-full',
  };

  return (
    <div
      className={`
        animate-pulse
        bg-neutral-200 dark:bg-neutral-700
        ${variantClasses[variant]}
        ${className}
      `}
      style={{ width, height }}
      aria-busy="true"
      aria-label="Loading"
    />
  );
};

// =============================================================================
// SKELETON SCREEN LOADERS
// =============================================================================

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <Skeleton height="1.5rem" width="40%" className="mb-3" />
        <Skeleton height="1rem" width="100%" className="mb-2" />
        <Skeleton height="1rem" width="80%" />
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} height="1.5rem" width={`${100 / columns}%`} />
        ))}
      </div>
    ))}
  </div>
);

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i}>
        <Skeleton height="1rem" width="25%" className="mb-2" />
        <Skeleton height="2.75rem" width="100%" />
      </div>
    ))}
    <Skeleton height="2.75rem" width="30%" />
  </div>
);
