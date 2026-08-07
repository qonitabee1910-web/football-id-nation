import type { LucideIcon } from "lucide-react";

export type AreaKey =
  | "public"
  | "player"
  | "guardian"
  | "organization"
  | "association"
  | "federation"
  | "system";

export type RoleKey =
  | "PLAYER"
  | "GUARDIAN"
  | "ORG_ADMIN"
  | "COACH"
  | "ASSOCIATION_OFFICER"
  | "VERIFICATION_AUTH"
  | "DATA_STEWARD"
  | "FEDERATION_OFFICER"
  | "PRIVACY_OFFICER"
  | "CHILD_PROTECTION_OFFICER"
  | "SCOUT"
  | "SYSTEM_AUDITOR";

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly to: string;
  readonly icon?: LucideIcon;
  readonly area: AreaKey;
  readonly ariaLabel: string;
  readonly order: number;
}

export interface AreaNavConfig {
  readonly area: AreaKey;
  readonly homeTo: string;
  readonly items: readonly NavItem[];
  readonly bottomNavIds?: readonly string[];
}

export interface CrumbItem {
  readonly label: string;
  readonly to?: string;
  readonly masked?: boolean;
}

export interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: LucideIcon;
  readonly group: string;
  readonly onSelect: () => void;
}

export interface NotificationItem {
  readonly id: string;
  readonly type: "info" | "success" | "warning" | "danger";
  readonly title: string;
  readonly message?: string;
  readonly timestamp: string;
  readonly read: boolean;
  readonly action?: {
    readonly label: string;
    readonly to: string;
  };
}

export interface ShellContextValue {
  readonly activeArea: AreaKey | null;
  readonly setActiveArea: (area: AreaKey | null) => void;
  readonly sidebarOpen: boolean;
  readonly setSidebarOpen: (open: boolean) => void;
  readonly toggleSidebar: () => void;
}

export interface PersonContextValue {
  readonly personRef: string | null;
  readonly displayName: string | null;
  readonly displayCode: string | null;
  readonly activeRoleContexts: readonly RoleKey[];
  readonly currentRoleContext: RoleKey | null;
}
