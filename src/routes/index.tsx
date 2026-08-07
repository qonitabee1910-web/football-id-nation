import { createFileRoute } from "@tanstack/react-router";
import { Shield, ShieldCheck, Users, FileCheck, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicLayout } from "@/features/shared/layouts/PublicLayout";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { ContentContainer } from "@/components/ui/patterns/ContentContainer";
import { ResponsiveGrid } from "@/components/ui/patterns/ResponsiveGrid";

export const Route = createFileRoute("/")({
  component: Index,
});

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Terverifikasi",
    body: "Data pemain diverifikasi oleh otoritas asosiasi dan federasi yang berwenang.",
  },
  {
    icon: Users,
    title: "Perlindungan Anak",
    body: "Mengikuti protokol CONSENT-001 untuk melindungi identitas dan akses pemain di bawah umur.",
  },
  {
    icon: FileCheck,
    title: "Audit Jejak Penuh",
    body: "Setiap akses dan perubahan data dicatat audit sesuai Konstitusi Pasal 14.",
  },
] as const;

function Index() {
  return (
    <PublicLayout showHeader showFooter>
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden border-b py-12 md:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_55%)] opacity-10"
        />
        <PageContainer as="div" maxWidth="xl" className="relative">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="outline" className="gap-1.5 border-primary/30">
              <Shield className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Identitas sepak bola nasional — aman, resmi, terlacak
            </Badge>

            <h1
              id="hero-title"
              className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
            >
              Football ID Nation — identitas pemain sepak bola yang
              <span className="text-primary"> terpercaya</span>.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Satu identitas untuk pemain, wali, klub, asosiasi, dan federasi dalam ekosistem
              sepak bola nasional. Dibangun dengan kontrol persetujuan yang ketat dan
              perlindungan anak CONSENT-001.
            </p>

            <div
              role="group"
              aria-label="Aksi utama halaman depan"
              className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Button asChild size="lg" className="min-h-[48px]">
                <a href="/register">
                  Daftar Akun
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="min-h-[48px]">
                <a href="/login">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Masuk
                </a>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Trust pillars */}
      <section
        aria-labelledby="trust-title"
        className="py-10 md:py-16"
      >
        <PageContainer as="div" maxWidth="xl">
          <div className="mb-8 flex max-w-2xl flex-col gap-2">
            <h2 id="trust-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
              Dibangun dengan standar identitas yang ketat
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Arsitektur, kebijakan persetujuan, dan otorisasi mengikuti dokumen tata kelola
              resmi Football ID Nation.
            </p>
          </div>

          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            {TRUST_PILLARS.map((p) => (
              <ContentContainer
                key={p.title}
                role="article"
                aria-label={p.title}
                padding="lg"
                variant="outlined"
                className="h-full"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold md:text-lg">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </ContentContainer>
            ))}
          </ResponsiveGrid>
        </PageContainer>
      </section>

      {/* CTA band */}
      <section aria-labelledby="cta-title" className="pb-10 md:pb-16">
        <PageContainer as="div" maxWidth="xl">
          <ContentContainer
            padding="lg"
            variant="elevated"
            role="region"
            aria-label="Ajakan masuk atau daftar"
            className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 id="cta-title" className="text-lg font-semibold md:text-xl">
                Siap bergabung dengan ekosistem Football ID?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">
                Pemain, wali, dan admin organisasi dapat memulai dari sini.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button asChild variant="default" className="min-h-[44px]">
                <a href="/register">Daftar Akun</a>
              </Button>
              <Button asChild variant="ghost" className="min-h-[44px]">
                <a href="/legal">Baca Ketentuan</a>
              </Button>
            </div>
          </ContentContainer>
        </PageContainer>
      </section>
    </PublicLayout>
  );
}
