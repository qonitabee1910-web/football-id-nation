import { ChevronsUpDown, Shield, Users, Building2, Landmark, Crown, ShieldAlert, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AreaKey, RoleKey } from "../types";

const ROLE_META: Record<RoleKey, {
  readonly label: string;
  readonly area: AreaKey;
  readonly icon: typeof Shield;
  readonly description: string;
}> = {
  PLAYER: { label: "Pemain", area: "player", icon: Shield, description: "Akses Pemain" },
  GUARDIAN: { label: "Wali", area: "guardian", icon: Users, description: "Akses Wali Pemain" },
  ORG_ADMIN: { label: "Admin Klub", area: "organization", icon: Building2, description: "Administrasi Klub" },
  COACH: { label: "Pelatih", area: "organization", icon: Building2, description: "Akses Pelatih" },
  ASSOCIATION_OFFICER: { label: "Petugas Asosiasi", area: "association", icon: Landmark, description: "Akses Asosiasi" },
  VERIFICATION_AUTH: { label: "Otoritas Verifikasi", area: "association", icon: ShieldAlert, description: "Kewenangan Verifikasi" },
  DATA_STEWARD: { label: "Pengelola Data", area: "association", icon: SearchCheck, description: "Pengelolaan Data" },
  FEDERATION_OFFICER: { label: "Petugas Federasi", area: "federation", icon: Crown, description: "Akses Federasi" },
  PRIVACY_OFFICER: { label: "Petugas Privasi", area: "federation", icon: ShieldAlert, description: "Kewenangan Privasi" },
  CHILD_PROTECTION_OFFICER: { label: "Petugas Perlindungan Anak", area: "federation", icon: ShieldAlert, description: "Perlindungan Anak" },
  SCOUT: { label: "Pencari Bakat", area: "organization", icon: SearchCheck, description: "Akses Pencari Bakat" },
  SYSTEM_AUDITOR: { label: "Auditor Sistem", area: "federation", icon: SearchCheck, description: "Akses Audit" },
};

export interface RoleContextSwitcherProps {
  readonly activeRoleContexts: readonly RoleKey[];
  readonly currentRoleContext: RoleKey | null;
  readonly onSelect: (role: RoleKey) => void;
  readonly displayName: string | null;
  readonly className?: string;
}

export function RoleContextSwitcher({
  activeRoleContexts,
  currentRoleContext,
  onSelect,
  displayName,
  className,
}: RoleContextSwitcherProps) {
  if (activeRoleContexts.length === 0) {
    return null;
  }

  const current = currentRoleContext ? ROLE_META[currentRoleContext] : null;
  const CurrentIcon = current?.icon ?? Shield;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto w-full justify-start gap-2 p-2",
            className,
          )}
          aria-label={
            current
              ? `Konteks peran saat ini: ${current.label}. Buka pengalih peran`
              : "Buka pengalih peran"
          }
        >
          <div className="flex items-center gap-3 overflow-hidden text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CurrentIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              {displayName ? (
                <p className="truncate text-sm font-medium text-foreground">
                  {displayName}
                </p>
              ) : null}
              <p className="truncate text-xs text-muted-foreground">
                {current?.label ?? "Pilih peran"}
              </p>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64"
        role="menu"
        aria-label="Pengalihan konteks peran"
      >
        <DropdownMenuLabel>Konteks Peran</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeRoleContexts.map((roleKey) => {
          const meta = ROLE_META[roleKey];
          const Icon = meta.icon;
          const selected = currentRoleContext === roleKey;
          return (
            <DropdownMenuItem
              key={roleKey}
              onClick={() => onSelect(roleKey)}
              role="menuitemradio"
              aria-checked={selected}
              data-selected={selected}
              className="gap-3"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{meta.label}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {meta.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
