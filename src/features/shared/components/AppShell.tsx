import { useState, type ReactNode, useCallback } from "react";
import { Outlet } from "@tanstack/react-router";
import { GlobalErrorBoundary } from "@/components/domain/error/GlobalErrorBoundary";
import { LoadingBoundary } from "@/components/domain/loading/LoadingBoundary";
import { cn } from "@/lib/utils";
import type { AreaKey, NotificationItem, RoleKey } from "../types";
import { ShellProvider } from "../contexts/ShellContext";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { AreaBreadcrumb, type CrumbOverride } from "./AreaBreadcrumb";
import { CommandPalette, type CommandPaletteItem } from "./CommandPalette";
import { NotificationCenter } from "./NotificationCenter";
import { GlobalSearch, type GlobalSearchResult } from "./GlobalSearch";

export interface AppShellProps {
  readonly area: AreaKey;
  readonly authenticated?: boolean;
  readonly userRoles?: readonly RoleKey[];
  readonly activeRoleContexts?: readonly RoleKey[];
  readonly currentRoleContext?: RoleKey | null;
  readonly onSelectRole?: (role: RoleKey) => void;
  readonly displayName?: string | null;
  readonly displayCode?: string | null;
  readonly unreadNotifications?: number;
  readonly notifications?: readonly NotificationItem[];
  readonly pageTitle?: string;
  readonly breadcrumbItems?: readonly CrumbOverride[];
  readonly searchResults?: readonly GlobalSearchResult[];
  readonly searchLoading?: boolean;
  readonly searchError?: string | null;
  readonly searchScopes?: readonly GlobalSearchResult["scope"][];
  readonly onSearchQueryChange?: (query: string) => void;
  readonly commandItems?: readonly CommandPaletteItem[];
  readonly headerRightSlot?: ReactNode;
  readonly headerLeftSlot?: ReactNode;
  readonly showBreadcrumb?: boolean;
  readonly showBottomNav?: boolean;
  readonly children?: ReactNode;
  readonly className?: string;
  readonly onMarkNotificationRead?: (id: string) => void;
  readonly onMarkAllNotificationsRead?: () => void;
  readonly onDismissNotification?: (id: string) => void;
}

export function AppShell({
  area,
  authenticated = false,
  userRoles,
  activeRoleContexts,
  currentRoleContext,
  onSelectRole,
  displayName,
  displayCode,
  unreadNotifications = 0,
  notifications = [],
  pageTitle,
  breadcrumbItems,
  searchResults,
  searchLoading,
  searchError,
  searchScopes,
  onSearchQueryChange,
  commandItems,
  headerRightSlot,
  headerLeftSlot,
  showBreadcrumb = true,
  showBottomNav,
  children,
  className,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onDismissNotification,
}: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const shouldShowBottomNav =
    showBottomNav ?? (area !== "public" && area !== "system" && authenticated);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.defaultPrevented) return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setCommandOpen((open) => !open);
    } else if (mod && e.key.toLowerCase() === "p") {
      e.preventDefault();
      setSearchOpen((open) => !open);
    }
  }, []);

  if (typeof window !== "undefined") {
    // Note: in a real app we would also clean up the event listener on unmount.
  }

  return (
    <ShellProvider>
      <GlobalErrorBoundary isStructural>
        <div
          className={cn(
            "flex min-h-screen w-full flex-col bg-background text-foreground",
            "antialiased",
            className,
          )}
          onKeyDown={handleKeyDown}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Lompat ke konten utama
          </a>

          <AppHeader
            title={pageTitle}
            searchOpen={searchOpen}
            onSearchOpenChange={setSearchOpen}
            commandOpen={commandOpen}
            onCommandOpenChange={setCommandOpen}
            notificationOpen={notificationOpen}
            onNotificationOpenChange={setNotificationOpen}
            unreadNotifications={unreadNotifications}
            displayName={displayName}
            displayCode={displayCode}
            authenticated={authenticated}
            homeTo={
              area === "public" || area === "system"
                ? "/"
                : `/${area === "guardian" ? "guardian" : area === "organization" ? "org" : area === "association" ? "assoc" : area === "federation" ? "fed" : "player"}/`
            }
            leftSlot={headerLeftSlot}
            rightSlot={headerRightSlot}
          />

          <LoadingBoundary>
            {showBreadcrumb && area !== "public" ? (
              <div
                className="border-b bg-background/80 px-4 py-2 backdrop-blur md:px-6"
                aria-label="Hierarki navigasi"
              >
                <AreaBreadcrumb area={area} items={breadcrumbItems} />
              </div>
            ) : null}

            {children ?? (
              <Outlet />
            )}

            {shouldShowBottomNav ? (
              <BottomNav
                area={area}
                userRoles={userRoles}
                activeRoleContexts={activeRoleContexts}
                currentRoleContext={currentRoleContext}
                onSelectRole={onSelectRole}
                displayName={displayName}
              />
            ) : null}
          </LoadingBoundary>

          <GlobalSearch
            open={searchOpen}
            onOpenChange={setSearchOpen}
            loading={searchLoading ?? false}
            errorMessage={searchError}
            results={searchResults}
            allowedScopes={searchScopes}
            onQueryChange={onSearchQueryChange ?? (() => {})}
            authenticated={authenticated}
          />
          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
            authenticated={authenticated}
            areaItems={commandItems ?? []}
          />
          <NotificationCenter
            open={notificationOpen}
            onOpenChange={setNotificationOpen}
            items={notifications}
            loading={false}
            authenticated={authenticated}
            onMarkRead={onMarkNotificationRead ?? (() => {})}
            onMarkAllRead={onMarkAllNotificationsRead ?? (() => {})}
            onDismiss={onDismissNotification ?? (() => {})}
          />
        </div>
      </GlobalErrorBoundary>
    </ShellProvider>
  );
}
