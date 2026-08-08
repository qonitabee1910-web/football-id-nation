import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "@/features/shared/layouts/AuthLayout";
import { AuthenticationCard } from "@/features/public/components/AuthenticationCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/public/schemas/auth.schemas";
import {
  isAuthBackendUnavailable,
  useForgotPasswordMutation,
} from "@/features/public/hooks/usePublicAuth";

const FORGOT_PASSWORD_LOADER_DEFAULTS = {
  meta: {
    title: "Lupa Kata Sandi — Football ID Nation",
    description:
      "Ajukan pemulihan akses akun Football ID Nation melalui email terdaftar Anda secara aman.",
    canonical: "https://football-id-nation.lovable.app/forgot-password",
    ogImage: "https://football-id-nation.lovable.app/og-image-default.png",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    robots: "noindex, follow",
  },
  trace: { screen: "SCR-PUB-04", journey: ["JRN-17"] },
} as const;

export const Route = createFileRoute("/forgot-password")({
  loader: () => FORGOT_PASSWORD_LOADER_DEFAULTS,
  head: () => {
    const data = FORGOT_PASSWORD_LOADER_DEFAULTS;
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
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const mutation = useForgotPasswordMutation();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, { onSuccess: () => setSubmittedEmail(values.email) });
  });

  return (
    <AuthLayout variant="recovery">
      <AuthenticationCard
        titleId="recovery-title"
        title="Lupa kata sandi"
        description="Masukkan email terdaftar. Instruksi verifikasi pemulihan dikirim jika email tersebut terdaftar — sistem tidak mengungkap keberadaan akun."
        footer={
          <p>
            Sudah ingat kata sandi?{" "}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Kembali ke halaman masuk
            </Link>
          </p>
        }
      >
        {mutation.isError ? (
          <Alert
            variant={isAuthBackendUnavailable(mutation.error) ? "unavailable" : "destructive"}
            role="alert"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>
              {isAuthBackendUnavailable(mutation.error)
                ? "Layanan belum tersedia"
                : "Permintaan gagal"}
            </AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        {submittedEmail ? (
          <Alert role="status">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Permintaan terkirim</AlertTitle>
            <AlertDescription>
              Jika email tersebut terdaftar di sistem, Anda akan menerima tautan
              verifikasi pemulihan dalam beberapa menit. Periksa kotak masuk dan
              folder spam Anda.
            </AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="recovery-email">Email terdaftar</Label>
            <Input
              id="recovery-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={form.formState.errors.email ? true : undefined}
              aria-describedby={
                form.formState.errors.email ? "recovery-email-error" : undefined
              }
              className="min-h-11"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p id="recovery-email-error" role="alert" className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" className="min-h-11 flex-1" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
              ) : (
                <MailCheck className="h-4 w-4" aria-hidden="true" />
              )}
              {mutation.isPending ? "Mengirim…" : "Kirim tautan pemulihan"}
            </Button>
            {submittedEmail ? (
              <Button
                type="button"
                variant="secondary"
                className="min-h-11"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({ email: submittedEmail })}
              >
                Kirim ulang
              </Button>
            ) : null}
          </div>
          <span aria-live="polite" className="sr-only">
            {mutation.isPending ? "Sedang mengirim permintaan pemulihan" : ""}
          </span>
        </form>
      </AuthenticationCard>
    </AuthLayout>
  );
}
