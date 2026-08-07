import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { AreaKey } from "../types";
import { useAreaNavigation, maskDisplayCode } from "../hooks/useAreaNavigation";

export interface AreaBreadcrumbProps {
  readonly area: AreaKey;
  readonly items?: readonly CrumbOverride[];
  readonly className?: string;
}

export interface CrumbOverride {
  readonly label: string;
  readonly to?: string;
  readonly sensitive?: boolean;
  readonly displayValue?: string | null;
}

const AREA_CRUMB_HOME: Record<AreaKey, { label: string; to: string }> = {
  public: { label: "Beranda", to: "/" },
  player: { label: "Pemain", to: "/player/" },
  guardian: { label: "Wali", to: "/guardian/" },
  organization: { label: "Klub", to: "/org/" },
  association: { label: "Asosiasi", to: "/assoc/" },
  federation: { label: "Federasi", to: "/fed/" },
  system: { label: "Beranda", to: "/" },
};

function navigateUp(locationPath: string, homeTo: string): string | null {
  const segments = locationPath.split("/").filter(Boolean);
  if (segments.length <= 1) return null;
  if (locationPath.endsWith("/")) {
    segments.pop();
  }
  segments.pop();
  if (segments.length === 0) return homeTo;
  return "/" + segments.join("/") + "/";
}

export function AreaBreadcrumb({ area, items, className }: AreaBreadcrumbProps) {
  const nav = useAreaNavigation(area);
  const location = useLocation();
  const isMobile = useIsMobile();
  const homeMeta = AREA_CRUMB_HOME[area];

  const crumbs = useMemo(() => {
    const normalized: { label: string; to?: string; sensitive: boolean; displayValue: string | null }[] = [];
    normalized.push({ label: homeMeta.label, to: homeMeta.to, sensitive: false, displayValue: null });
    if (items && items.length > 0) {
      for (const i of items) {
        normalized.push({
          label: i.label,
          to: i.to,
          sensitive: i.sensitive ?? false,
          displayValue: i.displayValue ?? null,
        });
      }
      return normalized;
    }
    if (!nav) return normalized;
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const matchingItem = nav.items.find((i) => location.pathname === i.to || (i.to.length > 1 && location.pathname.startsWith(i.to)));
    if (matchingItem) {
      normalized.push({ label: matchingItem.label, to: matchingItem.to, sensitive: false, displayValue: null });
    } else if (pathSegments.length > 1) {
      const dynamicLabel = pathSegments[pathSegments.length - 1];
      if (dynamicLabel) {
        normalized.push({
          label: AREA_DETAIL_LABELS[dynamicLabel] ?? "Detail",
          sensitive: DYNAMIC_SEGMENTS.has(dynamicLabel),
          displayValue: DYNAMIC_SEGMENTS.has(dynamicLabel) ? maskDisplayCode(null) : null,
        });
      }
    }
    return normalized;
  }, [area, items, nav, location.pathname, homeMeta]);

  if (crumbs.length < 2) {
    return null;
  }

  const upTarget = navigateUp(location.pathname, homeMeta.to);

  if (isMobile) {
    const prevCrumb = crumbs.length >= 2 ? crumbs[crumbs.length - 2] : null;
    return (
      <div className={cn("flex items-center", className)} aria-label="Navigasi hierarkis">
        {upTarget ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 gap-1 px-2"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <Link to={upTarget}>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">
                {prevCrumb ? prevCrumb.label : "Kembali"}
              </span>
            </Link>
          </Button>
        ) : (
          <span className="sr-only">Tingkat hierarki navigasi: atas</span>
        )}
      </div>
    );
  }

  const shouldCollapse = crumbs.length > 6;
  const secondLast = crumbs.length >= 2 ? crumbs[crumbs.length - 2] : null;
  const lastCrumb = crumbs.length >= 1 ? crumbs[crumbs.length - 1] : null;
  const visibleCrumbs = shouldCollapse && secondLast && lastCrumb
    ? [crumbs[0], secondLast, lastCrumb]
    : crumbs;
  const hiddenCrumbs = shouldCollapse ? crumbs.slice(1, -2) : [];

  return (
    <Breadcrumb className={className} aria-label="Navigasi hierarkis">
      <BreadcrumbList>
        {visibleCrumbs.map((crumb, idx) => {
          const isLast = idx === visibleCrumbs.length - 1;
          const insertEllipsis = shouldCollapse && idx === 0 && hiddenCrumbs.length > 0;
          const renderedLabel = crumb.sensitive ? maskDisplayCode(crumb.displayValue) : crumb.label;
          return (
            <div key={`${crumb.label}-${idx}`} className="contents">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="min-h-[44px] py-1">{renderedLabel}</BreadcrumbPage>
                ) : crumb.to ? (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to} className="min-h-[44px] py-1">
                      {renderedLabel}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="min-h-[44px] py-1 text-muted-foreground">{renderedLabel}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {insertEllipsis ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <BreadcrumbEllipsis role="button" tabIndex={0} aria-label="Lebih banyak tingkatan" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {hiddenCrumbs.map((hc, hIdx) =>
                          hc.to ? (
                            <DropdownMenuItem key={`hc-${hIdx}`} asChild>
                              <Link to={hc.to}>{hc.sensitive ? maskDisplayCode(hc.displayValue) : hc.label}</Link>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem key={`hc-${hIdx}`} disabled>
                              {hc.sensitive ? maskDisplayCode(hc.displayValue) : hc.label}
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                </>
              ) : null}
              {!isLast ? <BreadcrumbSeparator /> : null}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const DYNAMIC_SEGMENTS = new Set([
  "consent",
  "verification",
  "annotate",
]);

const AREA_DETAIL_LABELS: Record<string, string> = {
  consent: "Persetujuan",
  verification: "Verifikasi",
  annotate: "Catatan",
  notifications: "Notifikasi",
  settings: "Pengaturan",
  transfer: "Transfer",
  activity: "Aktivitas",
  players: "Pemain",
  policies: "Kebijakan",
  analytics: "Analitik",
  audit: "Audit",
  search: "Pencarian",
  events: "Peristiwa",
  directory: "Direktori",
  "revocation-review": "Tinjauan Pencabutan",
  duplicates: "Duplikat",
  "verification-queue": "Antrian Verifikasi",
  "identity-admin": "Admin ID",
  memberships: "Keanggotaan",
  membership: "Keanggotaan",
  journey: "Perjalanan",
  activities: "Aktivitas",
  profile: "Profil",
  identity: "Identitas",
  "link-request": "Permintaan Tautan",
  recovery: "Pemulihan",
};
