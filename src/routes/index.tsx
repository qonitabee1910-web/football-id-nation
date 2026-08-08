import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  FileCheck,
  Fingerprint,
  Landmark,
  LineChart,
  LogIn,
  Route as RouteIcon,
  Shield,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { PublicLayout } from "@/features/shared/layouts/PublicLayout";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { ResponsiveGrid } from "@/components/ui/patterns/ResponsiveGrid";
import {
  CTAButton,
  FAQAccordion,
  FeatureCard,
  HeroBanner,
  PartnerLogo,
  SectionTitle,
  StatisticCard,
  type FAQEntry,
} from "@/features/public/components/PublicPrimitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Football ID Nation — Identitas Digital Sepak Bola Indonesia" },
      {
        name: "description",
        content:
          "Football ID: satu identitas digital terverifikasi untuk pemain, wali, SSB, asosiasi, dan federasi. Perjalanan pemain yang portabel, dengan perlindungan anak sebagai prinsip utama.",
      },
      {
        property: "og:title",
        content: "Football ID Nation — Identitas Digital Sepak Bola Indonesia",
      },
      {
        property: "og:description",
        content:
          "Satu orang, satu akun, banyak peran. Infrastruktur data sepak bola nasional yang terverifikasi dan melindungi anak.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://football-id-nation.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://football-id-nation.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Football ID Nation",
          url: "https://football-id-nation.lovable.app/",
          description:
            "Infrastruktur identitas digital sepak bola Indonesia berbasis Football ID.",
        }),
      },
    ],
  }),
  component: LandingPage,
});

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Terverifikasi",
    body: "Identitas dan riwayat pemain diverifikasi oleh otoritas asosiasi serta federasi yang berwenang.",
    reference: "IDN-PRD-001",
  },
  {
    icon: Users,
    title: "Perlindungan Anak",
    body: "Kapabilitas berisiko tidak sekadar ditolak — kapabilitas tersebut tidak ada bagi pemain di bawah 13 tahun.",
    reference: "CONSENT-001 · STK-INV-004",
  },
  {
    icon: FileCheck,
    title: "Jejak Audit Penuh",
    body: "Setiap akses dan perubahan data tercatat pada ledger append-only yang tidak dapat diubah.",
    reference: "IDN-ERD-001",
  },
] as const;

const CAPABILITIES = [
  {
    icon: Fingerprint,
    title: "Football ID yang opaque",
    body: "Identitas permanen yang tidak memuat tahun, wilayah, atau fakta bisnis apa pun sehingga tidak dapat ditebak maupun disalahgunakan.",
    reference: "ADR-0002 rev.2",
  },
  {
    icon: UserRound,
    title: "Satu orang, banyak peran",
    body: "Seorang pelatih yang juga wali dan mantan pemain tetap memakai satu akun tanpa duplikasi identitas.",
    reference: "Prinsip #3",
  },
  {
    icon: RouteIcon,
    title: "Perjalanan milik pemain",
    body: "Riwayat latihan, pertandingan, dan keanggotaan mengikuti pemain, bukan klub. Pindah SSB tidak menghapus rekam jejak.",
    reference: "Prinsip #1",
  },
  {
    icon: Building2,
    title: "Keanggotaan bertipe",
    body: "Tepat satu keanggotaan Primary aktif untuk kelayakan kompetisi, ditambah keanggotaan Secondary opsional untuk kamp dan program tambahan.",
    reference: "ADR-0003",
  },
  {
    icon: Trophy,
    title: "Kelayakan yang dapat diaudit",
    body: "Kelayakan kompetisi dihitung dari keanggotaan Primary dan bukti terverifikasi, bukan dari klaim manual.",
    reference: "IDN-DMN-001",
  },
  {
    icon: LineChart,
    title: "Metrik ekosistem",
    body: "Verified Active Players sebagai North Star, dikualifikasi oleh NDI, JCS, dan CTI dengan ambang aktivitas yang dapat dikonfigurasi.",
    reference: "PRG-MET-001",
  },
] as const;

const PHASE_ZERO_TARGETS = [
  { value: "1.500", label: "Pemain terdaftar", note: "Target rancangan Fase 0" },
  { value: "800", label: "Verified Active Players", note: "North Star Fase 0" },
  { value: "10", label: "SSB pendiri", note: "Target rancangan Fase 0" },
  { value: "1.200", label: "Wali terverifikasi", note: "Target rancangan Fase 0" },
] as const;

