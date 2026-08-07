/**
 * IDN-INFRA-001: ROUTE MANIFEST
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Routing Architecture)
 * - IDN-SCR-001 (Screen Catalogue)
 * - IDN-JNY-001 (User Journeys)
 * 
 * PURPOSE:
 * Central registry of all routes in the application.
 * Single source of truth for navigation structure.
 * Enables validation, documentation, and deep linking.
 * 
 * EVERY ROUTE IN THE APPLICATION MUST BE REGISTERED HERE.
 * NO UNDOCUMENTED ROUTES ALLOWED.
 * 
 * USAGE:
 * - Deep linking with RouteRegistry.getRoute(routeId)
 * - Breadcrumb generation from routeHierarchy
 * - Permission validation per route
 * - Screen catalogue mapping
 * - Journey traceability
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

// =========================================================================
// ROUTE DEFINITION TYPE
// =========================================================================

/**
 * Complete route definition with metadata
 */
export interface RouteDefinition {
  /**
   * Unique route identifier
   * Format: {context}.{feature}.{page}
   * Examples:
   * - app.auth.login
   * - app.auth.register
   * - app.identity.player-profile
   * - app.identity.players-list
   * - app.organization.teams-list
   */
  id: string;

  /**
   * URL path
   * Examples: /login, /identity/players/:playerId
   */
  path: string;

  /**
   * Human-readable label for UI (breadcrumbs, etc.)
   */
  label: string;

  /**
   * Screen type from IDN-SCR-001
   * Examples: AUTHENTICATION, DASHBOARD, LISTING, DETAIL, FORM, ERROR
   */
  screenType: ScreenType;

  /**
   * Bounded context this route belongs to
   */
  boundedContext?: string;

  /**
   * Feature module this route belongs to
   */
  feature: string;

  /**
   * Parent route ID (for breadcrumb hierarchy)
   */
  parentId?: string;

  /**
   * Required roles to access this route
   * Empty = public route
   */
  requiredRoles?: string[];

  /**
   * Required permissions to access this route
   */
  requiredPermissions?: string[];

  /**
   * User journey this route is part of
   * Examples: REGISTRATION, PLAYER_VERIFICATION, TEAM_MANAGEMENT
   */
  journeys?: string[];

  /**
   * Child routes (nested routes)
   */
  children?: RouteDefinition[];

  /**
   * Whether this route requires authentication
   */
  requiresAuth?: boolean;

  /**
   * Layout type for this route
   * Options: PUBLIC, AUTHENTICATED, DASHBOARD, EMPTY, ERROR, MAINTENANCE, FORBIDDEN
   */
  layout?: LayoutType;

  /**
   * Navigation visibility
   * - PUBLIC: Show in all navigation
   * - AUTHENTICATED: Show only when authenticated
   * - HIDDEN: Don't show in navigation (but still accessible)
   */
  visibility?: 'PUBLIC' | 'AUTHENTICATED' | 'HIDDEN';

  /**
   * Icon name for navigation
   */
  icon?: string;

  /**
   * Order in navigation (for sibling routes)
   */
  order?: number;

  /**
   * Link to screen in IDN-SCR-001
   * Format: IDN-SCR-001/SCREENS/{ScreenName}
   */
  screenCatalogue?: string;

  /**
   * Link to ADR or artefact
   */
  traceability?: {
    prd?: string;       // IDN-PRD-001/...
    journey?: string;   // IDN-JNY-001/...
    design?: string;    // IDN-DS-001/...
    api?: string;       // IDN-API-001/...
    screen?: string;    // IDN-SCR-001/...
    adr?: string;       // ADR-XXXX
  };

  /**
   * Description of this route
   */
  description?: string;

  /**
   * Query parameters this route accepts
   */
  queryParams?: Record<string, ParamDefinition>;

  /**
   * Path parameters (extracted from path)
   */
  pathParams?: Record<string, ParamDefinition>;
}

