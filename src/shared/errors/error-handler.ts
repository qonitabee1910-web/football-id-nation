/**
 * IDN-INFRA-001: ERROR ARCHITECTURE
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Error Handling)
 * - IDN-DS-001 (Error State Styling)
 * - Sprint 0 (Error Boundaries)
 * - STK-INV-004 (Child Protection)
 * 
 * PURPOSE:
 * Centralized error handling, classification, and transformation.
 * All errors in the app classified and handled consistently.
 * 
 * ERROR TYPES:
 * - ValidationError (form validation)
 * - APIError (HTTP errors)
 * - AuthorizationError (permission denied)
 * - NotFoundError (resource not found)
 * - NetworkError (connectivity)
 * - OfflineError (no internet)
 * - TimeoutError (request timeout)
 * - ConflictError (concurrent modification)
 * - BusinessError (business rule violation)
 * - UnknownError (catch-all)
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import { AxiosError } from 'axios';
import { ZodError } from 'zod';

// =========================================================================
// ERROR CLASSIFICATION
// =========================================================================

export enum ErrorType {
  // Validation errors
  VALIDATION = 'VALIDATION',

  // API errors
  API = 'API',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  OFFLINE = 'OFFLINE',

  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Business errors
  BUSINESS = 'BUSINESS',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Unknown
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// =========================================================================
// BASE ERROR CLASS
// =========================================================================

export class AppError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  code: string;
  details?: Record<string, any>;
  originalError?: Error;
  userMessage: string;
  timestamp: number;

  constructor(options: {
    type: ErrorType;
    code: string;
    message: string;
    userMessage?: string;
    severity?: ErrorSeverity;
    details?: Record<string, any>;
    originalError?: Error;
  }) {
    super(options.message);
    this.name = 'AppError';
    this.type = options.type;
    this.code = options.code;
    this.severity = options.severity || ErrorSeverity.ERROR;
    this.details = options.details;
    this.originalError = options.originalError;
    this.userMessage = options.userMessage || this._getDefaultUserMessage(options.type);
    this.timestamp = Date.now();
  }

  private _getDefaultUserMessage(type: ErrorType): string {
    const messages: Record<ErrorType, string> = {
      [ErrorType.VALIDATION]: 'Please check your input and try again',
      [ErrorType.API]: 'Something went wrong with the request',
      [ErrorType.NETWORK]: 'Network connection error',
      [ErrorType.TIMEOUT]: 'Request took too long',
      [ErrorType.OFFLINE]: 'You are offline',
      [ErrorType.UNAUTHORIZED]: 'Please log in again',
      [ErrorType.FORBIDDEN]: 'You don\'t have permission',
      [ErrorType.NOT_FOUND]: 'Resource not found',
      [ErrorType.CONFLICT]: 'This resource was modified by someone else',
      [ErrorType.BUSINESS]: 'Operation not allowed',
      [ErrorType.CONSTRAINT_VIOLATION]: 'This resource is already in use',
      [ErrorType.INTERNAL_SERVER_ERROR]: 'Server error',
      [ErrorType.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred',
    };
    return messages[type];
  }

  toJSON() {
    return {
      type: this.type,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

// =========================================================================
// SPECIFIC ERROR TYPES
// =========================================================================

export class ValidationError extends AppError {
  fields: Map<string, string>;

  constructor(options: {
    message?: string;
    fields?: Map<string, string>;
    details?: Record<string, any>;
  }) {
    super({
      type: ErrorType.VALIDATION,
      code: 'VALIDATION_ERROR',
      message: options.message || 'Validation failed',
      severity: ErrorSeverity.WARNING,
      details: options.details,
    });
    this.name = 'ValidationError';
    this.fields = options.fields || new Map();
  }
}

export class APIError extends AppError {
  status: number;
  endpoint: string;
  method: string;

  constructor(options: {
    status: number;
    endpoint: string;
    method: string;
    message?: string;
    code?: string;
    details?: Record<string, any>;
  }) {
    super({
      type: ErrorType.API,
      code: options.code || `HTTP_${options.status}`,
      message: options.message || `HTTP ${options.status}`,
      severity: options.status >= 500 ? ErrorSeverity.CRITICAL : ErrorSeverity.ERROR,
      details: options.details,
    });
    this.name = 'APIError';
    this.status = options.status;
    this.endpoint = options.endpoint;
    this.method = options.method;
  }
}

export class AuthorizationError extends AppError {
  requiredRoles?: string[];
  requiredPermissions?: string[];

  constructor(options: {
    message?: string;
    type: 'UNAUTHORIZED' | 'FORBIDDEN';
    requiredRoles?: string[];
    requiredPermissions?: string[];
  }) {
    super({
      type: options.type === 'UNAUTHORIZED' ? ErrorType.UNAUTHORIZED : ErrorType.FORBIDDEN,
      code: options.type,
      message: options.message || (
        options.type === 'UNAUTHORIZED'
          ? 'Authentication required'
          : 'Access denied'
      ),
      severity: ErrorSeverity.WARNING,
    });
    this.name = 'AuthorizationError';
    this.requiredRoles = options.requiredRoles;
    this.requiredPermissions = options.requiredPermissions;
  }
}

export class NotFoundError extends AppError {
  resourceType: string;
  resourceId?: string | number;

  constructor(options: {
    resourceType: string;
    resourceId?: string | number;
    message?: string;
  }) {
    super({
      type: ErrorType.NOT_FOUND,
      code: 'NOT_FOUND',
      message: options.message || `${options.resourceType} not found`,
      severity: ErrorSeverity.WARNING,
    });
    this.name = 'NotFoundError';
    this.resourceType = options.resourceType;
    this.resourceId = options.resourceId;
  }
}

export class NetworkError extends AppError {
  isOffline: boolean;

  constructor(options: { isOffline?: boolean; message?: string } = {}) {
    super({
      type: options.isOffline ? ErrorType.OFFLINE : ErrorType.NETWORK,
      code: options.isOffline ? 'OFFLINE' : 'NETWORK_ERROR',
      message: options.message || (
        options.isOffline
          ? 'No internet connection'
          : 'Network error'
      ),
      severity: ErrorSeverity.WARNING,
    });
    this.name = 'NetworkError';
    this.isOffline = options.isOffline || false;
  }
}

export class TimeoutError extends AppError {
  constructor(options: { message?: string } = {}) {
    super({
      type: ErrorType.TIMEOUT,
      code: 'REQUEST_TIMEOUT',
      message: options.message || 'Request timed out',
      severity: ErrorSeverity.WARNING,
    });
    this.name = 'TimeoutError';
  }
}

export class ConflictError extends AppError {
  constructor(options: { message?: string; details?: Record<string, any> } = {}) {
    super({
      type: ErrorType.CONFLICT,
      code: 'CONFLICT',
      message: options.message || 'Resource conflict',
      severity: ErrorSeverity.WARNING,
      details: options.details,
    });
    this.name = 'ConflictError';
  }
}

export class BusinessError extends AppError {
  constructor(options: {
    code: string;
    message: string;
    details?: Record<string, any>;
  }) {
    super({
      type: ErrorType.BUSINESS,
      code: options.code,
      message: options.message,
      severity: ErrorSeverity.WARNING,
      details: options.details,
    });
    this.name = 'BusinessError';
  }
}

// =========================================================================
// ERROR TRANSFORMATION
// =========================================================================

/**
 * Transform various error types to AppError
 */
