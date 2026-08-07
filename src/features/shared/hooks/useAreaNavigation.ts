import { useMemo } from "react";
import {
  LayoutDashboard,
  User,
  IdCard,
  Route,
  Users,
  Activity,
  ShieldCheck,
  Bell,
  Settings,
  Link2,
  Search,
  UserCog,
  Shield,
  FileCheck,
  ArrowLeftRight,
  CopyPlus,
  FileText,
  BarChart3,
  History,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { AreaKey, AreaNavConfig, NavItem, RoleKey } from "../types";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  User,
  IdCard,
  Route,
  Users,
  Activity,
  ShieldCheck,
  Bell,
  Settings,
  Link2,
  Search,
  UserCog,
  Shield,
  FileCheck,
  ArrowLeftRight,
  CopyPlus,
  FileText,
  BarChart3,
  History,
  AlertTriangle,
};

interface NavItemSpec {
  readonly id: string;
  readonly label: string;
  readonly to: string;
  readonly icon: keyof typeof iconMap;
  readonly order: number;
  readonly roles?: readonly RoleKey[];
  readonly bottomNav?: boolean;
}

const AREA_SPECS: Record<Exclude<AreaKey, "system">, {
  readonly homeTo: string;
  readonly items: readonly NavItemSpec[];
}> = {
  public: {
    homeTo: "/",
    items: [],
  },
  player: {
    homeTo: "/player/",
    items: [
      { id: "ply-dashboard", label: "Dashboard", to: "/player/", icon: "LayoutDashboard", order: 1, bottomNav: true },
      { id: "ply-profile", label: "Profil", to: "/player/profile", icon: "User", order: 2 },
      { id: "ply-identity", label: "Identitas Sepak Bola", to: "/player/identity", icon: "IdCard", order: 3 },
      { id: "ply-journey", label: "Perjalanan", to: "/player/journey", icon: "Route", order: 4 },
      { id: "ply-membership", label: "Keanggotaan", to: "/player/membership", icon: "Users", order: 5 },
      { id: "ply-activities", label: "Aktivitas", to: "/player/activities", icon: "Activity", order: 6, bottomNav: true },
      { id: "ply-consent", label: "Persetujuan", to: "/player/consent", icon: "ShieldCheck", order: 7 },
      { id: "ply-verification", label: "Verifikasi", to: "/player/verification", icon: "FileCheck", order: 8 },
      { id: "ply-notifications", label: "Notifikasi", to: "/player/notifications", icon: "Bell", order: 9, bottomNav: true },
      { id: "ply-settings", label: "Pengaturan", to: "/player/settings", icon: "Settings", order: 10 },
    ],
  },
  guardian: {
    homeTo: "/guardian/",
    items: [
      { id: "grd-dashboard", label: "Dashboard", to: "/guardian/", icon: "LayoutDashboard", order: 1, bottomNav: true },
      { id: "grd-players", label: "Anak Asuh", to: "/guardian/players", icon: "Users", order: 2, bottomNav: true },
      { id: "grd-link-request", label: "Permintaan Tautan", to: "/guardian/link-request", icon: "Link2", order: 3 },
      { id: "grd-notifications", label: "Notifikasi", to: "/guardian/notifications", icon: "Bell", order: 4, bottomNav: true },
      { id: "grd-settings", label: "Pengaturan", to: "/player/settings", icon: "Settings", order: 5 },
    ],
  },
  organization: {
    homeTo: "/org/",
    items: [
      { id: "org-dashboard", label: "Dashboard", to: "/org/", icon: "LayoutDashboard", order: 1, bottomNav: true },
      { id: "org-players", label: "Direktori Pemain", to: "/org/players", icon: "Users", order: 2, bottomNav: true },
      { id: "org-memberships", label: "Keanggotaan", to: "/org/memberships", icon: "UserCog", order: 3 },
      { id: "org-transfer", label: "Transfer & Promosi", to: "/org/transfer", icon: "ArrowLeftRight", order: 4 },
      { id: "org-activity", label: "Aktivitas", to: "/org/activity", icon: "Activity", order: 5, bottomNav: true },
      { id: "org-verification-queue", label: "Antrian Verifikasi", to: "/org/verification-queue", icon: "FileCheck", order: 6, bottomNav: true },
    ],
  },
  association: {
    homeTo: "/assoc/",
    items: [
      { id: "asc-dashboard", label: "Dashboard", to: "/assoc/", icon: "LayoutDashboard", order: 1 },
      { id: "asc-identity-admin", label: "Admin ID Sepak Bola", to: "/assoc/identity-admin", icon: "IdCard", order: 2 },
      { id: "asc-verification", label: "Verifikasi", to: "/assoc/verification", icon: "ShieldCheck", order: 3 },
      { id: "asc-transfers", label: "Tinjauan Transfer", to: "/assoc/transfers", icon: "ArrowLeftRight", order: 4 },
      { id: "asc-duplicates", label: "Resolusi Duplikat", to: "/assoc/duplicates", icon: "CopyPlus", order: 5, roles: ["DATA_STEWARD"] },
      { id: "asc-policies", label: "Pemantauan Kebijakan", to: "/assoc/policies", icon: "FileText", order: 6 },
    ],
  },
  federation: {
    homeTo: "/fed/",
    items: [
      { id: "fed-dashboard", label: "Dashboard", to: "/fed/", icon: "LayoutDashboard", order: 1 },
      { id: "fed-directory", label: "Direktori & Siklus", to: "/fed/directory", icon: "Users", order: 2, roles: ["FEDERATION_OFFICER", "PRIVACY_OFFICER", "CHILD_PROTECTION_OFFICER"] },
      { id: "fed-policies", label: "Administrasi Kebijakan", to: "/fed/policies", icon: "FileText", order: 3, roles: ["FEDERATION_OFFICER"] },
      { id: "fed-analytics", label: "Analitik", to: "/fed/analytics", icon: "BarChart3", order: 4 },
      { id: "fed-audit", label: "Audit", to: "/fed/audit", icon: "History", order: 5, roles: ["FEDERATION_OFFICER", "PRIVACY_OFFICER", "CHILD_PROTECTION_OFFICER"] },
      { id: "fed-search", label: "Pencarian Nasional", to: "/fed/search", icon: "Search", order: 6 },
      { id: "fed-events", label: "Buku Besar Peristiwa", to: "/fed/events", icon: "Route", order: 7, roles: ["FEDERATION_OFFICER", "SYSTEM_AUDITOR"] },
      { id: "fed-revocation-review", label: "Tinjauan Pencabutan", to: "/fed/revocation-review", icon: "AlertTriangle", order: 8, roles: ["CHILD_PROTECTION_OFFICER"] },
    ],
  },
};

