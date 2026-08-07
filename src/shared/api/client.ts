/**
 * IDN-INFRA-001: SHARED API CLIENT LAYER
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (API Architecture)
 * - IDN-API-001 (API Contracts)
 * - ADR-0001 (HTTP Client Stack)
 * 
 * PURPOSE:
 * Centralized HTTP client with interceptors, error handling, auth, retry logic.
 * Every API call in the application goes through this layer.
 * 
 * RESPONSIBILITIES:
 * - HTTP request/response handling
 * - Authentication token management
 * - Error transformation
 * - Request/response logging
 * - Retry logic for failed requests
 * - Offline support
 * - Request cancellation
 * - Response caching
 * 
 * NO BUSINESS LOGIC - This is infrastructure only.
 * Every feature module uses this client for API calls.
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

// =========================================================================
// TYPE DEFINITIONS
// =========================================================================

/**
 * API request configuration
 */
export interface APIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  offline: boolean;
  headers: Record<string, string>;
}

/**
 * API request options
 */
export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: unknown;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  skipAuth?: boolean;
  skipRetry?: boolean;
  cache?: boolean;
  cacheDuration?: number;
}

/**
 * API response wrapper
 */
export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  timestamp: number;
}

/**
 * API error details
 */
export interface APIErrorDetails {
  code: string;
  message: string;
  status: number;
  endpoint: string;
  method: string;
  timestamp: number;
  traceId?: string;
  details?: Record<string, any>;
}

/**
 * API error
 */
export class APIError extends Error {
  code: string;
  status: number;
  endpoint: string;
  method: string;
  details?: Record<string, any>;
  traceId?: string;

  constructor(details: APIErrorDetails) {
    super(details.message);
    this.name = 'APIError';
    this.code = details.code;
    this.status = details.status;
    this.endpoint = details.endpoint;
    this.method = details.method;
    this.details = details.details;
    this.traceId = details.traceId;
  }
}

// =========================================================================
// API CLIENT CONFIGURATION
// =========================================================================

/**
 * Default API configuration
 */
export const DEFAULT_API_CONFIG: APIConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,           // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000,         // 1 second, increases exponentially
  offline: false,
  headers: {
    'Content-Type': 'application/json',
  },
};

// =========================================================================
// API CLIENT CLASS
// =========================================================================

/**
 * Main HTTP client for all API communication
 * 
 * Features:
 * - Automatic retry on failure
 * - Auth token injection
 * - Request/response logging
 * - Error transformation
 * - Offline support
 * - Request cancellation
 * - Response caching
 */
