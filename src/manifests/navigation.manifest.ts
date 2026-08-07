/**
 * IDN-INFRA-001: NAVIGATION MANIFEST
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Navigation Architecture)
 * - IDN-DS-001 (Navigation Components)
 * - IDN-SCR-DETAILS-001 (Screen Details)
 * 
 * PURPOSE:
 * Central registry of all navigation items in the application.
 * Manage: Sidebar, Header, Bottom Navigation, Quick Actions, Search.
 * 
 * EVERY NAVIGATION ITEM MUST BE REGISTERED HERE.
 * NO UNDOCUMENTED NAVIGATION ALLOWED.
 * 
 * USAGE:
 * - NavigationManager.getNavigation(userRoles) → filtered navigation
 * - Automatic permission-based filtering
 * - Breadcrumb generation
 * - Search indexing
 * - Badge management
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

// =========================================================================
// NAVIGATION ITEM TYPE
// =========================================================================

/**
 * Navigation item definition
 */
export interface NavItem {
  /**
   * Unique identifier for this nav item
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Route ID (from RouteRegistry)
   */
  routeId?: string;

  /**
   * URL path (if external or special)
   */
  href?: string;

  /**
   * Icon name
   */
  icon?: string;

  /**
   * Order in parent (for sorting)
   */
  order?: number;

  /**
   * Required roles to see this item
   * Empty = visible to all
   */
  visibleTo?: string[];

  /**
   * Child items (for nested menus)
   */
  children?: NavItem[];

  /**
   * Badge (notification count, new indicator, etc.)
   */
  badge?: {
    label: string | number;
    variant?: 'default' | 'destructive' | 'warning' | 'success';
  };

  /**
   * Whether this item is active (for highlighting)
   */
  isActive?: boolean;

  /**
   * Whether this item should divider before it
   */
  hasDivider?: boolean;

  /**
   * Description for tooltips
   */
  description?: string;

  /**
   * Navigation group this belongs to
   */
  group?: string;
}

// =========================================================================
// NAVIGATION LOCATION TYPE
// =========================================================================

export enum NavigationLocation {
  SIDEBAR = 'SIDEBAR',
  HEADER = 'HEADER',
  BOTTOM_NAV = 'BOTTOM_NAV',
  QUICK_ACTIONS = 'QUICK_ACTIONS',
  MENU = 'MENU',
  FOOTER = 'FOOTER',
}

// =========================================================================
// NAVIGATION STRUCTURE
// =========================================================================

/**
 * Complete navigation configuration
 */
export interface NavigationConfig {
  /**
   * Sidebar navigation
   */
  sidebar?: NavItem[];

  /**
   * Header navigation (top-right menu)
   */
  headerMenu?: NavItem[];

  /**
   * Bottom navigation (mobile)
   */
  bottomNav?: NavItem[];

  /**
   * Quick actions menu
   */
  quickActions?: NavItem[];

  /**
   * Footer links
   */
  footer?: NavItem[];

  /**
   * Global search results mapping
   */
  searchableItems?: NavItem[];
}

// =========================================================================
// NAVIGATION MANAGER
// =========================================================================

/**
 * Central navigation management
 */
export class NavigationManager {
  private config: NavigationConfig = {};
  private activeRoute: string = '';

  /**
   * Set navigation configuration
   */
  setConfiguration(config: NavigationConfig): void {
    this.config = config;
  }

  /**
   * Update active route (for highlighting)
   */
  setActiveRoute(routeId: string): void {
    this.activeRoute = routeId;
    this._updateActiveState();
  }

  /**
   * Get sidebar navigation filtered by user roles
   */
  getSidebarNavigation(userRoles?: string[]): NavItem[] {
    return this._filterNavigation(this.config.sidebar || [], userRoles);
  }

  /**
   * Get header menu filtered by user roles
   */
  getHeaderMenu(userRoles?: string[]): NavItem[] {
    return this._filterNavigation(this.config.headerMenu || [], userRoles);
  }

  /**
   * Get bottom navigation filtered by user roles
   */
  getBottomNavigation(userRoles?: string[]): NavItem[] {
    return this._filterNavigation(this.config.bottomNav || [], userRoles);
  }

  /**
   * Get quick actions filtered by user roles
   */
  getQuickActions(userRoles?: string[]): NavItem[] {
    return this._filterNavigation(this.config.quickActions || [], userRoles);
  }

  /**
   * Get footer links
   */
  getFooterLinks(): NavItem[] {
    return this.config.footer || [];
  }

  /**
   * Get all searchable items
   */
  getSearchableItems(): NavItem[] {
    return this.config.searchableItems || [];
  }

