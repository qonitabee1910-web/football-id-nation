import { createFileRoute } from "@tanstack/react-router";
import { Home, LogIn, SearchX } from "lucide-react";

import { PublicLayout } from "@/features/shared/layouts/PublicLayout";
import {
  CTAButton,
  PublicSection,
  SectionTitle,
} from "@/features/public/components/PublicPrimitives";

const NOT_FOUND_META = {
  title: "Halaman tidak ditemukan — Football ID Nation",
  description:
    "Alamat yang Anda tuju tidak tersedia di Football ID Nation. Kembali ke beranda atau masuk untuk melanjutkan perjalanan Anda.",
  robots: "noindex, nofollow",
} as const;

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: NOT_FOUND_META.title },
      { name: "description", content: NOT_FOUND_META.description },
      { property: "og:title", content: NOT_FOUND_META.title },
      { property: "og:description", content: NOT_FOUND_META.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: NOT_FOUND_META.robots },
    ],
  }),
  component: PublicNotFoundPage,
});

function PublicNotFoundPage() {
  return (
    <PublicLayout showHeader showFooter contained>
      <PublicSection
        labelledBy="not-found-title"
        maxWidth="md"
        bordered={false}
        className="flex-1"
        innerClassName="items-center justify-center text-center min-h-[50vh]"
      >
        <div className="flex flex-col items-center gap-6">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary/80">
            <SearchX className="h-10 w-10" aria-hidden="true" />
          </span>

          <span
            aria-hidden="true"
            className="text-7xl font-bold tracking-tight text-primary/20 select-none"
          >
            404
          </span>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Kesalahan navigasi
            </span>
            <h1
              id="not-found-title"
              className="text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Halaman tidak dapat ditemukan
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              URL yang Anda tuju tidak tersedia atau telah dipindahkan. Periksa
              kembali tautan, atau gunakan navigasi utama untuk melanjutkan.
            </p>
          </div>

          <div
            role="group"
            aria-label="Aksi pemulihan"
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <CTAButton to="/" icon={Home}>
              Kembali ke beranda
            </CTAButton>
            <CTAButton to="/login" variant="outline" icon={LogIn}>
              Masuk
            </CTAButton>
          </div>

          <p className="text-xs text-muted-foreground">
            Jika menurut Anda ini adalah kesalahan, silakan hubungi pengelola platform.
          </p>
        </div>

      </PublicSection>
    </PublicLayout>
  );
}
