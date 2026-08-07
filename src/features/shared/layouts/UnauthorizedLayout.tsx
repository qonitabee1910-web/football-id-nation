import { Link, useLocation } from "@tanstack/react-router";
import { Shield, Home, LogIn, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyLayout } from "./EmptyLayout";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { ContentContainer } from "@/components/ui/patterns/ContentContainer";
import { Badge } from "@/components/ui/badge";

export interface UnauthorizedLayoutProps {
  readonly title?: string;
  readonly description?: string;
  readonly returnPath?: string | null;
  readonly reason?: "expired" | "revoked" | "required" | "mfa";
  readonly preserveReturn?: boolean;
  readonly className?: string;
}

const REASON_META: Record<Exclude<UnauthorizedLayoutProps["reason"], undefined>, {
  badge: string;
  headline: string;
  body: string;
}> = {
  expired: {
    badge: "Sesi Berakhir",
    headline: "Sesi Anda telah berakhir",
    body: "Untuk keamanan akun dan data identitas sepak bola Anda, silakan masuk kembali. Aktivitas yang belum disimpan perlu diulangi.",
  },
  revoked: {
    badge: "Sesi Dicabut",
    headline: "Sesi Anda dicabut oleh administrator",
    body: "Akses saat ini tidak lagi berlaku. Jika Anda merasa ini adalah kesalahan, silakan hubungi dukungan melalui kredensial federasi Anda.",
  },
  required: {
    badge: "Autentikasi Diperlukan",
    headline: "Anda perlu masuk untuk mengakses halaman ini",
    body: "Kami menjaga setiap akses ke data pemain, wali, dan keanggotaan sesuai standar perlindungan anak CONSENT-001.",
  },
  mfa: {
    badge: "Tantangan MFA",
    headline: "Verifikasi dua langkah diperlukan",
    body: "Area ini memerlukan verifikasi faktor kedua untuk peran platform-level Anda. Selesaikan tantangan MFA untuk melanjutkan.",
  },
};

export function UnauthorizedLayout({
  title,
  description,
  returnPath,
  reason = "expired",
  preserveReturn = true,
  className,
}: UnauthorizedLayoutProps) {
  const location = useLocation();
  const meta = REASON_META[reason];
  const fallbackReturn = location.pathname + location.search;
  const effectiveReturn = returnPath ?? (preserveReturn ? fallbackReturn : null);
  const encodedReturn = effectiveReturn ? encodeURIComponent(effectiveReturn) : null;
  const loginTarget = encodedReturn
    ? `/login?return=${encodedReturn}`
    : "/login";

  return (
    <EmptyLayout centreContent maxWidth="md" {...(className ? { className } : {})}>
      <PageContainer as="div" maxWidth="md" className="py-0">
        <ContentContainer variant="outlined" padding="lg" role="region" aria-label="Peringatan sesi">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex h-28 w-28 items-center justify-center rounded-full border border-border bg-background">
              <Shield
                className="h-16 w-16 text-muted-foreground/70"
                strokeWidth={1.3}
                aria-hidden="true"
              />
            </div>

            <Badge variant="outline" className="mb-4 gap-1.5">
              {meta.badge}
            </Badge>

            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              {title ?? meta.headline}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {description ?? meta.body}
            </p>

            {encodedReturn ? (
              <p className="mt-4 max-w-md truncate font-mono text-[11px] text-muted-foreground">
                <span className="sr-only">Tujuan setelah masuk kembali: </span>
                <span aria-hidden="true">Tujuan tersimpan: </span>
                {decodeURIComponent(encodedReturn)}
              </p>
            ) : null}

            <div
              role="navigation"
              aria-label="Aksi pemulihan sesi"
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Button asChild variant="default" className="min-h-[48px] sm:w-auto">
                <Link to={loginTarget}>
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Masuk Kembali
                </Link>
              </Button>
              {reason === "expired" ? (
                <Button
                  variant="ghost"
                  onClick={() => (typeof window !== "undefined" ? window.location.reload() : undefined)}
                  className="min-h-[48px] sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Muat Ulang
                </Button>
              ) : null}
              <Button asChild variant="secondary" className="min-h-[48px] sm:w-auto">
                <Link to="/">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Ke Beranda
                </Link>
              </Button>
            </div>

            <p
              role="note"
              className="mt-6 max-w-md text-[11px] leading-relaxed text-muted-foreground"
            >
              Football ID Nation tidak pernah meminta kredensial akun di luar halaman
              masuk resmi. Selalu periksa URL dan sertifikat keamanan sebelum memasukkan
              kata sandi.
            </p>
          </div>
        </ContentContainer>
      </PageContainer>
    </EmptyLayout>
  );
}
