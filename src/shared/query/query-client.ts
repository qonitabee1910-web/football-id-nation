/**
 * IDN-INFRA-001: TANSTACK QUERY INFRASTRUCTURE
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Query Architecture)
 * - IDN-API-001 (Query Patterns)
 * 
 * PURPOSE:
 * Centralized server state management via TanStack Query.
 * Every feature module queries/mutations built on this foundation.
 * 
 * RESPONSIBILITIES:
 * - Query client configuration
 * - Query key factory (type-safe query keys)
 * - Default query options
 * - Default mutation options
 * - Cache invalidation strategy
 * - Prefetch utilities
 * - Infinite query helpers
 * - Optimistic update patterns
 * 
 * NO BUSINESS QUERIES - This is infrastructure and patterns only.
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

import { QueryClient, DefaultOptions, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { APIError } from './client';

// =========================================================================
// QUERY CLIENT CONFIGURATION
// =========================================================================

/**
 * Default query options for all queries in the app
 */
const defaultQueryOptions: DefaultOptions['queries'] = {
  // Retry on network errors and 5xx server errors
  retry: (failureCount, error: any) => {
    if (error instanceof APIError) {
      // Don't retry on 4xx errors (except 408, 429)
      if (error.status >= 400 && error.status < 500) {
        if (![408, 429].includes(error.status)) {
          return false;
        }
      }
    }
    // Retry up to 3 times
    return failureCount < 3;
  },

  // Retry after exponential backoff
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

  // Cache data for 5 minutes by default
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes

  // Refetch on window focus
  refetchOnWindowFocus: true,
  refetchOnReconnect: 'stale',
  refetchOnMount: 'stale',
};

/**
 * Default mutation options for all mutations in the app
 */
const defaultMutationOptions: DefaultOptions['mutations'] = {
  // Don't retry mutations by default (they have side effects)
  retry: 0,
};

/**
 * Create and configure QueryClient
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: defaultQueryOptions,
      mutations: defaultMutationOptions,
    },
  });
}

/**
 * Singleton QueryClient instance
 */
export const queryClient = createQueryClient();

// =========================================================================
// QUERY KEY FACTORY (Type-Safe Query Keys)
// =========================================================================

/**
 * Factory pattern for creating type-safe query keys.
 * 
 * Every feature module creates its own query key factory.
 * This ensures type safety and prevents key collisions.
 * 
 * USAGE EXAMPLE:
 * 
 * // In features/identity/queries/query-keys.ts
 * export const identityKeys = {
 *   all: ['identity'] as const,
 *   lists: () => [...identityKeys.all, 'list'] as const,
 *   list: (filters) => [...identityKeys.lists(), filters] as const,
 *   details: () => [...identityKeys.all, 'detail'] as const,
 *   detail: (id) => [...identityKeys.details(), id] as const,
 * };
 * 
 * // Usage in queries
 * useQuery({
 *   queryKey: identityKeys.detail(playerId),
 *   queryFn: () => getPlayer(playerId),
 * });
 */

export const createQueryKeyFactory = <T extends string>(baseKey: T) => {
  return {
    all: [baseKey] as const,
    lists: () => [baseKey, 'list'] as const,
    list: (filters: any = {}) => [baseKey, 'list', filters] as const,
    details: () => [baseKey, 'detail'] as const,
    detail: (id: string | number) => [baseKey, 'detail', id] as const,
    infinite: () => [baseKey, 'infinite'] as const,
    search: (query: string) => [baseKey, 'search', query] as const,
  };
};

// =========================================================================
// QUERY OPTIONS FACTORY
// =========================================================================

/**
 * Create typed query options with sensible defaults
 */
export function createQueryOptions<TData, TError = APIError>(
  options: UseQueryOptions<TData, TError>
): UseQueryOptions<TData, TError> {
  return {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: 2,
    ...options,
  };
}

// =========================================================================
// MUTATION OPTIONS FACTORY
// =========================================================================

/**
 * Create typed mutation options with sensible defaults
 */
export function createMutationOptions<TData, TError = APIError, TVariables = void>(
  options: UseMutationOptions<TData, TError, TVariables>
): UseMutationOptions<TData, TError, TVariables> {
  return {
    retry: 0, // Don't retry mutations
    ...options,
  };
}

// =========================================================================
// CACHE INVALIDATION PATTERNS
// =========================================================================

/**
 * Invalidate query by key
 */
export async function invalidateQuery(queryKey: any[]): Promise<void> {
  await queryClient.invalidateQueries({ queryKey });
}

/**
 * Invalidate all queries with prefix
 */
export async function invalidateQueryByPrefix(prefix: string): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: [prefix] });
}

/**
 * Invalidate all queries in cache
 */