const ECOSYSTEM_ACTORS = [
  { name: "Sekolah Sepak Bola", role: "Keanggotaan & pembinaan", icon: Building2 },
  { name: "Asosiasi & Federasi", role: "Verifikasi & kompetisi", icon: Landmark },
  { name: "Pelatih Bersertifikat", role: "Pencatatan aktivitas", icon: ClipboardCheck },
  { name: "Wali & Orang Tua", role: "Otoritas persetujuan", icon: Users },
] as const;

const FAQ_ENTRIES: readonly FAQEntry[] = [
  {
    id: "faq-what",
    question: "Apa itu Football ID?",
    answer:
      "Football ID adalah identitas digital permanen bagi setiap orang dalam ekosistem sepak bola Indonesia. Satu orang memiliki satu Football ID seumur hidup, terlepas dari berapa banyak peran atau klub yang ia jalani.",
  },
  {
    id: "faq-ownership",
    question: "Siapa pemilik data perjalanan pemain?",
    answer:
      "Pemain. SSB hanya memiliki catatan keanggotaan, bukan identitas pemain. Ketika pemain pindah klub, perjalanan dan bukti terverifikasinya tetap utuh dan mengikuti pemain.",
  },
  {
    id: "faq-child",
    question: "Bagaimana perlindungan pemain di bawah umur?",
    answer:
      "Kepentingan anak selalu diutamakan di atas kepentingan pihak lain. Wali memegang otoritas persetujuan, pemanduan bakat tidak tersedia untuk pemain di bawah 13 tahun, dan pelatihan model AI atas data pemain memerlukan persetujuan terpisah yang tidak pernah otomatis.",
  },
  {
    id: "faq-consent",
    question: "Bisakah persetujuan dicabut?",
    answer:
      "Bisa, kapan saja. Persetujuan bersifat granular per tujuan. Pencabutan berisiko tinggi berlaku seketika dengan notifikasi dan pencatatan audit.",
  },
  {
    id: "faq-join",
    question: "Siapa yang dapat mendaftar sekarang?",
    answer:
      "Pemain, wali, SSB atau klub, serta asosiasi dan federasi dapat membuat akun. Kapabilitas yang tersedia menyesuaikan peran dan status verifikasi masing-masing.",
  },
];

