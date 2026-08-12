/**
 * @trace SCR-PUB-06 Legal Hub Placeholder
 * @journey TBD (pending Council approval of SCR-PUB-06 final spec)
 * @status Placeholder — konten final menunggu persetujuan Council sesuai
 *   artefact-registry.md IDN-SCR-001 status IN_REVIEW. Route ini hadir untuk
 *   menghindari tautan rusak 404 pada area publik yang sudah menunjuk /legal.
 * @business_rules None. Jangan menambahkan ketentuan substantif sebelum
 *   SCR-PUB-06 + content legal final disetujui oleh Governance Council.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, FileText, Shield } from "lucide-react";
import { PublicLayout } from "@/features/shared/layouts/PublicLayout";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LEGAL_LOADER_DEFAULTS = {
  meta: {
    title: "Ketentuan & Kebijakan — Football ID Nation",
    description:
      "Pusat informasi ketentuan layanan, kebijakan privasi, dan kerangka hukum Football ID Nation. Konten final dalam persiapan Council.",
    canonical: "https://football-id-nation.lovable.app/legal",
    ogImage: "https://football-id-nation.lovable.app/og-image-default.png",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    robots: "noindex, follow",
  },
  trace: { screen: "SCR-PUB-06", journey: [], placeholder: true },
} as const;

export const Route = createFileRoute("/legal")({
  loader: () => LEGAL_LOADER_DEFAULTS,
  head: () => {
    const data = LEGAL_LOADER_DEFAULTS;
    return {
      meta: [
        { title: data.meta.title },
        { name: "description", content: data.meta.description },
        { property: "og:title", content: data.meta.title },
        { property: "og:description", content: data.meta.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: data.meta.canonical },
        { property: "og:image", content: data.meta.ogImage },
        { property: "og:image:width", content: String(data.meta.ogImageWidth) },
        { property: "og:image:height", content: String(data.meta.ogImageHeight) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: data.meta.ogImage },
        { name: "robots", content: data.meta.robots },
      ],
      links: [{ rel: "canonical", href: data.meta.canonical }],
    };
  },
  component: LegalPlaceholderPage,
});

const DOCUMENTS_PENDING = [
  {
    id: "TOS",
    title: "Ketentuan Layanan",
    desc: "Syarat dan ketentuan penggunaan platform Football ID Nation untuk seluruh aktor (pemain, wali, SSB, asosiasi, federasi).",
    audience: "Semua pengguna",
    basis: "UU ITE No. 19/2016 jo. UU PDP No. 27/2022",
  },
  {
    id: "PRIVACY",
    title: "Kebijakan Privasi",
    desc: "Pengumpulan, pengolahan, pengendalian, dan penghapusan data identitas sepak bola dengan fokus perlindungan data anak U13.",
    audience: "Semua pengguna",
    basis: "UU PDP No. 27/2022, PERMIN KOMINFO 20/2016, CONSENT-001",
  },
  {
    id: "COPPA_EQ",
    title: "Kerangka Perlindungan Data Anak",
    desc: "Implementasi usia minimum, persetujuan wali, dan pengecualian kapabilitas berisiko bagi pemain di bawah umur sesuai STK-INV-004.",
    audience: "Wali, pemain U18, SSB, asosiasi",
    basis: "KONSIDERAN-01 Child Interest Prevails, CONSENT-001 §4, §11",
  },
  {
    id: "ACCESSIBILITY",
    title: "Pernyataan Aksesibilitas",
    desc: "Komitmen WCAG 2.1 AA, target ukuran sentuh 44px, high-contrast, reduced-motion, dan dukungan pembaca layar.",
    audience: "Pengguna dengan disabilitas",
    basis: "IDN-DS-001 §7, IDN-SCR-001 Part 11, PERMENKOMINFO aksesibilitas digital",
  },
  {
    id: "COOKIES",
    title: "Kebijakan Cookie & Penyimpanan Lokal",
    desc: "Cookie yang hanya untuk sesi autentikasi + preferensi tema; tidak ada pelacakan iklan dan tidak ada third-party tracking.",
    audience: "Semua pengguna",
    basis: "Konstitusi Pasal 9 Privacy by Architecture",
  },
] as const;

function LegalPlaceholderPage() {
  return (
    <PublicLayout>
      <PageContainer maxWidth="lg" className="py-8 md:py-12">
        <div className="mb-6 flex flex-col gap-2">
          <Badge variant="secondary" className="w-fit font-mono uppercase tracking-wide">
            SCR-PUB-06 · PLACEHOLDER
          </Badge>
          <h1 className="font-heading text-3xl font-heading-bold md:text-4xl">
            Ketentuan &amp; Kebijakan
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Pusat informasi hukum dan kebijakan Football ID Nation.
          </p>
        </div>

        <Alert className="mb-8" variant="unavailable">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Konten final menunggu persetujuan Governance Council</AlertTitle>
          <AlertDescription>
            Halaman ini hadir sebagai placeholder untuk menghindari tautan rusak
            pada navigasi publik. Ketentuan substantif, draf legal, dan
            pernyataan resmi akan diterbitkan setelah SCR-PUB-06 (Legal Hub)
            melewati G5 Gate dan ditandatangani oleh Chief Privacy Officer
            serta Legal Council.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2">
          {DOCUMENTS_PENDING.map((doc) => {
            const Icon = doc.id === "PRIVACY" ? Shield : FileText;
            return (
              <Card key={doc.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle asChild>
                      <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span>{doc.title}</span>
                      </h2>
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      DRAFT · ID:{doc.id}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                  <p>{doc.desc}</p>
                  <dl className="mt-auto grid gap-2 border-t pt-3 text-xs">
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 font-medium text-foreground">Ditujukan</dt>
                      <dd>{doc.audience}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 font-medium text-foreground">Dasar</dt>
                      <dd>{doc.basis}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Butuh akses draf saat ini atau ingin berkontribusi pada review legal?
            Hubungi Governance Council melalui prosedur internal.
          </p>
          <Button asChild variant="secondary" className="min-h-11">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </PageContainer>
    </PublicLayout>
  );
}
