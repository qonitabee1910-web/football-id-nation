import { type ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { GlobalErrorBoundary } from "@/components/domain/error/GlobalErrorBoundary";
import { LoadingBoundary } from "@/components/domain/loading/LoadingBoundary";
import { AppHeader } from "../components/AppHeader";
import { useState } from "react";
import { CommandPalette } from "../components/CommandPalette";
import { ThemeToggle } from "../components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface PublicLayoutProps {
  readonly children?: ReactNode;
  readonly maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  readonly showHeader?: boolean;
  readonly showFooter?: boolean;
  readonly className?: string;
  readonly mainClassName?: string;
}

export function PublicLayout({
  children,
  maxWidth = "xl",
  showHeader = true,
  showFooter = true,
  className,
  mainClassName,
}: PublicLayoutProps) {
  const [searchOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationOpen] = useState(false);

  return (
    <GlobalErrorBoundary isStructural>
      <div
        className={cn(
          "flex min-h-screen w-full flex-col bg-background text-foreground antialiased",
          className,
        )}
      >
        <a
          href="#public-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Lompat ke konten utama
        </a>

        {showHeader ? (
          <PublicSiteHeader onCommandOpen={() => setCommandOpen(true)} />
        ) : null}

        <main
          id="public-main"
          role="main"
          tabIndex={-1}
          className={cn("flex min-h-0 flex-1 flex-col", mainClassName)}
        >
          <LoadingBoundary>
            <PageContainer as="div" maxWidth={maxWidth} className="flex-1">
              {children ?? <Outlet />}
            </PageContainer>
          </LoadingBoundary>
        </main>

        {showFooter ? <PublicSiteFooter /> : null}

        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          authenticated={false}
        />
        {/* referenced for interface parity */}
        <span
          data-hint={`search:${searchOpen};notif:${notificationOpen}`}
          className="hidden"
        />
      </div>
    </GlobalErrorBoundary>
  );
}

function PublicSiteHeader({
  onCommandOpen,
}: {
  readonly onCommandOpen: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:h-16 md:px-8"
      role="banner"
    >
      <Link
        to="/"
        className="flex items-center gap-2"
        aria-label="Ke halaman utama Football ID Nation"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Shield className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold tracking-tight">Football ID Nation</p>
          <p className="text-xs text-muted-foreground">
            Identitas sepak bola yang terpercaya
          </p>
        </div>
      </Link>

      <nav aria-label="Navigasi publik" className="hidden items-center gap-1 md:flex">
        <a
          href="/legal"
          className="inline-flex min-h-[44px] items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Ketentuan
        </a>
        <a
          href="/login"
          className="inline-flex min-h-[44px] items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Masuk
        </a>
        <a
          href="/register"
          className="inline-flex min-h-[44px] items-center gap-1 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Daftar
        </a>
      </nav>

      <div className="flex items-center gap-1 md:gap-2">
        <button
          type="button"
          onClick={onCommandOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          aria-label="Buka palet perintah"
        >
          <Shield className="h-4 w-4" aria-hidden="true" />
        </button>
        <ThemeToggle variant="icon" size="sm" />
      </div>
    </header>
  );
}

function PublicSiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t bg-surface-0/50 px-4 py-6 text-sm md:px-8 md:py-8"
      role="contentinfo"
    >
      <PageContainer
        as="div"
        maxWidth="xl"
        className="grid grid-cols-1 gap-6 py-0 md:grid-cols-3 md:gap-8"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">Football ID Nation</span>
          </div>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Sistem identitas sepak bola nasional untuk pemain, wali, klub, asosiasi, dan
            federasi. Dibangun dengan standar perlindungan anak CONSENT-001.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Sumber Daya
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="/legal"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Ketentuan Hukum & Privasi
              </a>
            </li>
            <li>
              <a
                href="/forgot-password"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Lupa Kata Sandi
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Pusat Masuk
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            Pemangku Kepentingan
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Pemain &amp; Wali</li>
            <li>Klub &amp; Akademi</li>
            <li>Asosiasi &amp; Federasi</li>
          </ul>
        </div>
      </PageContainer>
      <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
        © {year} Football ID Nation. Seluruh hak cipta dilindungi. Arsitektur mengikuti
        Konstitusi Pasal 8 (otorisasi sisi server).
      </div>
    </footer>
  );
}
