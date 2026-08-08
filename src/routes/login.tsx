import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, LogIn } from "lucide-react";
import { AuthLayout } from "@/features/shared/layouts/AuthLayout";
import { AuthenticationCard } from "@/features/public/components/AuthenticationCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/features/public/schemas/auth.schemas";
import { useLoginMutation } from "@/features/public/hooks/usePublicAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk — Football ID Nation" },
      {
        name: "description",
        content:
          "Masuk ke akun Football ID Nation untuk mengakses identitas sepak bola nasional Anda secara aman.",
      },
      { property: "og:title", content: "Masuk — Football ID Nation" },
      {
        property: "og:description",
        content: "Akses identitas sepak bola nasional Anda dengan aman.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://football-id-nation.lovable.app/login" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://football-id-nation.lovable.app/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const mutation = useLoginMutation();
  const [succeeded, setSucceeded] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onBlur",
  });

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, { onSuccess: () => setSucceeded(true) });
  });

  return (
    <AuthLayout variant="login">
      <AuthenticationCard
        titleId="login-title"
        title="Masuk"
        description="Gunakan email terdaftar Anda. Otorisasi diverifikasi di sisi server sesuai Konstitusi Pasal 8."
        footer={
          <p>
            Belum memiliki akun?{" "}
            <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Daftar Football ID
            </Link>
          </p>
        }
      >
        {mutation.isError ? (
          <Alert variant="destructive" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Gagal masuk</AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        {succeeded ? (
          <Alert role="status">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Berhasil masuk</AlertTitle>
            <AlertDescription>Mengalihkan ke area terautentikasi Anda.</AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={form.formState.errors.email ? true : undefined}
              aria-describedby={form.formState.errors.email ? "login-email-error" : undefined}
              className="min-h-11"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p id="login-email-error" role="alert" className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Kata sandi</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={form.formState.errors.password ? true : undefined}
              aria-describedby={
                form.formState.errors.password ? "login-password-error" : undefined
              }
              className="min-h-11"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p id="login-password-error" role="alert" className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="login-remember"
                checked={form.watch("rememberMe")}
                onCheckedChange={(checked) =>
                  form.setValue("rememberMe", checked === true, { shouldDirty: true })
                }
              />
              <Label htmlFor="login-remember" className="text-sm font-normal">
                Ingat saya di perangkat ini
              </Label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <Button type="submit" className="min-h-11 w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="h-4 w-4" aria-hidden="true" />
            )}
            {mutation.isPending ? "Memproses…" : "Masuk"}
          </Button>
          <span aria-live="polite" className="sr-only">
            {mutation.isPending ? "Sedang memproses permintaan masuk" : ""}
          </span>
        </form>
      </AuthenticationCard>
    </AuthLayout>
  );
}
