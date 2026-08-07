import { AppShell, type AppShellProps } from "../components/AppShell";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import type { ReactNode } from "react";
import type { AreaKey } from "../types";

export interface DashboardLayoutProps
  extends Omit<AppShellProps, "children"> {
  readonly children?: ReactNode;
  readonly maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  readonly mainClassName?: string;
}

export function DashboardLayout({
  children,
  maxWidth = "xl",
  mainClassName,
  ...shellProps
}: DashboardLayoutProps) {
  const isMobileArea = shellProps.area !== "public" && shellProps.area !== "system";

  return (
    <AppShell
      {...shellProps}
      {...(mainClassName ? { className: mainClassName } : {})}
    >
      <PageContainer
        as="main"
        id="main-content"
        maxWidth={maxWidth}
        tabIndex={-1}
        className={
          isMobileArea ? "pb-20 md:pb-8" : undefined
        }
      >
        {children ?? <DashboardOutletPlaceholder area={shellProps.area} />}
      </PageContainer>
    </AppShell>
  );
}

function DashboardOutletPlaceholder({ area }: { readonly area: AreaKey }) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center"
      role="region"
      aria-label={`Konten area ${area}`}
    >
      <p className="text-sm font-medium text-foreground">
        Area <span className="uppercase">{area}</span> siap digunakan
      </p>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Konten bisnis untuk Sprint 1 akan di-render di dalam wadah ini setelah persetujuan
        arsitektur. Tidak ada data dummy atau placeholder bisnis yang di-render pada Sprint 0.
      </p>
    </div>
  );
}