export async function invalidateAllQueries(): Promise<void> {
  await queryClient.invalidateQueries();
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<void> {
  queryClient.clear();
}

// =========================================================================
// PREFETCH PATTERNS
// =========================================================================

/**
 * Prefetch query before navigation
 */
export async function prefetchQuery<TData>(
  queryKey: any[],
  queryFn: () => Promise<TData>
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Prefetch infinite query
 */
export async function prefetchInfiniteQuery<TData>(
  queryKey: any[],
  queryFn: (pageParam: number) => Promise<TData[]>
): Promise<void> {
  await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => queryFn(pageParam),
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}

// =========================================================================
// OPTIMISTIC UPDATE PATTERN
// =========================================================================

/**
 * Perform optimistic update pattern:
 * 1. Update cache before request
 * 2. Send request
 * 3. Update cache with actual data on success
 * 4. Rollback cache on error
 * 
 * USAGE:
 * 
 * const { mutate } = useMutation({
 *   mutationFn: updatePlayer,
 *   onMutate: async (newData) => {
 *     // Cancel pending queries
 *     await queryClient.cancelQueries({ queryKey: playerKeys.detail(id) });
 * 
 *     // Get previous data
 *     const previousData = queryClient.getQueryData(playerKeys.detail(id));
 * 
 *     // Update cache optimistically
 *     queryClient.setQueryData(playerKeys.detail(id), newData);
 * 
 *     // Return rollback function
 *     return { previousData };
 *   },
 *   onError: (err, newData, context) => {
 *     // Rollback on error
 *     if (context?.previousData) {
 *       queryClient.setQueryData(playerKeys.detail(id), context.previousData);
 *     }
 *   },
 *   onSuccess: (data) => {
 *     // Update cache with actual data
 *     queryClient.setQueryData(playerKeys.detail(id), data);
 *   },
 * });
 */

export interface OptimisticUpdateContext<T> {
  previousData?: T;
}

/**
 * Helper for optimistic updates
 */
export async function optimisticUpdate<T>(
  queryKey: any[],
  newData: T
): Promise<OptimisticUpdateContext<T>> {
  // Cancel pending queries
  await queryClient.cancelQueries({ queryKey });

  // Get and save previous data
  const previousData = queryClient.getQueryData<T>(queryKey);

  // Update cache optimistically
  queryClient.setQueryData(queryKey, newData);

  return { previousData };
}

/**
 * Rollback optimistic update on error
 */
export function rollbackOptimisticUpdate<T>(
  queryKey: any[],
  context: OptimisticUpdateContext<T>
): void {
  if (context.previousData) {
    queryClient.setQueryData(queryKey, context.previousData);
  }
}

// =========================================================================
// INFINITE QUERY PATTERN
// =========================================================================

/**
 * Helper for infinite queries
 * 
 * USAGE:
 * 
 * const query = useInfiniteQuery({
 *   queryKey: playerKeys.infinite(),
 *   queryFn: ({ pageParam }) => fetchPlayers(pageParam),
 *   initialPageParam: 0,
 *   getNextPageParam: createInfinitePageParam(10), // 10 items per page
 * });
 */

export function createInfinitePageParam(pageSize: number) {
  return (lastPage: any[], allPages: any[][]) => {
    // Stop if less items returned than page size
    if (lastPage.length < pageSize) {
      return undefined;
    }
    // Return next page number
    return allPages.length;
  };
}

// =========================================================================
// BATCH QUERY HELPERS
// =========================================================================

/**
 * Set multiple cache entries
 */
export function setQueriesData<T>(
  updates: Array<{ queryKey: any[]; data: T }>
): void {
  updates.forEach(({ queryKey, data }) => {
    queryClient.setQueryData(queryKey, data);
  });
}

/**
 * Get multiple cache entries
 */
export function getQueriesData<T>(queryKeys: any[][]): (T | undefined)[] {
  return queryKeys.map((queryKey) => queryClient.getQueryData<T>(queryKey));
}

/**
 * Invalidate multiple queries
 */
export async function invalidateQueries(queryKeys: any[][]): Promise<void> {
  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey })
    )
  );
}

// =========================================================================
// CACHE INSPECTION (DEBUG)
// =========================================================================

/**
 * Get all cached queries (for debugging)
 */
export function getAllCachedQueries(): any[] {
  const cache = queryClient.getQueryCache();
  return cache.getAll();
}

/**
 * Clear cache for debugging
 */
export function clearCacheForDebugging(): void {
  queryClient.clear();
}

/**
 * Log all cache entries (for debugging)
 */
export function logCacheEntries(): void {
  const entries = getAllCachedQueries();
  console.log('[Query Cache]', entries.map((query) => ({
    key: query.queryKey,
    state: query.state,
  })));
}

// =========================================================================
// ERROR HANDLING
// =========================================================================

/**
 * Handle query error globally
 */
queryClient.setDefaultOptions({
  queries: {
    retry: (failureCount, error: any) => {
      // Log error
      if (process.env.NODE_ENV === 'development') {
        console.error('[Query Error]', error);
      }

      // Apply retry logic
      if (error instanceof APIError) {
        if (error.status >= 400 && error.status < 500) {
          if (![408, 429].includes(error.status)) {
            return false;
          }
        }
      }

      return failureCount < 3;
    },
  },
});

// =========================================================================
// EXPORTS
// =========================================================================

export {
  queryClient,
  createQueryClient,
  createQueryKeyFactory,
  createQueryOptions,
  createMutationOptions,
};

export type { OptimisticUpdateContext };