export function transformError(error: any): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Zod validation error
  if (error instanceof ZodError) {
    const fields = new Map<string, string>();
    error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      fields.set(field, issue.message);
    });
    return new ValidationError({ fields });
  }

  // Axios error
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 0;

    if (status === 401) {
      return new AuthorizationError({
        type: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    if (status === 403) {
      return new AuthorizationError({
        type: 'FORBIDDEN',
        message: 'Access denied',
      });
    }

    if (status === 404) {
      return new NotFoundError({
        resourceType: 'Resource',
      });
    }

    if (status === 409) {
      return new ConflictError({
        message: 'Resource conflict',
      });
    }

    if (status >= 500) {
      return new APIError({
        status,
        endpoint: axiosError.config?.url || '',
        method: (axiosError.config?.method || 'UNKNOWN').toUpperCase(),
        message: 'Server error',
      });
    }

    return new APIError({
      status,
      endpoint: axiosError.config?.url || '',
      method: (axiosError.config?.method || 'UNKNOWN').toUpperCase(),
    });
  }

  // Network error
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new NetworkError({ isOffline: !navigator.onLine });
  }

  // Timeout error
  if (error instanceof Error && error.message === 'Timeout') {
    return new TimeoutError();
  }

  // Generic error
  if (error instanceof Error) {
    return new AppError({
      type: ErrorType.UNKNOWN,
      code: 'UNKNOWN_ERROR',
      message: error.message,
      originalError: error,
    });
  }

  // Unknown error
  return new AppError({
    type: ErrorType.UNKNOWN,
    code: 'UNKNOWN_ERROR',
    message: String(error),
  });
}

