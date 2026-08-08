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
import { useForgotPasswordMutation } from "@/features/public/hooks/usePublicAuth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Lupa Kata Sandi — Football ID Nation" },
      {
        name: "description",
        content:
          "Ajukan pemulihan akses akun Football ID Nation melalui email terdaftar Anda secara aman.",
      },
      { property: "og:title", content: "Lupa Kata Sandi — Football ID Nation" },
      {
        property: "og:description",
        content: "Pemulihan akses akun Football ID Nation melalui email terdaftar.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://football-id-nation.lovable.app/forgot-password",
      },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [
      { rel: "canonical", href: "https://football-id-nation.lovable.app/forgot-password" },
    ],
  }),
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
          <Alert variant="destructive" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Permintaan gagal</AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        {submittedEmail ? (
          <Alert role="status">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Permintaan terkirim</AlertTitle>
            <AlertDescription>
              Jika {submittedEmail} terdaftar, tautan verifikasi pemulihan telah dikirim.
              Periksa kotak masuk dan folder spam Anda.
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
