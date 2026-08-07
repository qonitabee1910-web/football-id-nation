export { ShellProvider, useShell } from "./contexts/ShellContext";

export { useAreaNavigation, maskDisplayCode } from "./hooks/useAreaNavigation";

export { AppShell } from "./components/AppShell";
export { AppHeader } from "./components/AppHeader";
export { AreaSidebar } from "./components/AreaSidebar";
export { BottomNav } from "./components/BottomNav";
export { AreaBreadcrumb } from "./components/AreaBreadcrumb";
export type { CrumbOverride } from "./components/AreaBreadcrumb";
export { CommandPalette } from "./components/CommandPalette";
export type { CommandPaletteItem } from "./components/CommandPalette";
export { NotificationCenter } from "./components/NotificationCenter";
export { GlobalSearch } from "./components/GlobalSearch";
export type { GlobalSearchResult } from "./components/GlobalSearch";
export { ThemeToggle } from "./components/ThemeToggle";
export { RoleContextSwitcher } from "./components/RoleContextSwitcher";

export { DashboardLayout } from "./layouts/DashboardLayout";
export type { DashboardLayoutProps } from "./layouts/DashboardLayout";
export { AuthLayout } from "./layouts/AuthLayout";
export type { AuthLayoutProps } from "./layouts/AuthLayout";
export { PublicLayout } from "./layouts/PublicLayout";
export type { PublicLayoutProps } from "./layouts/PublicLayout";
export { ProtectedLayout } from "./layouts/ProtectedLayout";
export type { ProtectedLayoutProps } from "./layouts/ProtectedLayout";
export { EmptyLayout } from "./layouts/EmptyLayout";
export type { EmptyLayoutProps } from "./layouts/EmptyLayout";
export { NotFoundLayout } from "./layouts/NotFoundLayout";
export type { NotFoundLayoutProps } from "./layouts/NotFoundLayout";
export { MaintenanceLayout } from "./layouts/MaintenanceLayout";
export type { MaintenanceLayoutProps } from "./layouts/MaintenanceLayout";
export { ForbiddenLayout } from "./layouts/ForbiddenLayout";
export type { ForbiddenLayoutProps } from "./layouts/ForbiddenLayout";
export { UnauthorizedLayout } from "./layouts/UnauthorizedLayout";
export type { UnauthorizedLayoutProps } from "./layouts/UnauthorizedLayout";

export type {
  AreaKey,
  RoleKey,
  NavItem,
  AreaNavConfig,
  CrumbItem,
  CommandItem as CommandPaletteCommandItem,
  NotificationItem,
  ShellContextValue,
  PersonContextValue,
} from "./types";
