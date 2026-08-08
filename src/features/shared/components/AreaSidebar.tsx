import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Shield, HelpCircle, FileText } from "lucide-react";
import { CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { AreaNavConfig, RoleKey } from "../types";
import { useAreaNavigation } from "../hooks/useAreaNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { RoleContextSwitcher } from "./RoleContextSwitcher";

export interface AreaSidebarProps {
  readonly area: AreaNavConfig["area"];
  readonly userRoles?: readonly RoleKey[];
  readonly activeRoleContexts?: readonly RoleKey[];
  readonly currentRoleContext?: RoleKey | null;
  readonly onSelectRole?: (role: RoleKey) => void;
  readonly displayName?: string | null;
  readonly displayCode?: string | null;
  readonly children?: ReactNode;
  readonly className?: string;
}

function IdentityStrip({
  displayName,
  displayCode,
  activeRoleContexts,
  currentRoleContext,
  onSelectRole,
}: {
  readonly displayName?: string | null;
  readonly displayCode?: string | null;
  readonly activeRoleContexts: readonly RoleKey[];
  readonly currentRoleContext?: RoleKey | null;
  readonly onSelectRole?: (role: RoleKey) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
          aria-hidden="true"
        >
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            Football ID Nation
          </p>
          {displayCode ? (
            <p
              className="truncate font-mono text-xs text-sidebar-foreground/60"
              title={displayCode}
            >
              {displayCode}
            </p>
          ) : null}
        </div>
      </div>
      <RoleContextSwitcher
        activeRoleContexts={activeRoleContexts}
        currentRoleContext={currentRoleContext ?? null}
        onSelect={onSelectRole ?? (() => {})}
        displayName={displayName ?? null}
      />
    </div>
  );
}

function NavItem({
  item,
  currentPath,
}: {
  readonly item: AreaNavConfig["items"][number];
  readonly currentPath: string;
}) {
  const { state } = useSidebar();
  const Icon = item.icon ?? CircleDot;
  const exactMatch = currentPath === item.to;
  const prefixMatch = !exactMatch && item.to.length > 1 && currentPath.startsWith(item.to);
  const isActive = exactMatch || prefixMatch;

  const button = (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      aria-current={isActive ? "page" : undefined}
      tooltip={item.label}
    >
      <Link to={item.to} aria-label={item.ariaLabel} className="min-h-[44px]">
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    </SidebarMenuButton>
  );

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="text-sm">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    );
  }

  return <SidebarMenuItem>{button}</SidebarMenuItem>;
}

export function AreaSidebar({
  area,
  userRoles,
  activeRoleContexts = [],
  currentRoleContext,
  onSelectRole,
  displayName,
  displayCode,
  children,
  className,
}: AreaSidebarProps) {
  const navConfig = useAreaNavigation(area, { userRoles });
  const location = useLocation();

  if (!navConfig) {
    return <SidebarInset className={className}>{children}</SidebarInset>;
  }

  const isPublic = area === "public";
  const isSystem = area === "system";

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={!isPublic && !isSystem}>
        <div className={cn("flex min-h-screen w-full bg-background", className)}>
          {!isPublic && !isSystem ? (
            <Sidebar
              collapsible="icon"
              className="hidden border-r md:flex"
              aria-label={`Navigasi area ${area}`}
            >
              <SidebarHeader className="gap-0 pb-4">
                <IdentityStrip
                  displayName={displayName}
                  displayCode={displayCode}
                  activeRoleContexts={activeRoleContexts}
                  currentRoleContext={currentRoleContext}
                  onSelectRole={onSelectRole}
                />
              </SidebarHeader>
              <SidebarSeparator />
              <SidebarContent>
                <SidebarMenu>
                  {navConfig.items.map((item) => (
                    <NavItem key={item.id} item={item} currentPath={location.pathname} />
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="gap-2">
                <Separator />
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex items-center gap-1">
                    <a
                      href="/legal"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      aria-label="Ketentuan hukum dan kebijakan"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <a
                      href="mailto:support@football-id.example"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      aria-label="Dukungan"
                    >
                      <HelpCircle className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <ThemeToggle variant="icon" size="sm" />
                </div>
              </SidebarFooter>
            </Sidebar>
          ) : null}
          <SidebarInset className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:h-16 md:px-4">
              <div className="flex items-center gap-2">
                {!isPublic && !isSystem ? <SidebarTrigger className="md:hidden" /> : null}
                <div className="flex items-center gap-2 md:hidden">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold">Football ID</span>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                {children}
                {isPublic || isSystem ? <ThemeToggle variant="icon" size="sm" /> : null}
              </div>
            </header>
            <main id="main-content" role="main" className="flex min-h-0 flex-1 flex-col">
              {/* Outlet placeholder handled by parent layout */}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