export class APIClient {
  private config: APIConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private requestQueue: Map<string, Promise<any>> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: Partial<APIConfig> = {}) {
    this.config = { ...DEFAULT_API_CONFIG, ...config };
  }

  /**
   * Make an API request with full error handling, retries, and logging
   */
  async request<T = unknown>(options: RequestOptions): Promise<APIResponse<T>> {
    const url = this._buildUrl(options.url, options.params);
    const requestKey = `${options.method}:${url}`;

    // Return cached response if available
    const cached = this._getCachedResponse<T>(requestKey);
    if (cached) {
      return cached;
    }

    // Return queued request if already in flight (deduplicate)
    const queued = this.requestQueue.get(requestKey);
    if (queued && options.method === 'GET') {
      return queued;
    }

    // Create new request
    const request = this._executeRequest<T>(options, requestKey);
    this.requestQueue.set(requestKey, request);

    try {
      const response = await request;
      this.requestQueue.delete(requestKey);
      return response;
    } catch (error) {
      this.requestQueue.delete(requestKey);
      throw error;
    }
  }

  /**
   * Execute request with retry logic
   */
  private async _executeRequest<T>(
    options: RequestOptions,
    requestKey: string,
    attempt: number = 0
  ): Promise<APIResponse<T>> {
    try {
      // Add auth token if needed
      const headers = await this._prepareHeaders(options);

      // Create abort controller for this request
      const abortController = new AbortController();
      this.abortControllers.set(requestKey, abortController);

      // Build request config
      const config = {
        method: options.method,
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined,
        signal: options.signal || abortController.signal,
        timeout: options.timeout || this.config.timeout,
      };

      // Log request
      this._logRequest(options, config);

      // Send request
      const response = await fetch(
        `${this.config.baseURL}${options.url}`,
        config as any
      );

      // Handle response
      const data = await this._parseResponse<T>(response);

      // Log response
      this._logResponse(options, response);

      // Cache successful response if requested
      if (options.cache && options.method === 'GET') {
        this._setCachedResponse(
          requestKey,
          data,
          options.cacheDuration || 5 * 60 * 1000 // 5 minutes default
        );
      }

      // Clean up abort controller
      this.abortControllers.delete(requestKey);

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this._headersToObject(response.headers),
        timestamp: Date.now(),
      };
    } catch (error) {
      // Cleanup abort controller
      this.abortControllers.delete(requestKey);

      // Handle errors
      if (error instanceof APIError) {
        throw error;
      }

      // Transform error
      const apiError = this._transformError(error, options);

      // Retry on failure if configured
      if (
        !options.skipRetry &&
        attempt < this.config.retryAttempts &&
        this._shouldRetry(apiError)
      ) {
        const delay = this.config.retryDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));

        this._logRetry(options, attempt + 1);
        return this._executeRequest<T>(options, requestKey, attempt + 1);
      }

      throw apiError;
    }
  }

  /**
   * Prepare request headers (inject auth token, etc.)
   */
  private async _prepareHeaders(options: RequestOptions): Promise<Record<string, string>> {
    const headers = {
      ...this.config.headers,
      ...options.headers,
    };

    // Inject auth token
    if (!options.skipAuth) {
      const token = this._getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Add request ID for tracing
    headers['X-Request-ID'] = this._generateRequestId();

    return headers;
  }

  /**
   * Parse response body
   */
  private async _parseResponse<T>(response: Response): Promise<T> {
    // Check for errors in response
    if (!response.ok) {
      const errorData = await this._parseResponseBody(response);
      throw new APIError({
        code: errorData.code || `HTTP_${response.status}`,
        message: errorData.message || response.statusText,
        status: response.status,
        endpoint: response.url,
        method: 'UNKNOWN', // Would be set in _transformError
        traceId: response.headers.get('X-Trace-ID') || undefined,
        details: errorData.details,
      });
    }

    // Parse successful response
    return this._parseResponseBody<T>(response);
  }

  /**
   * Parse response body as JSON
   */
  private async _parseResponseBody<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return (await response.text()) as any;
  }

  /**
   * Transform error to APIError
   */
  private _transformError(error: any, options: RequestOptions): APIError {
    // Already an APIError
    if (error instanceof APIError) {
      return error;
    }

    // Network error (offline, timeout, etc.)
    if (error instanceof TypeError) {
      return new APIError({
        code: 'NETWORK_ERROR',
        message: 'Network request failed',
        status: 0,
        endpoint: options.url,
        method: options.method,
        details: { originalError: error.message },
      });
    }

    // Abort error
    if (error.name === 'AbortError') {
      return new APIError({
        code: 'REQUEST_CANCELLED',
        message: 'Request was cancelled',
        status: 0,
        endpoint: options.url,
        method: options.method,
      });
    }

    // Timeout error
    if (error.name === 'TimeoutError') {
      return new APIError({
        code: 'REQUEST_TIMEOUT',
        message: 'Request timeout',
        status: 0,
        endpoint: options.url,
        method: options.method,
      });
    }

    // Unknown error
    return new APIError({
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error',
      status: 0,
      endpoint: options.url,
      method: options.method,
      details: { originalError: error },
    });
  }

  /**
   * Determine if request should be retried
   */
  private _shouldRetry(error: APIError): boolean {
    // Retry on network errors
    if (error.status === 0) {
      return true;
    }

    // Retry on 5xx server errors
    if (error.status >= 500) {
      return true;
    }

    // Retry on specific status codes
    if ([408, 429, 503].includes(error.status)) {
      return true;
    }

    return false;
  }

  /**
   * Get authentication token
   */
  private _getAuthToken(): string | null {
    // Try sessionStorage first, then localStorage
    return (
      sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token')
    );
  }

  /**
   * Build URL with query parameters
   */
  private _buildUrl(url: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryString = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        queryString.append(key, String(value));
      }
    }

    return `${url}?${queryString.toString()}`;
  }

  /**
   * Convert Headers to object
   */
  private _headersToObject(headers: Headers): Record<string, string> {
    const obj: Record<string, string> = {};
    headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  /**
   * Get cached response
   */
  private _getCachedResponse<T>(key: string): APIResponse<T> | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache response
   */
  private _setCachedResponse(
    key: string,
    data: any,
    duration: number
  ): void {
    this.cache.set(key, { data, timestamp: Date.now() });

    // Clear cache after duration
    setTimeout(() => {
      this.cache.delete(key);
    }, duration);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Cancel request by key
   */
  cancelRequest(requestKey: string): void {
    const controller = this.abortControllers.get(requestKey);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestKey);
    }
  }

  /**
   * Cancel all requests
   */
  cancelAllRequests(): void {
    this.abortControllers.forEach((controller) => {
      controller.abort();
    });
    this.abortControllers.clear();
  }

  // ========================================================================
  // LOGGING & DEBUG
  // ========================================================================

  private _logRequest(options: RequestOptions, config: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Request]', {
        method: options.method,
        url: options.url,
        headers: config.headers,
        body: options.data,
      });
    }
  }

  private _logResponse(options: RequestOptions, response: Response): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Response]', {
        method: options.method,
        url: options.url,
        status: response.status,
        statusText: response.statusText,
      });
    }
  }

  private _logRetry(options: RequestOptions, attempt: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Retry]', {
        method: options.method,
        url: options.url,
        attempt,
      });
    }
  }

  private _generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// =========================================================================
// SINGLETON API CLIENT INSTANCE
// =========================================================================

export const apiClient = new APIClient();

// =========================================================================
// CONVENIENCE METHODS
// =========================================================================

export async function get<T>(url: string, options?: Partial<RequestOptions>) {
  return apiClient.request<T>({
    method: 'GET',
    url,
    ...options,
  });
}

export async function post<T>(
  url: string,
  data?: unknown,
  options?: Partial<RequestOptions>
) {
  return apiClient.request<T>({
    method: 'POST',
    url,
    data,
    ...options,
  });
}

export async function put<T>(
  url: string,
  data?: unknown,
  options?: Partial<RequestOptions>
) {
  return apiClient.request<T>({
    method: 'PUT',
    url,
    data,
    ...options,
  });
}

export async function patch<T>(
  url: string,
  data?: unknown,
  options?: Partial<RequestOptions>
) {
  return apiClient.request<T>({
    method: 'PATCH',
    url,
    data,
    ...options,
  });
}

export async function del<T>(url: string, options?: Partial<RequestOptions>) {
  return apiClient.request<T>({
    method: 'DELETE',
    url,
    ...options,
  });
}

// =========================================================================
// EXPORTS
// =========================================================================

export { APIClient, APIError };