export type ScreenType =
  | 'AUTHENTICATION'
  | 'DASHBOARD'
  | 'LISTING'
  | 'DETAIL'
  | 'FORM'
  | 'ERROR'
  | 'EMPTY'
  | 'MAINTENANCE'
  | 'FORBIDDEN'
  | 'ONBOARDING'
  | 'SETTINGS'
  | 'PROFILE';

export type LayoutType =
  | 'PUBLIC'
  | 'AUTHENTICATED'
  | 'DASHBOARD'
  | 'EMPTY'
  | 'ERROR'
  | 'MAINTENANCE'
  | 'FORBIDDEN';

export interface ParamDefinition {
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  description?: string;
}

// =========================================================================
// ROUTE REGISTRY
// =========================================================================

/**
 * Central registry of all routes in the application.
 * Built on startup, provides route lookup and validation.
 */
export class RouteRegistry {
  private routes: Map<string, RouteDefinition> = new Map();
  private pathToId: Map<string, string> = new Map();
  private hierarchy: Map<string, string[]> = new Map(); // parentId → childIds

  /**
   * Register a route
   */
  register(route: RouteDefinition): void {
    if (this.routes.has(route.id)) {
      console.warn(`Route '${route.id}' already registered, overwriting...`);
    }

    this.routes.set(route.id, route);
    this.pathToId.set(route.path, route.id);

    // Track hierarchy
    if (route.parentId) {
      if (!this.hierarchy.has(route.parentId)) {
        this.hierarchy.set(route.parentId, []);
      }
      this.hierarchy.get(route.parentId)!.push(route.id);
    }

    // Register children
    if (route.children) {
      route.children.forEach((child) => this.register(child));
    }
  }

  /**
   * Get route by ID
   */
  getRouteById(id: string): RouteDefinition | undefined {
    return this.routes.get(id);
  }

  /**
   * Get route by path
   */
  getRouteByPath(path: string): RouteDefinition | undefined {
    const id = this.pathToId.get(path);
    return id ? this.routes.get(id) : undefined;
  }

  /**
   * Get all routes
   */
  getAllRoutes(): RouteDefinition[] {
    return Array.from(this.routes.values());
  }

  /**
   * Get routes by feature
   */
  getRoutesByFeature(feature: string): RouteDefinition[] {
    return this.getAllRoutes().filter((route) => route.feature === feature);
  }

  /**
   * Get routes by bounded context
   */
  getRoutesByContext(context: string): RouteDefinition[] {
    return this.getAllRoutes().filter((route) => route.boundedContext === context);
  }

  /**
   * Get child routes
   */
  getChildRoutes(parentId: string): RouteDefinition[] {
    const childIds = this.hierarchy.get(parentId) || [];
    return childIds
      .map((id) => this.routes.get(id))
      .filter(Boolean) as RouteDefinition[];
  }

  /**
   * Get breadcrumb path to route
   */
  getBreadcrumb(routeId: string): RouteDefinition[] {
    const breadcrumb: RouteDefinition[] = [];
    let current = this.routes.get(routeId);

    while (current) {
      breadcrumb.unshift(current);
      current = current.parentId ? this.routes.get(current.parentId) : undefined;
    }

    return breadcrumb;
  }

  /**
   * Check if user can access route
   */
  canAccess(routeId: string, userRoles: string[]): boolean {
    const route = this.routes.get(routeId);
    if (!route) {
      return false;
    }

    // Public route
    if (!route.requiredRoles || route.requiredRoles.length === 0) {
      return true;
    }

    // Check if user has any required role
    return route.requiredRoles.some((role) => userRoles.includes(role));
  }

