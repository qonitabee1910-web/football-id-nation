import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ResponsiveGridColumns = 1 | 2 | 3 | 4 | 6;

export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: {
    base?: ResponsiveGridColumns;
    md?: ResponsiveGridColumns;
    lg?: ResponsiveGridColumns;
    xl?: ResponsiveGridColumns;
    xxl?: ResponsiveGridColumns;
  };
  gap?: "sm" | "md" | "lg" | "xl";
}

const colMap: Record<ResponsiveGridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
};

const mdColMap: Record<ResponsiveGridColumns, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
};

const lgColMap: Record<ResponsiveGridColumns, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
};

const xlColMap: Record<ResponsiveGridColumns, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  6: "xl:grid-cols-6",
};

const xxlColMap: Record<ResponsiveGridColumns, string> = {
  1: "2xl:grid-cols-1",
  2: "2xl:grid-cols-2",
  3: "2xl:grid-cols-3",
  4: "2xl:grid-cols-4",
  6: "2xl:grid-cols-6",
};

const gapMap: Record<NonNullable<ResponsiveGridProps["gap"]>, string> = {
  sm: "gap-3 md:gap-4",
  md: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
  xl: "gap-8 md:gap-10",
};

export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  (
    { className, cols = { base: 1, md: 2, lg: 3, xl: 4, xxl: 4 }, gap = "md", ...props },
    ref,
  ) => {
    const { base = 1, md = 2, lg = 3, xl = 4, xxl = 4 } = cols;

    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full",
          colMap[base],
          mdColMap[md],
          lgColMap[lg],
          xlColMap[xl],
          xxlColMap[xxl],
          gapMap[gap],
          className,
        )}
        {...props}
      />
    );
  },
);
ResponsiveGrid.displayName = "ResponsiveGrid";
