/**
 * IDN-INFRA-001: LOGGING & OBSERVABILITY ARCHITECTURE
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Observability Strategy)
 * - STK-INV-004 (Child Protection Audit Logging)
 * 
 * PURPOSE:
 * Centralized logging, audit trails, and telemetry.
 * Every action logged for debugging, analytics, and compliance.
 * 
 * LOGGING LEVELS (Hierarchical):
 * - DEBUG: Detailed diagnostic information (development only)
 * - INFO: General informational messages
 * - WARN: Warning messages (recoverable issues)
 * - ERROR: Error messages (failures)
 * - CRITICAL: Critical failures (app health at risk)
 * 
 * LOG TYPES:
 * - APPLICATION: General app logs
 * - USER: User action logs
 * - AUDIT: Compliance/audit trail logs
 * - SECURITY: Security-related logs
 * - ERROR: Error tracking
 * - PERFORMANCE: Performance metrics
 * - ANALYTICS: User analytics
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import { config } from './environment';

// =========================================================================
// LOGGING TYPES
// =========================================================================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export enum LogType {
  APPLICATION = 'APPLICATION',
  USER = 'USER',
  AUDIT = 'AUDIT',
  SECURITY = 'SECURITY',
  ERROR = 'ERROR',
  PERFORMANCE = 'PERFORMANCE',
  ANALYTICS = 'ANALYTICS',
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  type: LogType;
  category: string;
  message: string;
  data?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  traceId?: string;
  stackTrace?: string;
  source: {
    file?: string;
    function?: string;
    line?: number;
  };
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  traceId?: string;
  correlationId?: string;
}

// =========================================================================
// LOGGER CLASS
// =========================================================================

/**
 * Main logger service for the application
 */
export class Logger {
  private name: string;
  private context: LogContext = {};
  private listeners: Array<(entry: LogEntry) => void> = [];
  private minLevel: LogLevel;

  constructor(name: string, minLevel: LogLevel = LogLevel.INFO) {
    this.name = name;
    this.minLevel = minLevel;
  }

  /**
   * Set logging context (userId, sessionId, etc.)
   */
  setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Get current context
   */
  getContext(): LogContext {
    return { ...this.context };
  }

  /**
   * Clear context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Subscribe to log entries
   */
  onLog(listener: (entry: LogEntry) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // ========================================================================
  // LOGGING METHODS
  // ========================================================================

  debug(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.DEBUG, LogType.APPLICATION, message, data);
  }

  info(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.INFO, LogType.APPLICATION, message, data);
  }

  warn(message: string, data?: Record<string, any>): void {
    this._log(LogLevel.WARN, LogType.APPLICATION, message, data);
  }

  error(message: string, error?: Error | Record<string, any>): void {
    const data: Record<string, any> = {};

    if (error instanceof Error) {
      data.errorMessage = error.message;
      data.errorName = error.name;
      data.stackTrace = error.stack;
    } else if (typeof error === 'object') {
      Object.assign(data, error);
    }

    this._log(LogLevel.ERROR, LogType.ERROR, message, data);
  }

  critical(message: string, error?: Error | Record<string, any>): void {
    const data: Record<string, any> = {};

    if (error instanceof Error) {
      data.errorMessage = error.message;
      data.errorName = error.name;
      data.stackTrace = error.stack;
    } else if (typeof error === 'object') {
      Object.assign(data, error);
    }

    this._log(LogLevel.CRITICAL, LogType.ERROR, message, data);
  }

  /**
   * Log user action (for analytics)
   */
  logUserAction(action: string, details?: Record<string, any>): void {
    this._log(LogLevel.INFO, LogType.USER, action, details);
  }

  /**
   * Log security event (for compliance)
   */
  logSecurityEvent(event: string, details?: Record<string, any>): void {
    this._log(LogLevel.WARN, LogType.SECURITY, event, details);
  }

  /**
   * Log audit event (for compliance trail)
   */
  logAuditEvent(
    action: string,
    resource: string,
    details?: Record<string, any>
  ): void {
    this._log(LogLevel.INFO, LogType.AUDIT, `${action}:${resource}`, details);
  }

  /**
   * Log performance metric
   */
  logPerformance(metric: string, duration: number, details?: Record<string, any>): void {
    this._log(LogLevel.DEBUG, LogType.PERFORMANCE, metric, {
      duration,
      ...details,
    });
  }

  /**
   * Log API request
   */
  logApiRequest(
    method: string,
    endpoint: string,
    details?: Record<string, any>
  ): void {
    this.debug(`API Request: ${method} ${endpoint}`, details);
  }

  /**
   * Log API response
   */
  logApiResponse(
    method: string,
    endpoint: string,
    status: number,
    duration: number
  ): void {
    this.debug(`API Response: ${method} ${endpoint} ${status}`, { duration });
  }

  /**
   * Log API error
   */
  logApiError(
    method: string,
    endpoint: string,
    status: number,
    error: any
  ): void {
    this.error(`API Error: ${method} ${endpoint} ${status}`, error);
  }

  /**
   * Measure performance of a function
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.logPerformance(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${name} failed after ${duration}ms`, error as Error);
      throw error;
    }
  }

  /**
   * Create child logger with name suffix
   */
  child(name: string): Logger {
    const childLogger = new Logger(`${this.name}:${name}`, this.minLevel);
    childLogger.setContext(this.context);
    return childLogger;
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  private _log(
    level: LogLevel,
    type: LogType,
    message: string,
    data?: Record<string, any>
  ): void {
    // Check minimum level
    if (level < this.minLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      type,
      category: this.name,
      message,
      data,
      userId: this.context.userId,
      sessionId: this.context.sessionId,
      traceId: this.context.traceId,
      source: {
        file: this._getSourceFile(),
        function: this._getSourceFunction(),
      },
    };

    // Log to console (in development)
    if (config.isDev && config.VITE_LOG_TO_CONSOLE) {
      this._logToConsole(entry);
    }

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (error) {
        console.error('Logger listener error:', error);
      }
    });
  }

  private _logToConsole(entry: LogEntry): void {
    const style = this._getConsoleStyle(entry.level);
    const prefix = `[${this.name}]`;

    const logFn = {
      [LogLevel.DEBUG]: console.debug,
      [LogLevel.INFO]: console.info,
      [LogLevel.WARN]: console.warn,
      [LogLevel.ERROR]: console.error,
      [LogLevel.CRITICAL]: console.error,
    }[entry.level];

    logFn(`%c${prefix}`, style, entry.message);

    if (entry.data && Object.keys(entry.data).length > 0) {
      console.log(entry.data);
    }
  }

  private _getConsoleStyle(level: LogLevel): string {
    const styles = {
      [LogLevel.DEBUG]: 'color: #999; font-size: 0.9em;',
      [LogLevel.INFO]: 'color: #0066cc; font-weight: bold;',
      [LogLevel.WARN]: 'color: #ff9900; font-weight: bold;',
      [LogLevel.ERROR]: 'color: #cc0000; font-weight: bold;',
      [LogLevel.CRITICAL]: 'color: #cc0000; font-weight: bold; background: #ffcccc;',
    };
    return styles[level] || '';
  }

  private _getSourceFile(): string | undefined {
    if (typeof document === 'undefined') {
      return undefined;
    }

    try {
      const stack = new Error().stack;
      const lines = stack?.split('\n') || [];
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('.ts') || line.includes('.tsx')) {
          return line.trim();
        }
      }
    } catch {
      // Ignore stack parsing errors
    }

    return undefined;
  }

  private _getSourceFunction(): string | undefined {
    try {
      const stack = new Error().stack;
      const lines = stack?.split('\n') || [];
      return lines[2]?.trim();
    } catch {
      return undefined;
    }
  }
}

