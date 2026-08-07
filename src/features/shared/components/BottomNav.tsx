import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Home, Users, Activity, Bell, FileText } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarSeparator } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { type ReactNode, useMemo } from "react";
import type { AreaKey, AreaNavConfig, RoleKey } from "../types";
import { useAreaNavigation } from "../hooks/useAreaNavigation";
import { RoleContextSwitcher } from "./RoleContextSwitcher";

const AREA_HOME_ICON: Record<AreaKey, LucideIcon> = {
  public: Home,
  player: Home,
  guardian: Users,
  organization: FileText,
  association: FileText,
  federation: FileText,
  system: Home,
};

export interface BottomNavProps {
  readonly area: AreaKey;
  readonly userRoles?: readonly RoleKey[];
  readonly activeRoleContexts?: readonly RoleKey[];
  readonly currentRoleContext?: RoleKey | null;
  readonly onSelectRole?: (role: RoleKey) => void;
  readonly displayName?: string | null;
  readonly extraActions?: ReactNode;
  readonly className?: string;
}

export function BottomNav({
  area,
  userRoles,
  activeRoleContexts = [],
  currentRoleContext,
  onSelectRole,
  displayName,
  extraActions,
  className,
}: BottomNavProps) {
  const navConfig = useAreaNavigation(area, { userRoles });
  const location = useLocation();

  const visibleItems = useMemo(() => {
    if (!navConfig) return [];
    if (!navConfig.bottomNavIds || navConfig.bottomNavIds.length === 0) {
      return navConfig.items.slice(0, 4);
    }
    return navConfig.bottomNavIds
      .map((id) => navConfig.items.find((i) => i.id === id))
      .filter((v): v is AreaNavConfig["items"][number] => v !== undefined)
      .slice(0, 4);
  }, [navConfig]);

  if (area === "public" || area === "system") {
    return null;
  }

  const HomeIcon = AREA_HOME_ICON[area];
  const menuItems = navConfig?.items ?? [];

  return (
    <nav
      aria-label="Navigasi bawah"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden",
        className,
      )}
    >
      <Sheet>
        <ul className="grid grid-cols-5 items-stretch">
          <li className="contents">
            <Link
              to={navConfig?.homeTo ?? "/"}
              className={cn(
                "flex h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                location.pathname === navConfig?.homeTo
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={location.pathname === navConfig?.homeTo ? "page" : undefined}
            >
              <HomeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Beranda</span>
            </Link>
          </li>

          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to.length > 1 && location.pathname.startsWith(item.to));
            return (
              <li key={item.id} className="contents">
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="truncate max-w-[64px]">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {visibleItems.length < 4 ? (
            <li className="contents">
              <a
                href="/player/notifications"
                className={cn(
                  "flex h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground",
                )}
                aria-label="Notifikasi"
              >
                <Bell className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>Notifikasi</span>
              </a>
            </li>
          ) : null}

          <li className="contents">
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 flex-col gap-0.5 rounded-none px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                aria-label="Buka menu navigasi"
                aria-haspopup="dialog"
              >
                <Menu className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>Menu</span>
              </Button>
            </SheetTrigger>
          </li>
        </ul>

        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-2xl px-0 pb-0"
          aria-label="Menu navigasi"
        >
          <SheetHeader className="border-b px-4 pb-3 pt-4">
            <SheetTitle className="text-left">Menu Navigasi</SheetTitle>
            {activeRoleContexts.length > 0 ? (
              <div className="pt-2">
                <RoleContextSwitcher
                  activeRoleContexts={activeRoleContexts}
                  currentRoleContext={currentRoleContext ?? null}
                  onSelect={onSelectRole ?? (() => {})}
                  displayName={displayName ?? null}
                />
              </div>
            ) : null}
          </SheetHeader>
          <div className="px-2 py-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.to ||
                  (item.to.length > 1 && location.pathname.startsWith(item.to));
                return (
                  <li key={item.id}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-accent/60",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {extraActions ? (
              <>
                <SidebarSeparator className="my-3" />
                <div className="space-y-2 px-1">{extraActions}</div>
              </>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
