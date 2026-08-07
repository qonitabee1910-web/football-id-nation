import { type ReactNode } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { ContentContainer } from "@/components/ui/patterns/ContentContainer";
import { GlobalErrorBoundary } from "@/components/domain/error/GlobalErrorBoundary";
import { LoadingBoundary } from "@/components/domain/loading/LoadingBoundary";
import { ThemeToggle } from "../components/ThemeToggle";
import { cn } from "@/lib/utils";

export interface AuthLayoutProps {
  readonly variant?: "login" | "register" | "recovery";
  readonly children?: ReactNode;
  readonly maxWidth?: "sm" | "md";
  readonly showBackLink?: boolean;
  readonly backTo?: string;
  readonly backLabel?: string;
  readonly headerSlot?: ReactNode;
  readonly footerSlot?: ReactNode;
  readonly className?: string;
}

export function AuthLayout({
  variant = "login",
  children,
  maxWidth = "sm",
  showBackLink = true,
  backTo = "/",
  backLabel = "Kembali ke beranda",
  headerSlot,
  footerSlot,
  className,
}: AuthLayoutProps) {
  const titles = {
    login: "Masuk ke Football ID Nation",
    register: "Daftar Football ID",
    recovery: "Pemulihan Identitas",
  } as const;

  const subtitles = {
    login: "Masukkan akun untuk mengakses identitas sepak bola Anda.",
    register: "Buat akun untuk memulai perjalanan sepak bola.",
    recovery: "Atur ulang akses akun Anda secara aman.",
  } as const;

  return (
    <GlobalErrorBoundary isStructural>
      <div
        className={cn(
          "relative flex min-h-screen flex-col bg-background text-foreground",
          "bg-[radial-gradient(circle_at_top,_var(--color-surface-2),transparent_60%)]",
          className,
        )}
      >
        <a
          href="#auth-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Lompat ke konten utama
        </a>

        <header
          className="flex h-14 items-center justify-between px-4 md:h-16 md:px-8"
          role="banner"
        >
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="Ke halaman utama"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Football ID Nation</span>
          </Link>
          <ThemeToggle variant="icon" size="sm" />
        </header>

        <main
          id="auth-main"
          role="main"
          className="flex min-h-0 flex-1 items-center justify-center px-4 py-6 md:px-8 md:py-10"
          tabIndex={-1}
        >
          <LoadingBoundary>
            <PageContainer
              as="div"
              maxWidth={maxWidth === "md" ? "md" : "sm"}
              className="py-0"
            >
              <ContentContainer
                padding="none"
                className="overflow-hidden"
                role="region"
                aria-labelledby="auth-layout-title"
              >
                <div className="border-b px-5 py-5 md:px-8 md:py-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1
                        id="auth-layout-title"
                        className="text-lg font-semibold tracking-tight md:text-xl"
                      >
                        {titles[variant]}
                      </h1>
                      <p className="mt-1 text-sm text-muted-foreground">{subtitles[variant]}</p>
                    </div>
                    {headerSlot}
                  </div>
                </div>
                <div className="px-5 py-5 md:px-8 md:py-6">
                  {children ?? <Outlet />}
                </div>
                <div className="flex flex-col gap-3 border-t px-5 py-4 text-xs text-muted-foreground md:px-8">
                  {showBackLink ? (
                    <Link
                      to={backTo}
                      className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {backLabel}
                    </Link>
                  ) : null}
                  {footerSlot ?? (
                    <p>
                      Dengan melanjutkan, Anda menyetujui{" "}
                      <a
                        href="/legal"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Ketentuan Hukum
                      </a>{" "}
                      dan Kebijakan Privasi.
                    </p>
                  )}
                </div>
              </ContentContainer>
            </PageContainer>
          </LoadingBoundary>
        </main>

        <footer
          className="border-t px-4 py-4 text-center text-xs text-muted-foreground md:px-8"
          role="contentinfo"
        >
          © {new Date().getFullYear()} Football ID Nation. Identitas anak dijaga sesuai
          CONSENT-001.
        </footer>
      </div>
    </GlobalErrorBoundary>
  );
}
