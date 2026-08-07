import { Link } from "@tanstack/react-router";
import { ShieldQuestion, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyLayout } from "./EmptyLayout";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { ContentContainer } from "@/components/ui/patterns/ContentContainer";
import { cn } from "@/lib/utils";

export interface NotFoundLayoutProps {
  readonly title?: string;
  readonly description?: string;
  readonly showSearch?: boolean;
  readonly backTo?: string;
  readonly backLabel?: string;
  readonly homeLabel?: string;
  readonly variant?: "minimal" | "detailed";
  readonly className?: string;
}

export function NotFoundLayout({
  title = "Halaman tidak dapat ditemukan",
  description = "URL yang Anda tuju tidak tersedia atau telah dipindahkan. Periksa kembali tautan atau gunakan navigasi utama.",
  showSearch = true,
  backTo = "/",
  backLabel = "Kembali ke halaman sebelumnya",
  homeLabel = "Ke beranda",
  variant = "detailed",
  className,
}: NotFoundLayoutProps) {
  return (
    <EmptyLayout
      centreContent
      maxWidth="md"
      {...(className ? { className } : {})}
    >
      <PageContainer as="div" maxWidth="md" className="py-0">
        <ContentContainer
          variant="outlined"
          padding="lg"
          withShadow={variant === "detailed"}
          className={cn(
            variant === "minimal" && "border-0 bg-transparent shadow-none",
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
              <ShieldQuestion
                className="h-16 w-16 text-primary/60"
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </div>

            <p
              aria-hidden="true"
              className="select-none text-7xl font-bold tracking-tight text-primary/20"
            >
              404
            </p>
            <h1 className="sr-only">Kesalahan 404. {title}</h1>

            <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {title}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>

            <div
              role="navigation"
              aria-label="Aksi pemulihan 404"
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Button
                asChild
                variant="default"
                className="min-h-[48px] sm:w-auto"
              >
                <Link to={backTo}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {backLabel}
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="min-h-[48px] sm:w-auto"
              >
                <Link to="/">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  {homeLabel}
                </Link>
              </Button>
            </div>

            {showSearch ? (
              <div className="mt-8 w-full max-w-md text-left">
                <label
                  htmlFor="notfound-search"
                  className="mb-2 block text-xs font-medium text-muted-foreground"
                >
                  Atau cari apa yang Anda butuhkan:
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="notfound-search"
                    type="search"
                    placeholder="Cari Kode ID atau halaman…"
                    aria-label="Cari halaman"
                    className="h-12 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const v = (e.currentTarget.value ?? "").trim();
                        if (v.length >= 3) {
                          window.location.href = `/lookup?q=${encodeURIComponent(v)}`;
                        }
                      }
                    }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Pencarian membutuhkan autentikasi dan tercatat audit (min. 3 karakter).
                </p>
              </div>
            ) : null}
          </div>
        </ContentContainer>
      </PageContainer>
    </EmptyLayout>
  );
}
