/**
 * IDN-UI-GEN-001: SPRINT 0 IMPLEMENTATION GUIDE
 * 
 * Complete reference for using all Shell components created in Sprint 0
 * 
 * Artefact Traceability:
 * - Derives from: IDN-DS-001, IDN-UIC-001, IDN-SCR-DETAILS-001, EPOS-CORE-DOC-001
 * - Implements: Application Shell, Layouts, Navigation, Theme, Error Handling
 * - Validation: WCAG 2.1 AA, Child Protection (STK-INV-004), Mobile-First Design
 */

// =============================================================================
// 1. BASIC APP SETUP
// =============================================================================

/**
 * Wrap your app with RootProviders for theme, notifications, and error handling:
 */

import { App } from '~/App';
import { Outlet } from '@tanstack/react-router';

export default function RootLayout() {
  return <App><Outlet /></App>;
}

// Alternatively, use individual providers:
import { ThemeProvider } from '~/components/providers';
import { ErrorBoundary } from '~/components/boundaries';

export function AppWithCustomProviders() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <YourApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// =============================================================================
// 2. THEME MANAGEMENT
// =============================================================================

import { useTheme } from '~/hooks';

export function ThemeToggle() {
  const { mode, resolvedMode, setMode, toggle } = useTheme();

  return (
    <div>
      <p>Current mode: {resolvedMode}</p>
      <p>Preference: {mode}</p>
      
      <button onClick={() => setMode('light')}>Light</button>
      <button onClick={() => setMode('dark')}>Dark</button>
      <button onClick={() => setMode('system')}>System</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

// =============================================================================
// 3. LAYOUT PATTERNS
// =============================================================================

import {
  PublicLayout,
  AuthenticatedLayout,
  DashboardLayout,
  EmptyLayout,
  ErrorLayout,
  MaintenanceLayout,
  ForbiddenLayout,
  PageContainer,
  ContentContainer,
} from '~/components/layouts';
import { useResponsive } from '~/hooks';

// --- 3A. PUBLIC LAYOUT (Landing, Blog, etc.) ---
export function LandingPage() {
  return (
    <PublicLayout title="Football ID Nation">
      <PageContainer>
        <h1>Welcome</h1>
        <p>This is a public page</p>
      </PageContainer>
    </PublicLayout>
  );
}

// --- 3B. AUTHENTICATED LAYOUT (Dashboard, Profile, etc.) ---
export function PlayerDashboard() {
  const { isMobile } = useResponsive();

  return (
    <AuthenticatedLayout
      title="Player Dashboard"
      navItems={[
        { id: 'home', label: 'Home', href: '/player', icon: <HomeIcon /> },
        { id: 'profile', label: 'Profile', href: '/player/profile' },
        { id: 'matches', label: 'Matches', href: '/player/matches', badge: 3 },
      ]}
      userRole="player"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard', isActive: true },
      ]}
    >
      <ContentContainer>
        <h2>Welcome, Player!</h2>
      </ContentContainer>
    </AuthenticatedLayout>
  );
}

// --- 3C. DASHBOARD LAYOUT (Analytics, Admin, etc.) ---
export function AdminDashboard() {
  return (
    <DashboardLayout
      title="Admin Dashboard"
      navItems={adminNavItems}
      userRole="federation_officer"
      headerActions={<UserMenu />}
      sidebar={<DashboardSidebar />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Players" value="1,245" />
        <MetricCard title="Pending Verification" value="23" />
        <MetricCard title="Active Organizations" value="45" />
      </div>
    </DashboardLayout>
  );
}

// --- 3D. EMPTY LAYOUT (Login, Signup, Onboarding) ---
export function LoginPage() {
  return (
    <EmptyLayout showHeader={true}>
      <LoginForm />
    </EmptyLayout>
  );
}

// --- 3E. ERROR LAYOUTS ---
export function NotFoundPage() {
  return (
    <ErrorLayout
      errorCode={404}
      errorTitle="Page Not Found"
      errorMessage="The page you're looking for doesn't exist."
      actions={
        <>
          <Button onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </>
      }
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorLayout
      errorCode={500}
      errorTitle="Server Error"
      errorMessage="Something went wrong on our end."
      actions={
        <>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </>
      }
    />
  );
}

// --- 3F. FORBIDDEN LAYOUT ---
export function AccessDeniedPage() {
  return (
    <ForbiddenLayout
      message="You don't have permission to access this resource."
      actions={
        <>
          <Button onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </>
      }
    />
  );
}

// --- 3G. MAINTENANCE LAYOUT ---
export function MaintenancePage() {
  return (
    <MaintenanceLayout
      message="We're performing scheduled maintenance."
      estimatedTime="Back online in ~2 hours"
    />
  );
}

// =============================================================================
// 4. NAVIGATION COMPONENTS
// =============================================================================

import {
  Header,
  Sidebar,
  Breadcrumb,
  BottomNav,
  createNavItem,
} from '~/components/navigation';

// --- 4A. HEADER ---
export function HeaderExample() {
  return (
    <Header
      title="Football ID Nation"
      onMenuToggle={() => console.log('Toggle menu')}
      actions={<UserMenu />}
      showSearch={true}
    />
  );
}

// --- 4B. SIDEBAR ---
export function SidebarExample() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems = [
    createNavItem('home', 'Home', '/player'),
    createNavItem('profile', 'Profile', '/player/profile'),
    {
      id: 'account',
      label: 'Account',
      href: '#',
      visibleTo: ['player', 'guardian'],
      children: [
        createNavItem('settings', 'Settings', '/settings'),
        createNavItem('privacy', 'Privacy', '/privacy'),
      ],
    },
  ];

  return (
    <Sidebar
      items={navItems}
      isOpen={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      userRole="player"
    />
  );
}

// --- 4C. BREADCRUMB ---
export function BreadcrumbExample() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Players', href: '/players' },
        { label: 'John Doe', isActive: true },
      ]}
    />
  );
}