  /**
   * Search navigation items
   */
  search(query: string, userRoles?: string[]): NavItem[] {
    const searchable = this.getSearchableItems();
    const lowerQuery = query.toLowerCase();

    return searchable.filter(
      (item) =>
        (item.label.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)) &&
        this._hasAccess(item, userRoles)
    );
  }

  /**
   * Get navigation item by ID
   */
  getNavItem(id: string): NavItem | undefined {
    return this._findNavItem(id, this._getAllNavItems());
  }

  /**
   * Update badge for navigation item
   */
  updateBadge(
    itemId: string,
    badge: NavItem['badge'] | undefined
  ): void {
    const item = this.getNavItem(itemId);
    if (item) {
      item.badge = badge;
    }
  }

  /**
   * Check if user has access to nav item
   */
  canAccess(itemId: string, userRoles?: string[]): boolean {
    const item = this.getNavItem(itemId);
    return item ? this._hasAccess(item, userRoles) : false;
  }

  /**
   * Get breadcrumb path to nav item
   */
  getBreadcrumb(itemId: string): NavItem[] {
    const breadcrumb: NavItem[] = [];
    const allItems = this._getAllNavItems();

    const findPath = (id: string, items: NavItem[]): boolean => {
      for (const item of items) {
        breadcrumb.push(item);

        if (item.id === id) {
          return true;
        }

        if (item.children && findPath(id, item.children)) {
          return true;
        }

        breadcrumb.pop();
      }

      return false;
    };

    findPath(itemId, allItems);
    return breadcrumb;
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  private _getAllNavItems(): NavItem[] {
    return [
      ...(this.config.sidebar || []),
      ...(this.config.headerMenu || []),
      ...(this.config.bottomNav || []),
      ...(this.config.quickActions || []),
      ...(this.config.footer || []),
    ];
  }

  private _filterNavigation(items: NavItem[], userRoles?: string[]): NavItem[] {
    return items
      .filter((item) => this._hasAccess(item, userRoles))
      .map((item) => ({
        ...item,
        children: item.children
          ? this._filterNavigation(item.children, userRoles)
          : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private _hasAccess(item: NavItem, userRoles?: string[]): boolean {
    // Public if no roles specified
    if (!item.visibleTo || item.visibleTo.length === 0) {
      return true;
    }

    // Check if user has any required role
    if (!userRoles) {
      return false;
    }

    return item.visibleTo.some((role) => userRoles.includes(role));
  }

  private _findNavItem(id: string, items: NavItem[]): NavItem | undefined {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      if (item.children) {
        const found = this._findNavItem(id, item.children);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }

  private _updateActiveState(): void {
    const allItems = this._getAllNavItems();
    this._markActiveItems(allItems, this.activeRoute);
  }

  private _markActiveItems(items: NavItem[], activeId: string): void {
    items.forEach((item) => {
      item.isActive = item.routeId === activeId;
      if (item.children) {
        this._markActiveItems(item.children, activeId);
      }
    });
  }

  /**
   * Export configuration (for debugging)
   */
  export(): string {
    return JSON.stringify(this.config, null, 2);
  }
}

export const navigationManager = new NavigationManager();

// =========================================================================
// NAVIGATION BUILDER (TYPE-SAFE)
// =========================================================================

/**
 * Builder for creating navigation items with type safety
 */
export class NavItemBuilder {
  private item: NavItem;

  constructor(id: string, label: string) {
    this.item = {
      id,
      label,
    };
  }

  routeId(id: string): this {
    this.item.routeId = id;
    return this;
  }

  href(url: string): this {
    this.item.href = url;
    return this;
  }

  icon(icon: string): this {
    this.item.icon = icon;
    return this;
  }

  order(order: number): this {
    this.item.order = order;
    return this;
  }

  visibleTo(...roles: string[]): this {
    this.item.visibleTo = roles;
    return this;
  }

  children(...items: NavItem[]): this {
    this.item.children = items;
    return this;
  }

  badge(label: string | number, variant?: NavItem['badge']['variant']): this {
    this.item.badge = { label, variant };
    return this;
  }

  description(desc: string): this {
    this.item.description = desc;
    return this;
  }

  group(group: string): this {
    this.item.group = group;
    return this;
  }

  hasDivider(has: boolean = true): this {
    this.item.hasDivider = has;
    return this;
  }

  build(): NavItem {
    return this.item;
  }
}

// =========================================================================
// SAMPLE NAVIGATION (DOCUMENTATION)
// =========================================================================

/**
 * EXAMPLE NAVIGATION STRUCTURE:
 * 
 * SIDEBAR:
 * - Dashboard (player)
 * - My Profile (authenticated)
 *   - Personal Info
 *   - Verification Status
 * - Teams (authenticated)
 *   - My Teams
 *   - Join Team
 * - Admin (club_admin, federation_officer)
 *   - Players Management
 *   - Teams Management
 *   - Reports
 * - Settings (authenticated)
 *   - Account
 *   - Privacy & Safety
 * 
 * HEADER MENU:
 * - Notifications (with badge)
 * - Messages (with badge)
 * - User Menu
 *   - Profile
 *   - Settings
 *   - Logout
 * 
 * BOTTOM NAV (Mobile):
 * - Home (max 5 items)
 * - Teams
 * - Messages
 * - Profile
 * - Menu (more)
 * 
 * QUICK ACTIONS:
 * - Create New Player (admin)
 * - Register Team (club_admin)
 * - Send Verification (verification_authority)
 * 
 * FOOTER:
 * - About
 * - Privacy Policy
 * - Terms of Service
 * - Contact
 */

// =========================================================================
// EXPORTS
// =========================================================================

export {
  NavigationManager,
  navigationManager,
  NavItemBuilder,
  NavigationLocation,
};

export type {
  NavItem,
  NavigationConfig,
};
