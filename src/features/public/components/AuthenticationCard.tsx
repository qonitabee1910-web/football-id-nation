import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AuthenticationCardProps {
  readonly titleId: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly className?: string;
  /** Hide the title visually when the surrounding layout already renders it. */
  readonly visuallyHiddenTitle?: boolean;
}

export function AuthenticationCard({
  titleId,
  title,
  description,
  children,
  footer,
  className,
  visuallyHiddenTitle = false,
}: AuthenticationCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <h2
          id={titleId}
          className={cn(
            "text-xl font-semibold leading-none tracking-tight",
            visuallyHiddenTitle && "sr-only",
          )}
        >
          {title}
        </h2>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {children}
        {footer ? (
          <div className="border-t pt-4 text-sm text-muted-foreground">{footer}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export interface FormSectionProps {
  readonly legend: string;
  readonly hint?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function FormSection({ legend, hint, children, className }: FormSectionProps) {
  return (
    <fieldset className={cn("border-0 p-0", className)}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p aria-hidden="true" className="text-sm font-semibold tracking-tight">
            {legend}
          </p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {children}
      </div>
    </fieldset>
  );
}