// =========================================================================
// GLOBAL LOGGER INSTANCE
// =========================================================================

/**
 * Global root logger
 */
export const logger = new Logger(
  'App',
  config.isDev ? LogLevel.DEBUG : LogLevel.INFO
);

/**
 * Create logger for a module/feature
 */
export function createLogger(name: string): Logger {
  return logger.child(name);
}

// =========================================================================
// LOG STORAGE
// =========================================================================

/**
 * In-memory log storage
 */
export class LogStorage {
  private logs: LogEntry[] = [];
  private maxSize: number;
  private filters: {
    minLevel?: LogLevel;
    types?: LogType[];
  } = {};

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Store log entry
   */
  store(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxSize) {
      this.logs = this.logs.slice(-this.maxSize);
    }
  }

  /**
   * Set filters
   */
  setFilters(filters: LogStorage['filters']): void {
    this.filters = filters;
  }

  /**
   * Get filtered logs
   */
  getLogs(): LogEntry[] {
    return this.logs.filter((log) => {
      if (this.filters.minLevel !== undefined && log.level < this.filters.minLevel) {
        return false;
      }

      if (this.filters.types && !this.filters.types.includes(log.type)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get logs since timestamp
   */
  getLogsSince(timestamp: number): LogEntry[] {
    return this.getLogs().filter((log) => log.timestamp >= timestamp);
  }

  /**
   * Export logs as JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }

  /**
   * Export logs as CSV
   */
  exportCSV(): string {
    const logs = this.getLogs();
    if (logs.length === 0) {
      return 'No logs';
    }

    const headers = ['timestamp', 'level', 'type', 'category', 'message'];
    const rows = logs.map((log) => [
      log.timestamp,
      LogLevel[log.level],
      log.type,
      log.category,
      log.message,
    ]);

    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }
}

/**
 * Global log storage
 */
export const logStorage = new LogStorage();

// Initialize log storage listener
logger.onLog((entry) => {
  logStorage.store(entry);
});

// =========================================================================
// ERROR BOUNDARY LOGGING
// =========================================================================

/**
 * Log uncaught errors globally
 */
export function setupGlobalErrorLogging(): void {
  window.addEventListener('error', (event) => {
    logger.critical('Uncaught Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.critical('Unhandled Promise Rejection', {
      reason: event.reason,
    });
  });
}

// =========================================================================
// EXPORTS
// =========================================================================

export {
  Logger,
  logger,
  createLogger,
  LogLevel,
  LogType,
  LogStorage,
  logStorage,
  setupGlobalErrorLogging,
};

export type { LogEntry, LogContext };