  /**
   * Get navigation-visible routes
   */
  getNavigationRoutes(
    userRoles?: string[]
  ): RouteDefinition[] {
    return this.getAllRoutes()
      .filter((route) => route.visibility !== 'HIDDEN')
      .filter((route) => !route.parentId) // Top-level only
      .filter((route) => {
        if (!userRoles) {
          return route.visibility === 'PUBLIC';
        }
        return this.canAccess(route.id, userRoles);
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * List all routes (for debugging/documentation)
   */
  list(): Array<{ id: string; path: string; label: string }> {
    return this.getAllRoutes().map((route) => ({
      id: route.id,
      path: route.path,
      label: route.label,
    }));
  }

  /**
   * Clear registry
   */
  clear(): void {
    this.routes.clear();
    this.pathToId.clear();
    this.hierarchy.clear();
  }

  /**
   * Export registry as JSON (for documentation)
   */
  export(): string {
    return JSON.stringify(
      this.getAllRoutes().map((route) => ({
        id: route.id,
        path: route.path,
        label: route.label,
        feature: route.feature,
        boundedContext: route.boundedContext,
        requiredRoles: route.requiredRoles,
        screenType: route.screenType,
      })),
      null,
      2
    );
  }
}

export const routeRegistry = new RouteRegistry();

// =========================================================================
// ROUTE DEFINITION BUILDER (TYPE-SAFE)
// =========================================================================

/**
 * Builder for creating route definitions with type safety
 */
export class RouteBuilder {
  private route: RouteDefinition;

  constructor(id: string, path: string, label: string, feature: string) {
    this.route = {
      id,
      path,
      label,
      feature,
      screenType: 'DASHBOARD',
      visibility: 'PUBLIC',
    };
  }

  screenType(type: ScreenType): this {
    this.route.screenType = type;
    return this;
  }

  boundedContext(context: string): this {
    this.route.boundedContext = context;
    return this;
  }

  parentId(parentId: string): this {
    this.route.parentId = parentId;
    return this;
  }

  requiredRoles(...roles: string[]): this {
    this.route.requiredRoles = roles;
    this.route.requiresAuth = true;
    return this;
  }

  requiresAuth(required: boolean = true): this {
    this.route.requiresAuth = required;
    return this;
  }

  journeys(...journeys: string[]): this {
    this.route.journeys = journeys;
    return this;
  }

  layout(layout: LayoutType): this {
    this.route.layout = layout;
    return this;
  }

  visibility(vis: 'PUBLIC' | 'AUTHENTICATED' | 'HIDDEN'): this {
    this.route.visibility = vis;
    return this;
  }

  icon(icon: string): this {
    this.route.icon = icon;
    return this;
  }

  order(order: number): this {
    this.route.order = order;
    return this;
  }

  description(desc: string): this {
    this.route.description = desc;
    return this;
  }

  traceability(trace: RouteDefinition['traceability']): this {
    this.route.traceability = trace;
    return this;
  }

  build(): RouteDefinition {
    return this.route;
  }
}

// =========================================================================
// SAMPLE ROUTES (DOCUMENTATION ONLY - IMPLEMENTATION IN FEATURES)
// =========================================================================

/**
 * EXAMPLE ROUTES TO REGISTER:
 * 
 * Authentication Flow:
 * - app.auth.login (public)
 * - app.auth.register (public)
 * - app.auth.forgot-password (public)
 * - app.auth.verify-email (public)
 * 
 * Identity Bounded Context:
 * - app.identity.dashboard (authenticated, player)
 * - app.identity.player-profile (authenticated, player)
 * - app.identity.players-list (authenticated, admin)
 * - app.identity.player-detail (authenticated)
 * - app.identity.verification (authenticated, guardian)
 * 
 * Organization Bounded Context:
 * - app.organization.teams-list (authenticated)
 * - app.organization.team-detail (authenticated)
 * - app.organization.team-members (authenticated)
 * - app.organization.team-settings (authenticated, admin)
 * 
 * Error Routes:
 * - app.error.not-found (404)
 * - app.error.forbidden (403)
 * - app.error.server-error (500)
 * - app.error.maintenance (maintenance mode)
 */

// =========================================================================
// EXPORTS
// =========================================================================

export {
  RouteRegistry,
  routeRegistry,
  RouteBuilder,
};

export type {
  RouteDefinition,
  ScreenType,
  LayoutType,
  ParamDefinition,
};
