import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CONTENT_RADIUS = "rounded-lg";

export interface ContentContainerProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg" | "none";
  withShadow?: boolean;
  withBorder?: boolean;
  variant?: "default" | "outlined" | "elevated";
}

const paddingClasses: Record<NonNullable<ContentContainerProps["padding"]>, string> = {
  sm: "p-3 md:p-4",
  md: "p-4 md:p-6",
  lg: "p-6 md:p-8",
  none: "",
};

const variantClasses: Record<NonNullable<ContentContainerProps["variant"]>, string> = {
  default: "shadow-sm border border-border",
  outlined: "border border-border",
  elevated: "shadow-md border border-border",
};

export const ContentContainer = forwardRef<HTMLDivElement, ContentContainerProps>(
  ({
    className,
    padding = "md",
    withShadow,
    withBorder,
    variant = "default",
    ...props
  }, ref) => {
    const useShadow = withShadow ?? (variant === "default" || variant === "elevated");
    const useBorder = withBorder ?? (variant === "outlined" || variant === "elevated" || variant === "default");
    return (
      <div
        ref={ref}
        className={cn(
          CONTENT_RADIUS,
          "bg-card text-card-foreground",
          useShadow && "shadow-sm",
          variant === "elevated" && "shadow-md",
          useBorder && "border border-border",
          paddingClasses[padding],
          className,
        )}
        {...props}
      />
    );
  },
);
ContentContainer.displayName = "ContentContainer";
