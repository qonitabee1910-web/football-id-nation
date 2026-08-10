import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AuthenticationCardProps {
  readonly titleId: string;
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly className?: string;
}

export function AuthenticationCard({
  titleId,
  title,
  description,
  children,
  footer,
  className,
}: AuthenticationCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle asChild>
          <h2 id={titleId} className="text-xl font-semibold leading-none tracking-tight">
            {title}
          </h2>
        </CardTitle>
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
    <fieldset className={cn("flex flex-col gap-4 border-0 p-0", className)}>
      <legend className="text-sm font-semibold tracking-tight">{legend}</legend>
      {hint ? <p className="-mt-2 text-xs text-muted-foreground">{hint}</p> : null}
      {children}
    </fieldset>
  );
}