// --- 4D. BOTTOM NAVIGATION (Mobile) ---
export function BottomNavExample() {
  return (
    <BottomNav
      items={mobileNavItems}
      userRole="player"
    />
  );
}

// =============================================================================
// 5. ERROR HANDLING
// =============================================================================

import {
  ErrorBoundary,
  LoadingBoundary,
  LoadingSpinner,
  Skeleton,
  CardSkeleton,
} from '~/components/boundaries';

// --- 5A. ERROR BOUNDARY ---
export function ProtectedComponent() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Component error:', error);
      }}
      resetKeys={[someValue]}
    >
      <RiskyComponent />
    </ErrorBoundary>
  );
}

// Custom error fallback
export function ProtectedComponentWithFallback() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="p-4 bg-red-100 rounded">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <Button onClick={reset}>Try Again</Button>
        </div>
      )}
    >
      <RiskyComponent />
    </ErrorBoundary>
  );
}

// --- 5B. LOADING BOUNDARY ---
export function DataDisplay() {
  const { data, isLoading, error } = useQuery(...);

  return (
    <LoadingBoundary
      isLoading={isLoading}
      error={error}
      loadingFallback={<CardSkeleton count={3} />}
    >
      {data && <DataList data={data} />}
    </LoadingBoundary>
  );
}

// --- 5C. LOADING SPINNER ---
export function SubmitButton() {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <>
      {isLoading && <LoadingSpinner size="md" label="Submitting..." />}
      <Button onClick={() => setIsLoading(true)}>Submit</Button>
    </>
  );
}

// --- 5D. SKELETON LOADERS ---
export function SkeletonExample() {
  return (
    <div className="space-y-4">
      <Skeleton height="2rem" width="40%" />
      <Skeleton height="1rem" width="100%" />
      <Skeleton height="1rem" width="80%" />
    </div>
  );
}

export function TableLoadingState() {
  return <TableSkeleton rows={5} columns={4} />;
}

export function FormLoadingState() {
  return <FormSkeleton fields={4} />;
}

// =============================================================================
// 6. CUSTOM HOOKS
// =============================================================================

import {
  useAuth,
  useTheme,
  useResponsive,
  useMediaQuery,
  useNotification,
  useLocalStorage,
  useDebounce,
  useClickOutside,
} from '~/hooks';

// --- 6A. useAuth ---
export function ProfileWithAuth() {
  const { session, isLoading, error, logout } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Auth error: {error.message}</p>;
  if (!session) return <p>Not authenticated</p>;

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}

// --- 6B. useResponsive ---
export function ResponsiveComponent() {
  const { breakpoint, isMobile, isTablet, isDesktop, width } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
      <p>Current breakpoint: {breakpoint} (width: {width}px)</p>
    </div>
  );
}

// --- 6C. useMediaQuery ---
export function DarkModeDetection() {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <div>
      <p>Dark mode: {isDarkMode ? 'Yes' : 'No'}</p>
      <p>Small screen: {isSmallScreen ? 'Yes' : 'No'}</p>
    </div>
  );
}

// --- 6D. useNotification ---
export function NotificationExample() {
  const { success, error, warning, info } = useNotification();

  return (
    <div className="space-y-2">
      <Button onClick={() => success('Operation completed!')}>
        Show Success
      </Button>
      <Button onClick={() => error('Something went wrong')}>
        Show Error
      </Button>
      <Button onClick={() => warning('Please be careful')}>
        Show Warning
      </Button>
      <Button onClick={() => info('Here is some info')}>
        Show Info
      </Button>
    </div>
  );
}

