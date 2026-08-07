/**
 * IDN-UI-GEN-001: NAVIGATION COMPONENTS
 * 
 * Derives from:
 * - IDN-SCR-DETAILS-001 (Navigation Areas, Screen Structure)
 * - IDN-DS-001 (Navigation Styling)
 * - EPOS-CORE-DOC-001 (Component patterns)
 * 
 * Implements:
 * - Header navigation
 * - Sidebar navigation
 * - Bottom navigation (mobile)
 * - Breadcrumb navigation
 * - Responsive behavior
 * - Authorization visibility (derived from IDN-SCR-001 Part 9)
 */

import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '~/components/ui/button';
import type { NavigationArea, UserRole } from '~/types';

// =============================================================================
// NAVIGATION ITEM INTERFACE
// =============================================================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  visibleTo?: UserRole[];
  children?: NavItem[];
  badge?: string | number;
  isActive?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

// =============================================================================
// HEADER COMPONENT (IDN-SCR-DETAILS-001: Header Structure)
// =============================================================================

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
  actions?: React.ReactNode;
  showSearch?: boolean;
  logo?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Football ID Nation',
  onMenuToggle,
  actions,
  showSearch = true,
  logo,
  className = '',
}) => {
  return (
    <header
      className={`
        sticky top-0 z-40
        bg-white dark:bg-neutral-900
        border-b border-neutral-200 dark:border-neutral-800
        px-4 py-3 sm:px-6
        ${className}
      `}
      role="banner"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3 flex-1">
          {onMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {logo ? (
            <div className="flex items-center gap-2">
              {logo}
              <span className="hidden sm:block font-bold text-lg text-primary-navy dark:text-white">
                {title}
              </span>
            </div>
          ) : (
            <h1 className="font-bold text-lg text-primary-navy dark:text-white line-clamp-1">
              {title}
            </h1>
          )}
        </div>

        {/* Center: Search (optional) */}
        {showSearch && (
          <div className="hidden md:block flex-1 max-w-md">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm placeholder-neutral-500 dark:placeholder-neutral-400"
              aria-label="Search"
            />
          </div>
        )}

        {/* Right: Actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

// =============================================================================
// SIDEBAR COMPONENT (IDN-SCR-DETAILS-001: Sidebar Navigation)
// =============================================================================

interface SidebarProps {
  items: NavItem[];
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: UserRole;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  isOpen = true,
  onClose,
  userRole,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Filter items by user role (IDN-SCR-001 Part 9: Visibility Matrix)
  const visibleItems = items.filter(
    (item) => !item.visibleTo || !userRole || item.visibleTo.includes(userRole)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen
          w-64 bg-white dark:bg-neutral-900
          border-r border-neutral-200 dark:border-neutral-800
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <nav className="space-y-1 p-4">
          {visibleItems.length === 0 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 p-2">
              No navigation items available
            </p>
          )}

          {visibleItems.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              level={0}
              isExpanded={expandedItems.has(item.id)}
              onToggleExpand={() => toggleExpanded(item.id)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

// =============================================================================
// NAVIGATION ITEM COMPONENT (Recursive)
// =============================================================================

interface NavItemComponentProps {
  item: NavItem;
  level: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({
  item,
  level,
  isExpanded = false,
  onToggleExpand,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = `${level * 1 + 1}rem`;

  return (
    <div key={item.id}>
      <a
        href={!hasChildren ? item.href : undefined}
        onClick={() => hasChildren && onToggleExpand?.()}
        className={`
          flex items-center justify-between
          px-3 py-2 rounded-md text-sm font-medium
          transition-colors duration-150
          ${
            item.isActive
              ? 'bg-primary-navy text-white dark:bg-primary-navy'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }
          ${hasChildren ? 'cursor-pointer' : ''}
        `}
        style={{ paddingLeft }}
        role={hasChildren ? 'button' : 'link'}
        aria-expanded={hasChildren ? isExpanded : undefined}
      >
        <div className="flex items-center gap-3 flex-1">
          {item.icon && <span className="h-5 w-5">{item.icon}</span>}
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto inline-flex items-center justify-center h-6 w-6 text-xs font-bold rounded-full bg-danger text-white">
              {item.badge}
            </span>
          )}
        </div>

        {hasChildren && (
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-150 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
      </a>

      {/* Child Items */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// BREADCRUMB COMPONENT (IDN-SCR-DETAILS-001: Breadcrumb)
// =============================================================================

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className = '',
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href && !item.isActive ? (
              <a
                href={item.href}
                className="text-primary-navy dark:text-blue-400 hover:underline"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={
                  item.isActive
                    ? 'text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-600 dark:text-neutral-400'
                }
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}

            {index < items.length - 1 && (
              <span className="text-neutral-400 dark:text-neutral-600">{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// =============================================================================
// BOTTOM NAVIGATION (IDN-DS-001: Mobile Navigation)
// =============================================================================

interface BottomNavProps {
  items: NavItem[];
  userRole?: UserRole;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  userRole,
  className = '',
}) => {
  // Filter items by user role
  const visibleItems = items
    .filter((item) => !item.visibleTo || !userRole || item.visibleTo.includes(userRole))
    .slice(0, 5); // Show max 5 items

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-30
        bg-white dark:bg-neutral-900
        border-t border-neutral-200 dark:border-neutral-800
        flex items-center justify-around
        md:hidden
        ${className}
      `}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {visibleItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className={`
            flex flex-col items-center justify-center gap-1
            px-2 py-2 flex-1
            text-xs font-medium
            transition-colors duration-150
            ${
              item.isActive
                ? 'text-primary-navy dark:text-blue-400'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }
          `}
          aria-current={item.isActive ? 'page' : undefined}
        >
          {item.icon && <span className="h-5 w-5">{item.icon}</span>}
          <span className="truncate max-w-[60px]">{item.label}</span>
          {item.badge && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full bg-danger text-white">
              {item.badge}
            </span>
          )}
        </a>
      ))}
    </nav>
  );
};

// =============================================================================
// NAVIGATION BUILDER (Helper to create role-based nav items)
// =============================================================================

export const createNavItem = (
  id: string,
  label: string,
  href: string,
  options?: Partial<NavItem>
): NavItem => ({
  id,
  label,
  href,
  ...options,
});

export const filterNavByRole = (items: NavItem[], userRole?: UserRole): NavItem[] => {
  return items
    .filter((item) => !item.visibleTo || !userRole || item.visibleTo.includes(userRole))
    .map((item) => ({
      ...item,
      children: item.children ? filterNavByRole(item.children, userRole) : undefined,
    }));
};
