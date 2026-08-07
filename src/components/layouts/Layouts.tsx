/**
 * IDN-UI-GEN-001: RESPONSIVE LAYOUT COMPONENTS
 * 
 * Derives from:
 * - IDN-SCR-DETAILS-001 (Screen Structures, Layout Variants)
 * - IDN-DS-001 (Responsive Breakpoints, Spacing)
 * - EPOS-CORE-DOC-001 (Component patterns)
 * 
 * Implements:
 * - 7 layout variants (public, authenticated, dashboard, empty, error, maintenance, forbidden)
 * - Responsive mobile-first design
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Child protection context (data minimization on error states)
 * - Dynamic sidebar/header visibility
 */

import React, { ReactNode, useState } from 'react';
import { Header, Sidebar, BottomNav, Breadcrumb, BreadcrumbItem, NavItem } from './Navigation';
import { ErrorBoundary } from '~/components/boundaries/ErrorBoundary';
import type { UserRole, ScreenContext, ChildProtectionContext } from '~/types';

// =============================================================================
// COMMON LAYOUT CONTAINER
// =============================================================================

interface LayoutContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer: React.FC<LayoutContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <main
      className={`
        flex-1
        px-4 py-6 sm:px-6 lg:px-8
        max-w-7xl mx-auto w-full
        ${className}
      `}
      role="main"
    >
      {children}
    </main>
  );
};

export const ContentContainer: React.FC<LayoutContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        w-full
        bg-white dark:bg-neutral-900
        rounded-lg border border-neutral-200 dark:border-neutral-800
        p-4 sm:p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// =============================================================================
// 1. PUBLIC LAYOUT (No authentication required - IDN-SCR-DETAILS-001: Public Screens)
// =============================================================================

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  headerActions?: ReactNode;
  className?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  title = 'Football ID Nation',
  showHeader = true,
  headerActions,
  className = '',
}) => {
  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen bg-light dark:bg-neutral-950 ${className}`}>
        {showHeader && <Header title={title} actions={headerActions} />}
        <PageContainer>{children}</PageContainer>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// 2. AUTHENTICATED LAYOUT (With user context - IDN-SCR-DETAILS-001: Authenticated Screens)
// =============================================================================

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title?: string;
  navItems?: NavItem[];
  userRole?: UserRole;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: ReactNode;
  className?: string;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  title = 'Football ID Nation',
  navItems = [],
  userRole,
  breadcrumbs,
  headerActions,
  className = '',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ErrorBoundary resetKeys={[userRole]}>
      <div className={`flex flex-col min-h-screen bg-light dark:bg-neutral-950 ${className}`}>
        {/* Header */}
        <Header
          title={title}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          actions={headerActions}
        />

        <div className="flex flex-1 gap-0 lg:gap-6">
          {/* Sidebar (Desktop + Mobile Drawer) */}
          {navItems.length > 0 && (
            <Sidebar
              items={navItems}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              userRole={userRole}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="px-4 py-3 sm:px-6 border-b border-neutral-200 dark:border-neutral-800">
                <Breadcrumb items={breadcrumbs} />
              </div>
            )}

            <PageContainer>{children}</PageContainer>
            <Footer />
          </div>
        </div>

        {/* Bottom Navigation (Mobile) */}
        {navItems.length > 0 && <BottomNav items={navItems} userRole={userRole} />}
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// 3. DASHBOARD LAYOUT (Full-featured with widgets - IDN-SCR-DETAILS-001: Dashboard Screens)
// =============================================================================

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  navItems?: NavItem[];
  userRole?: UserRole;
  headerActions?: ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title = 'Dashboard',
  navItems = [],
  userRole,
  headerActions,
  sidebar,
  className = '',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen bg-light dark:bg-neutral-950 ${className}`}>
        <Header
          title={title}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          actions={headerActions}
          showSearch={true}
        />

        <div className="flex flex-1 gap-0 lg:gap-6">
          {/* Main Sidebar */}
          {navItems.length > 0 && (
            <Sidebar
              items={navItems}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              userRole={userRole}
              className="lg:relative lg:translate-x-0"
            />
          )}

          {/* Dashboard Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 lg:flex gap-6">
              {/* Main Content */}
              <div className="flex-1">
                <PageContainer>{children}</PageContainer>
              </div>

              {/* Right Sidebar (Optional) */}
              {sidebar && (
                <aside className="hidden xl:block w-64 pt-6 pb-20">
                  {sidebar}
                </aside>
              )}
            </div>

            <Footer />
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        {navItems.length > 0 && <BottomNav items={navItems} userRole={userRole} />}
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// 4. EMPTY LAYOUT (Centered content - login, signup, onboarding)
// =============================================================================

interface EmptyLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  className?: string;
}

export const EmptyLayout: React.FC<EmptyLayoutProps> = ({
  children,
  showHeader = true,
  className = '',
}) => {
  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen bg-light dark:bg-neutral-950 ${className}`}>
        {showHeader && <Header title="Football ID Nation" />}

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// 5. ERROR LAYOUT (Error screens - 404, 500, etc.)
// =============================================================================

interface ErrorLayoutProps {
  errorCode: number;
  errorTitle: string;
  errorMessage: string;
  actions?: React.ReactNode;
  className?: string;
}

export const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  errorCode,
  errorTitle,
  errorMessage,
  actions,
  className = '',
}) => {
  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen bg-light dark:bg-neutral-950 ${className}`}>
        <Header title="Football ID Nation" />

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* Error Code */}
            <div className="text-9xl font-bold text-primary-navy dark:text-blue-400 mb-4 select-none">
              {errorCode}
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              {errorTitle}
            </h1>

            {/* Error Message */}
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              {errorMessage}
            </p>

            {/* Actions */}
            {actions && <div className="flex flex-col gap-3">{actions}</div>}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// 6. MAINTENANCE LAYOUT (Maintenance screens)
// =============================================================================

interface MaintenanceLayoutProps {
  message?: string;
  estimatedTime?: string;
  className?: string;
}

export const MaintenanceLayout: React.FC<MaintenanceLayoutProps> = ({
  message = 'We are currently performing maintenance.',
  estimatedTime = 'We will be back shortly.',
  className = '',
}) => {
  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen bg-light dark:bg-neutral-950 ${className}`}>
        <Header title="Football ID Nation" />

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            {/* Maintenance Icon */}
            <div className="text-6xl mb-6">🔧</div>

            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Maintenance in Progress
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {message}
            </p>

            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              {estimatedTime}
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

// =============================================================================
// 7. FORBIDDEN LAYOUT (403 Forbidden - Access Denied)
// =============================================================================

interface ForbiddenLayoutProps {
  message?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const ForbiddenLayout: React.FC<ForbiddenLayoutProps> = ({
  message = 'You do not have permission to access this resource.',
  actions,
  className = '',
}) => {
  return (
    <ErrorLayout
      errorCode={403}
      errorTitle="Access Denied"
      errorMessage={message}
      actions={actions}
      className={className}
    />
  );
};

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`
        bg-neutral-50 dark:bg-neutral-900
        border-t border-neutral-200 dark:border-neutral-800
        px-4 py-8 sm:px-6
        mt-12
        ${className}
      `}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white mb-3">
              Football ID Nation
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Empowering Indonesian youth football through identity, transparency, and trust.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-navy dark:hover:text-blue-400">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-navy dark:hover:text-blue-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-navy dark:hover:text-blue-400">
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-navy dark:hover:text-blue-400">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-navy dark:hover:text-blue-400">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-primary-navy dark:hover:text-blue-400">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
            © {new Date().getFullYear()} Football ID Nation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
