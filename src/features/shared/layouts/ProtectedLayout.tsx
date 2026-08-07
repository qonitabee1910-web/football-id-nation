import { type ReactNode } from "react";
import { Outlet, Navigate, useLocation } from "@tanstack/react-router";
import { GlobalErrorBoundary } from "@/components/domain/error/GlobalErrorBoundary";
import { LoadingBoundary } from "@/components/domain/loading/LoadingBoundary";
import { DashboardLayout } from "./DashboardLayout";
import { UnifiedNotFound } from "@/components/domain/error/UnifiedNotFound";
import type { AreaKey, RoleKey } from "../types";

export interface ProtectedLayoutProps {
  readonly area: AreaKey;
  readonly requiredRoles?: readonly RoleKey[];
  readonly userRoles?: readonly RoleKey[];
  readonly authenticated?: boolean;
  readonly activeRoleContexts?: readonly RoleKey[];
  readonly currentRoleContext?: RoleKey | null;
  readonly onSelectRole?: (role: RoleKey) => void;
  readonly displayName?: string | null;
  readonly displayCode?: string | null;
  readonly breadcrumbItems?: readonly {
    label: string;
    to?: string;
    sensitive?: boolean;
    displayValue?: string | null;
  }[];
  readonly pageTitle?: string;
  readonly unreadNotifications?: number;
  readonly maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  readonly children?: ReactNode;
  readonly loginRoute?: string;
  readonly forbidRoute?: string;
  readonly className?: string;
}

export function ProtectedLayout({
  area,
  requiredRoles,
  userRoles,
  authenticated,
  activeRoleContexts,
  currentRoleContext,
  onSelectRole,
  displayName,
  displayCode,
  breadcrumbItems,
  pageTitle,
  unreadNotifications = 0,
  maxWidth = "xl",
  children,
  loginRoute = "/login",
  forbidRoute = "/errors/403",
  className,
}: ProtectedLayoutProps) {
  const location = useLocation();

  const hasRequiredRole =
    !requiredRoles ||
    requiredRoles.length === 0 ||
    (userRoles ?? []).some((r) => requiredRoles.includes(r));

  if (authenticated === false) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={loginRoute}
        search={(prev) => ({ ...prev, return: returnTo })}
        replace
      />
    );
  }

  if (authenticated === true && !hasRequiredRole) {
    return (
      <GlobalErrorBoundary isStructural>
        <div className="min-h-screen w-full bg-background">
          <UnifiedNotFound variant="403" />
        </div>
      </GlobalErrorBoundary>
    );
  }

  return (
    <DashboardLayout
      area={area}
      authenticated={authenticated ?? true}
      {...(userRoles ? { userRoles } : {})}
      {...(activeRoleContexts ? { activeRoleContexts } : {})}
      {...(currentRoleContext !== undefined && currentRoleContext !== null ? { currentRoleContext } : {})}
      {...(onSelectRole ? { onSelectRole } : {})}
      {...(displayName !== undefined && displayName !== null ? { displayName } : {})}
      {...(displayCode !== undefined && displayCode !== null ? { displayCode } : {})}
      {...(pageTitle ? { pageTitle } : {})}
      {...(breadcrumbItems ? { breadcrumbItems } : {})}
      unreadNotifications={unreadNotifications}
      maxWidth={maxWidth}
      {...(className ? { className } : {})}
    >
      <LoadingBoundary>{children ?? <Outlet />}</LoadingBoundary>
    </DashboardLayout>
  );
}
