import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CONTENT_RADIUS = "rounded-lg";

export interface ContentContainerProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg" | "none";
  withShadow?: boolean;
  withBorder?: boolean;
}

const paddingClasses: Record<NonNullable<ContentContainerProps["padding"]>, string> = {
  sm: "p-3 md:p-4",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
  none: "",
};

export const ContentContainer = forwardRef<HTMLDivElement, ContentContainerProps>(
  ({
    className,
    padding = "md",
    withShadow = true,
    withBorder = true,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          CONTENT_RADIUS,
          "bg-card text-card-foreground",
          withShadow && "shadow-sm",
          withBorder && "border border-border",
          paddingClasses[padding],
          className,
        )}
        {...props}
      />
    );
  },
);
ContentContainer.displayName = "ContentContainer";
