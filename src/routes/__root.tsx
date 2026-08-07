import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Suspense, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../lib/theme/theme-provider";
import { getThemeInlineScript } from "../lib/theme/theme-script";
import { Toaster } from "../components/ui/sonner";
import { LoadingBoundary } from "../components/domain/loading/LoadingBoundary";
import { NotFoundLayout } from "../features/shared/layouts/NotFoundLayout";
import { EmptyLayout } from "../features/shared/layouts/EmptyLayout";
import { UnifiedNotFound } from "../components/domain/error/UnifiedNotFound";
import { Button } from "../components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";

function NotFoundComponent() {
  return <NotFoundLayout />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  const traceId =
    (error instanceof Error &&
      "cause" in error &&
      typeof (error as { cause?: { traceId?: unknown } }).cause === "object" &&
      (error as { cause?: { traceId?: unknown } }).cause &&
      typeof (error as { cause: { traceId?: unknown } }).cause.traceId === "string"
      ? (error as { cause: { traceId: string } }).cause.traceId
      : null) ??
    `ERR-${Date.now().toString(36).toUpperCase()}`;

  return (
    <EmptyLayout centreContent maxWidth="md">
      <UnifiedNotFound variant="error" title="Halaman gagal dimuat" />
      <div className="mt-6 flex w-full max-w-md flex-col items-center gap-3">
        <div className="w-full rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-center">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Trace ID (lapor ke dukungan)
          </p>
          <p className="mt-0.5 select-all font-mono text-xs" aria-label="Trace ID kesalahan">
            {traceId}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="default"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Coba Ulang
          </Button>
          <Button asChild variant="secondary">
            <Link to="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              Ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </EmptyLayout>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no",
      },
      { title: "Football ID Nation — Identitas Sepak Bola Nasional" },
      {
        name: "description",
        content:
          "Football ID Nation adalah sistem identitas sepak bola nasional yang aman, terverifikasi, dan mematuhi perlindungan anak CONSENT-001.",
      },
      { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#0d1633" },
      { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#0a1128" },
      { name: "color-scheme", content: "light dark" },
      { name: "author", content: "Football ID Nation" },
      { property: "og:title", content: "Football ID Nation" },
      {
        property: "og:description",
        content:
          "Sistem identitas sepak bola nasional untuk pemain, wali, klub, asosiasi, dan federasi.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "id_ID" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function ThemeScript() {
  const code = getThemeInlineScript();
  return (
    <script
      // eslint-disable-next-line react/no-danger -- intentional FOUC-preventing inline script
      dangerouslySetInnerHTML={{ __html: code }}
      id="idn-theme-init"
      suppressHydrationWarning
    />
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div className="min-h-screen"><LoadingBoundary /></div>}>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </Suspense>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "group gap-3 rounded-lg border border-border bg-card text-card-foreground shadow-sm",
              title: "text-sm font-semibold",
              description: "text-xs text-muted-foreground",
              closeButton:
                "top-3.5 right-3 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground",
            },
          }}
          icons={{
            success: (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-success/15 text-success">
                ✓
              </span>
            ),
            info: (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                i
              </span>
            ),
            warning: (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400">
                !
              </span>
            ),
            error: (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                ×
              </span>
            ),
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