export interface UseAreaNavigationOptions {
  readonly userRoles?: readonly RoleKey[];
}

export function useAreaNavigation(
  area: AreaKey,
  options: UseAreaNavigationOptions = {},
): AreaNavConfig | null {
  const { userRoles = [] } = options;

  return useMemo<AreaNavConfig | null>(() => {
    if (area === "system") {
      return {
        area: "system",
        homeTo: "/",
        items: [],
      };
    }

    const spec = AREA_SPECS[area];
    if (!spec) return null;

    const items: NavItem[] = spec.items
      .filter((item) => {
        if (!item.roles) return true;
        return item.roles.some((r) => userRoles.includes(r));
      })
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        id: item.id,
        label: item.label,
        to: item.to,
        icon: iconMap[item.icon],
        area,
        ariaLabel: `Navigasi ke ${item.label}`,
        order: item.order,
      }));

    const bottomNavIds = spec.items
      .filter((i) => i.bottomNav === true)
      .map((i) => i.id);

    return {
      area,
      homeTo: spec.homeTo,
      items,
      bottomNavIds,
    };
  }, [area, userRoles]);
}

export function maskDisplayCode(fullCode: string | null | undefined): string {
  if (!fullCode) return "••••-••";
  const clean = fullCode.replace(/[^A-Z0-9]/gi, "");
  if (clean.length < 6) return "••••-••";
  const last2 = clean.slice(-2);
  const checksum = clean.slice(-6, -4);
  return `••••-${checksum}${last2}`;
}