// --- 6E. useLocalStorage ---
export function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    'sidebar-collapsed',
    false
  );

  return (
    <div>
      <p>Theme: {theme}</p>
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
    </div>
  );
}

// --- 6F. useDebounce ---
export function SearchWithDebounce() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedTerm = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    if (debouncedTerm) {
      console.log('Searching for:', debouncedTerm);
    }
  }, [debouncedTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}

// --- 6G. useClickOutside ---
export function Dropdown() {
  const dropdownRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <Button onClick={() => setIsOpen(!isOpen)}>Menu</Button>
      {isOpen && <DropdownMenu />}
    </div>
  );
}

// =============================================================================
// 7. NOTIFICATIONS
// =============================================================================

import { NotificationCenter, useGlobalNotification } from '~/components/notifications';

export function NotificationExample() {
  const { success, error } = useGlobalNotification();

  return (
    <>
      <Button onClick={() => success('Changes saved!')}>Save</Button>
      <Button onClick={() => error('Failed to save')}>Fail</Button>
    </>
  );
}

// =============================================================================
// 8. DESIGN TOKENS
// =============================================================================

import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  BREAKPOINTS,
  Z_INDEX,
} from '~/lib/constants';

export function ComponentUsingTokens() {
  return (
    <div
      style={{
        backgroundColor: COLORS.primary.navy,
        color: COLORS.neutral.white,
        padding: SPACING[3],
        borderRadius: BORDER_RADIUS.md,
        boxShadow: SHADOWS.md,
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.body,
      }}
    >
      Component using design tokens
    </div>
  );
}

// =============================================================================
// 9. COMMON PATTERNS
// =============================================================================

// --- 9A. Protected Page with Layout & Error Handling ---
export function ProtectedPlayerPage() {
  const { session, isLoading } = useAuth();

  return (
    <LoadingBoundary isLoading={isLoading}>
      {!session ? (
        <ForbiddenLayout message="Please log in to continue" />
      ) : (
        <ErrorBoundary>
          <AuthenticatedLayout
            title="Player Profile"
            navItems={navItems}
            userRole={session.user.role}
          >
            <PageContainer>
              <PlayerProfile session={session} />
            </PageContainer>
          </AuthenticatedLayout>
        </ErrorBoundary>
      )}
    </LoadingBoundary>
  );
}

// --- 9B. Form with Notifications ---
export function SubmitFormWithNotifications() {
  const { success, error } = useGlobalNotification();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await submitForm(data);
      success('Form submitted successfully!');
    } catch (err) {
      error('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoadingBoundary isLoading={isSubmitting}>
      <Form onSubmit={handleSubmit} />
    </LoadingBoundary>
  );
}

// =============================================================================
// 10. RESPONSIVE PATTERNS
// =============================================================================

export function ResponsiveGrid() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div
      className={`grid gap-${SPACING[3]} ${
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'
      }`}
    >
      {items.map((item) => (
        <Card key={item.id}>{item.name}</Card>
      ))}
    </div>
  );
}

// =============================================================================
// EXPORT STRUCTURE REFERENCE
// =============================================================================

/*
All components organized by category for easy imports:

Layouts:
  - PublicLayout
  - AuthenticatedLayout
  - DashboardLayout
  - EmptyLayout
  - ErrorLayout
  - MaintenanceLayout
  - ForbiddenLayout
  - PageContainer
  - ContentContainer

Navigation:
  - Header
  - Sidebar
  - Breadcrumb
  - BottomNav
  - createNavItem
  - filterNavByRole

Boundaries:
  - ErrorBoundary
  - LoadingBoundary
  - LoadingSpinner
  - Skeleton
  - CardSkeleton
  - TableSkeleton
  - FormSkeleton

Providers:
  - ThemeProvider
  - useTheme
  - DESIGN_TOKENS

Hooks:
  - useAuth
  - useTheme
  - useResponsive
  - useMediaQuery
  - useNotification
  - useLocalStorage
  - usePrevious
  - useDebounce
  - useClickOutside

Notifications:
  - NotificationCenter
  - useGlobalNotification
  - NotificationContext

Types:
  - All types from ~/types/index.ts

Constants:
  - COLORS
  - TYPOGRAPHY
  - SPACING
  - BORDER_RADIUS
  - SHADOWS
  - MOTION
  - BREAKPOINTS
  - TOUCH_TARGET
  - Z_INDEX
  - PAGINATION
  - VALIDATION
  - HTTP
  - ANIMATIONS
  - LAYOUT
  - MESSAGES
*/
