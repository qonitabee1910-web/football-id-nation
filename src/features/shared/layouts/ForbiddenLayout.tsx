import { Link } from "@tanstack/react-router";
import { ShieldBan, Home, ShieldQuestion, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyLayout } from "./EmptyLayout";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { ContentContainer } from "@/components/ui/patterns/ContentContainer";

export interface ForbiddenLayoutProps {
  readonly title?: string;
  readonly description?: string;
  readonly showLoginHint?: boolean;
  readonly loginTo?: string;
  readonly homeTo?: string;
  readonly auditHint?: boolean;
  readonly className?: string;
}

export function ForbiddenLayout({
  title = "Akses ditolak",
  description = "Anda tidak memiliki izin untuk mengakses sumber daya ini. Peran atau konteks keanggotaan Anda tidak memenuhi syarat perlindungan yang ditetapkan.",
  showLoginHint = true,
  loginTo = "/login",
  homeTo = "/",
  auditHint = true,
  className,
}: ForbiddenLayoutProps) {
  return (
    <EmptyLayout centreContent maxWidth="md" {...(className ? { className } : {})}>
      <PageContainer as="div" maxWidth="md" className="py-0">
        <ContentContainer variant="outlined" padding="lg" role="alert" aria-live="assertive">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex h-28 w-28 items-center justify-center rounded-full bg-destructive/10">
              <ShieldBan
                className="h-16 w-16 text-destructive/70"
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </div>

            <p
              aria-hidden="true"
              className="select-none text-7xl font-bold tracking-tight text-destructive/20"
            >
              403
            </p>
            <h1 className="sr-only">Kesalahan 403. {title}</h1>

            <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {title}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>

            <ul
              role="list"
              aria-label="Kemungkinan penyebab akses ditolak"
              className="mt-6 w-full max-w-md space-y-2 text-left text-sm"
            >
              <li className="flex items-start gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium">Peran tidak memenuhi syarat</p>
                  <p className="text-xs text-muted-foreground">
                    Tindakan ini memerlukan peran wali, admin klub, atau otoritas
                    verifikasi yang lebih tinggi.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
                <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium">Konteks persetujuan tidak berlaku</p>
                  <p className="text-xs text-muted-foreground">
                    Akses ke data pemain di bawah umur memerlukan persetujuan P4/P5 yang
                    aktif dari wali sah (CONSENT-001).
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="font-medium">Sesi belum diautentikasi</p>
                  <p className="text-xs text-muted-foreground">
                    Jika Anda memiliki akun, masuk dengan kredensial yang sesuai untuk
                    area ini.
                  </p>
                </div>
              </li>
            </ul>

            <div
              role="navigation"
              aria-label="Aksi pemulihan akses ditolak"
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
            >
              {showLoginHint ? (
                <Button asChild variant="default" className="min-h-[48px] sm:w-auto">
                  <Link to={loginTo}>
                    <User className="h-4 w-4" aria-hidden="true" />
                    Masuk dengan Akun Lain
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="secondary" className="min-h-[48px] sm:w-auto">
                <Link to={homeTo}>
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>

            {auditHint ? (
              <p
                role="note"
                className="mt-6 max-w-md text-[11px] leading-relaxed text-muted-foreground"
              >
                Setiap upaya akses yang ditolak dicatat audit untuk tujuan keamanan dan
                perlindungan anak sesuai Konstitusi Pasal 14.
              </p>
            ) : null}
          </div>
        </ContentContainer>
      </PageContainer>
    </EmptyLayout>
  );
}
