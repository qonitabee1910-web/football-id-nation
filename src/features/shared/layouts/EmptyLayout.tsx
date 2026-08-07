import { type ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { GlobalErrorBoundary } from "@/components/domain/error/GlobalErrorBoundary";
import { LoadingBoundary } from "@/components/domain/loading/LoadingBoundary";
import { cn } from "@/lib/utils";

export interface EmptyLayoutProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly centreContent?: boolean;
  readonly maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidthClass: Record<NonNullable<EmptyLayoutProps["maxWidth"]>, string> = {
  sm: "max-w-[768px]",
  md: "max-w-[768px] lg:max-w-[1024px]",
  lg: "max-w-[1024px] xl:max-w-[1280px]",
  xl: "max-w-[1280px]",
  full: "max-w-none",
};

export function EmptyLayout({
  children,
  className,
  centreContent = false,
  maxWidth = "lg",
}: EmptyLayoutProps) {
  return (
    <GlobalErrorBoundary isStructural>
      <div
        className={cn(
          "flex min-h-screen w-full flex-col bg-background text-foreground antialiased",
          className,
        )}
      >
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className={cn(
            "flex min-h-0 flex-1 flex-col px-4 py-6 md:px-6 md:py-8",
            centreContent && "items-center justify-center",
          )}
        >
          <LoadingBoundary>
            <div
              className={cn(
                "mx-auto w-full",
                centreContent ? maxWidthClass[maxWidth] : maxWidthClass[maxWidth],
              )}
            >
              {children ?? <Outlet />}
            </div>
          </LoadingBoundary>
        </main>
      </div>
    </GlobalErrorBoundary>
  );
}