// =========================================================================
// ERROR HANDLER
// =========================================================================

export class ErrorHandler {
  private listeners: Array<(error: AppError) => void> = [];

  /**
   * Register error listener (e.g., for logging, analytics)
   */
  onError(listener: (error: AppError) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Handle error
   */
  handle(error: any): AppError {
    const appError = transformError(error);

    // Notify listeners (logging, analytics, etc.)
    this.listeners.forEach((listener) => {
      try {
        listener(appError);
      } catch (err) {
        console.error('Error handler listener failed:', err);
      }
    });

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[AppError]', appError.toJSON());
    }

    return appError;
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners = [];
  }
}

export const errorHandler = new ErrorHandler();

// =========================================================================
// ERROR DISPLAY HELPERS
// =========================================================================

/**
 * Get user-friendly error message (for UI display)
 */
export function getUserErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.userMessage;
  }

  const appError = transformError(error);
  return appError.userMessage;
}

/**
 * Get error details for display
 */
export interface ErrorDisplay {
  title: string;
  message: string;
  details?: string;
  actionLabel?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export function getErrorDisplay(error: any): ErrorDisplay {
  const appError = error instanceof AppError ? error : transformError(error);

  return {
    title: this._getErrorTitle(appError.type),
    message: appError.userMessage,
    details: process.env.NODE_ENV === 'development' ? appError.message : undefined,
    severity: appError.severity,
    actionLabel: this._getActionLabel(appError.type),
  };
}

function _getErrorTitle(type: ErrorType): string {
  const titles: Record<ErrorType, string> = {
    [ErrorType.VALIDATION]: 'Validation Error',
    [ErrorType.API]: 'Request Failed',
    [ErrorType.NETWORK]: 'Network Error',
    [ErrorType.TIMEOUT]: 'Request Timeout',
    [ErrorType.OFFLINE]: 'Offline',
    [ErrorType.UNAUTHORIZED]: 'Login Required',
    [ErrorType.FORBIDDEN]: 'Access Denied',
    [ErrorType.NOT_FOUND]: 'Not Found',
    [ErrorType.CONFLICT]: 'Conflict',
    [ErrorType.BUSINESS]: 'Operation Not Allowed',
    [ErrorType.CONSTRAINT_VIOLATION]: 'Resource In Use',
    [ErrorType.INTERNAL_SERVER_ERROR]: 'Server Error',
    [ErrorType.SERVICE_UNAVAILABLE]: 'Service Unavailable',
    [ErrorType.UNKNOWN]: 'Error',
  };
  return titles[type];
}

function _getActionLabel(type: ErrorType): string | undefined {
  switch (type) {
    case ErrorType.UNAUTHORIZED:
      return 'Login';
    case ErrorType.FORBIDDEN:
      return 'Go Home';
    case ErrorType.NOT_FOUND:
      return 'Go Home';
    case ErrorType.OFFLINE:
      return 'Retry';
    case ErrorType.TIMEOUT:
      return 'Retry';
    case ErrorType.NETWORK:
      return 'Retry';
    default:
      return undefined;
  }
}

// =========================================================================
// EXPORTS
// =========================================================================

export {
  AppError,
  ValidationError,
  APIError,
  AuthorizationError,
  NotFoundError,
  NetworkError,
  TimeoutError,
  ConflictError,
  BusinessError,
};

export { ErrorHandler, errorHandler };
export type { ErrorDisplay };