function LandingPage() {
  return (
    <PublicLayout showHeader showFooter>
      <HeroBanner
        titleId="hero-title"
        badge="Identitas sepak bola nasional — aman, resmi, terlacak"
        badgeIcon={Shield}
        title={
          <>
            Football ID Nation — identitas pemain sepak bola yang{" "}
            <span className="text-primary">terpercaya</span>.
          </>
        }
        description="Satu identitas untuk pemain, wali, klub, asosiasi, dan federasi dalam ekosistem sepak bola nasional. Dibangun dengan kontrol persetujuan yang ketat dan perlindungan anak sebagai prinsip utama."
        actions={
          <>
            <CTAButton to="/register" withArrow>
              Daftar Football ID
            </CTAButton>
            <CTAButton to="/login" variant="outline" icon={LogIn}>
              Masuk
            </CTAButton>
          </>
        }
      />

      {/* Trust pillars */}
      <section aria-labelledby="trust-title" className="border-b py-12 md:py-16">
        <PageContainer as="div" maxWidth="xl" className="flex flex-col gap-8">
          <SectionTitle
            id="trust-title"
            eyebrow="Fondasi kepercayaan"
            title="Dibangun agar layak dipercaya, bukan sekadar terlihat modern"
            description="Tiga pilar yang menjadi dasar setiap keputusan arsitektur platform."
          />
          <ResponsiveGrid cols={{ base: 1, md: 3 }} gap="md">
            {TRUST_PILLARS.map((pillar) => (
              <FeatureCard key={pillar.title} {...pillar} />
            ))}
          </ResponsiveGrid>
        </PageContainer>
      </section>

      {/* About */}
      <section aria-labelledby="about-title" className="border-b py-12 md:py-16">
        <PageContainer as="div" maxWidth="xl" className="grid gap-8 md:grid-cols-2 md:items-start">
          <SectionTitle
            id="about-title"
            eyebrow="Tentang platform"
            title="Infrastruktur data, bukan sekadar aplikasi klub"
            description="Football ID Nation adalah lapisan identitas bersama bagi seluruh ekosistem sepak bola usia muda Indonesia. Alih-alih setiap SSB menyimpan datanya sendiri secara terpisah, platform ini menjadikan identitas dan perjalanan pemain sebagai sumber kebenaran tunggal yang portabel."
          />
          <div className="flex flex-col gap-4 rounded-lg border bg-card p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Setiap kapabilitas diturunkan dari artefak tata kelola yang disetujui:
              visi, peta pemangku kepentingan, model domain, kontrak API, hingga
              katalog layar. Tidak ada fitur yang dibangun tanpa kontrak yang lebih
              dahulu disepakati.
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                "Identity Bounded Context sebagai fondasi Sprint 1",
                "Consent sebagai warga kelas satu, bukan tambahan",
                "Ledger append-only sebagai otoritas riwayat",
                "Kepentingan anak mengalahkan seluruh kepentingan lain",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </PageContainer>
      </section>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-title" className="border-b py-12 md:py-16">
        <PageContainer as="div" maxWidth="xl" className="flex flex-col gap-8">
          <SectionTitle
            id="capabilities-title"
            eyebrow="Kapabilitas inti"
            title="Apa yang Football ID berikan pada ekosistem"
          />
          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            {CAPABILITIES.map((capability) => (
              <FeatureCard key={capability.title} {...capability} />
            ))}
          </ResponsiveGrid>
        </PageContainer>
      </section>

      {/* Phase 0 targets */}
      <section aria-labelledby="targets-title" className="border-b py-12 md:py-16">
        <PageContainer as="div" maxWidth="xl" className="flex flex-col gap-8">
          <SectionTitle
            id="targets-title"
            eyebrow="Fase 0 — Founding"
            title="Target rancangan fase pendiri"
            description="Angka berikut adalah target volume desain untuk Fase 0 yang telah disetujui Council, bukan jumlah pengguna saat ini."
          />
          <ResponsiveGrid cols={{ base: 2, lg: 4 }} gap="md">
            {PHASE_ZERO_TARGETS.map((stat) => (
              <StatisticCard key={stat.label} {...stat} />
            ))}
          </ResponsiveGrid>
        </PageContainer>
      </section>

      {/* Ecosystem actors */}
      <section aria-labelledby="actors-title" className="border-b py-12 md:py-16">
        <PageContainer as="div" maxWidth="xl" className="flex flex-col gap-8">
          <SectionTitle
            id="actors-title"
            eyebrow="Ekosistem"
            title="Peran yang bekerja di atas satu identitas"
            description="Setiap peran memperoleh kapabilitas seminimal yang dibutuhkan untuk tugasnya."
          />
          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
            {ECOSYSTEM_ACTORS.map((actor) => (
              <PartnerLogo key={actor.name} {...actor} />
            ))}
          </ResponsiveGrid>
        </PageContainer>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="border-b py-12 md:py-16">
        <PageContainer as="div" maxWidth="lg" className="flex flex-col gap-8">
          <SectionTitle
            id="faq-title"
            eyebrow="Pertanyaan umum"
            title="Hal yang paling sering ditanyakan"
          />
          <FAQAccordion entries={FAQ_ENTRIES} />
        </PageContainer>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="cta-title" className="py-12 md:py-16">
        <PageContainer as="div" maxWidth="lg">
          <div className="flex flex-col items-start gap-6 rounded-xl border bg-card p-8 md:items-center md:text-center">
            <SectionTitle
              id="cta-title"
              title="Mulai perjalanan sepak bola yang terverifikasi"
              description="Buat Football ID Anda hari ini, atau masuk untuk melanjutkan perjalanan yang sudah berjalan."
              align="center"
            />
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <CTAButton to="/register" withArrow>
                Daftar sekarang
              </CTAButton>
              <CTAButton to="/login" variant="outline" icon={LogIn}>
                Masuk
              </CTAButton>
            </div>
          </div>
        </PageContainer>
      </section>
    </PublicLayout>
  );
}
