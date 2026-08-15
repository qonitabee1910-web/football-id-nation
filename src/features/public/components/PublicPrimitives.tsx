import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------- PublicSection */

export interface PublicSectionProps {
  /** id of the heading this section is labelled by */
  readonly labelledBy: string;
  readonly children: ReactNode;
  readonly maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  readonly bordered?: boolean;
  readonly className?: string;
  readonly innerClassName?: string;
}

/**
 * Single source of vertical rhythm for the public surface.
 * Every landing section uses this so spacing and container width stay
 * identical across breakpoints (375 / 768 / 1024 / 1440 / 1920).
 */
export function PublicSection({
  labelledBy,
  children,
  maxWidth = "xl",
  bordered = true,
  className,
  innerClassName,
}: PublicSectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("py-12 md:py-16 lg:py-20", bordered && "border-b", className)}
    >
      <PageContainer
        as="div"
        maxWidth={maxWidth}
        className={cn("flex flex-col gap-8 py-0 md:gap-10", innerClassName)}
      >
        {children}
      </PageContainer>
    </section>
  );
}

/* ------------------------------------------------------------------ FieldError */

export interface FieldErrorProps {
  readonly id?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Form error message: icon + text, never colour alone (WCAG 1.4.1).
 */
export function FieldError({ id, children, className }: FieldErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className={cn("flex items-start gap-1.5 text-xs text-destructive", className)}
    >
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}


/* ---------------------------------------------------------------- SectionTitle */

export interface SectionTitleProps {
  readonly id: string;
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: "start" | "center";
  readonly className?: string;
}

export function SectionTitle({
  id,
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------- CTAButton */

export interface CTAButtonProps {
  readonly to: "/" | "/login" | "/register" | "/forgot-password";
  readonly children: ReactNode;
  readonly variant?: "default" | "secondary" | "outline" | "ghost";
  readonly size?: "default" | "lg";
  readonly withArrow?: boolean;
  readonly icon?: LucideIcon;
  readonly className?: string;
  readonly ariaLabel?: string;
}

export function CTAButton({
  to,
  children,
  variant = "default",
  size = "lg",
  withArrow = false,
  icon: Icon,
  className,
  ariaLabel,
}: CTAButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={cn("min-h-11", className)}>
      <Link to={to} aria-label={ariaLabel} preload="intent">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        {children}
        {withArrow ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Link>
    </Button>
  );
}

/* -------------------------------------------------------------------- HeroBanner */

export interface HeroBannerProps {
  readonly titleId: string;
  readonly badge?: string;
  readonly badgeIcon?: LucideIcon;
  readonly title: ReactNode;
  readonly description: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function HeroBanner({
  titleId,
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  actions,
  className,
}: HeroBannerProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn("relative overflow-hidden border-b py-14 md:py-24 lg:py-28", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_55%)] opacity-10 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
      />
      <PageContainer as="div" maxWidth="xl" className="relative">
        <div className="flex max-w-4xl flex-col items-start gap-5 md:gap-6">
          {badge ? (
            <Badge variant="outline" className="gap-1.5 border-primary/30">
              {BadgeIcon ? (
                <BadgeIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              ) : null}
              {badge}
            </Badge>
          ) : null}
          <h1
            id={titleId}
            className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
          {actions ? (
            <div
              role="group"
              aria-label="Aksi utama"
              className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              {actions}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}

/* ------------------------------------------------------------------- FeatureCard */

export interface FeatureCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly body: string;
  readonly reference?: string;
  readonly className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  body,
  reference,
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "h-full transition-colors motion-safe:transition-shadow hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
        {reference ? (
          <p className="mt-auto pt-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {reference}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

/* ----------------------------------------------------------------- StatisticCard */

export interface StatisticCardProps {
  readonly value: string;
  readonly label: string;
  readonly note?: string;
  readonly className?: string;
}

export function StatisticCard({ value, label, note, className }: StatisticCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col gap-1 p-5">
        <p className="text-3xl font-semibold tracking-tight text-primary">{value}</p>
        <p className="text-sm font-medium">{label}</p>
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------- PartnerLogo */

export interface PartnerLogoProps {
  readonly name: string;
  readonly role: string;
  readonly icon: LucideIcon;
  readonly className?: string;
}

export function PartnerLogo({ name, role, icon: Icon, className }: PartnerLogoProps) {
  return (
    <div
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg border bg-card px-4 py-3",
        className,
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium leading-tight">{name}</span>
        <span className="text-xs text-muted-foreground">{role}</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ FAQAccordion */

export interface FAQEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category?: "Umum" | "Keanggotaan" | "Privasi & Anak" | "Teknis";
}


export function FAQAccordion({
  entries,
  className,
}: {
  readonly entries: readonly FAQEntry[];
  readonly className?: string;
}) {
  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      {entries.map((entry) => (
        <AccordionItem key={entry.id} value={entry.id}>
          <AccordionTrigger className="min-h-11 text-left text-sm font-medium md:text-base">
            {entry.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {entry.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
