import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "main" | "section" | "article";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidthClasses: Record<NonNullable<PageContainerProps["maxWidth"]>, string> = {
  sm: "max-w-[768px]",
  md: "max-w-[768px] lg:max-w-[1024px]",
  lg: "max-w-[1024px] xl:max-w-[1280px]",
  xl: "max-w-[1280px]",
  full: "max-w-none",
};

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, as: Comp = "div", maxWidth = "xl", ...props }, ref) => {
    return (
      <Comp
        ref={ref as never}
        className={cn(
          "mx-auto w-full",
          "px-4 md:px-6 xl:px-8",
          "py-6 md:py-8",
          maxWidth === "xl"
            ? "max-w-full md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]"
            : maxWidthClasses[maxWidth],
          className,
        )}
        {...props}
      />
    );
  },
);
PageContainer.displayName = "PageContainer";
