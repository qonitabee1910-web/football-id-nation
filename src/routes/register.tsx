import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { AuthLayout } from "@/features/shared/layouts/AuthLayout";
import {
  AuthenticationCard,
  FormSection,
} from "@/features/public/components/AuthenticationCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  registerSchema,
  type RegisterInput,
  type RegistrationRole,
} from "@/features/public/schemas/auth.schemas";
import {
  isAuthBackendUnavailable,
  useRegisterMutation,
} from "@/features/public/hooks/usePublicAuth";

const REGISTER_LOADER_DEFAULTS = {
  meta: {
    title: "Daftar Football ID — Football ID Nation",
    description:
      "Buat Football ID: satu identitas digital sepak bola untuk pemain, wali, SSB, dan asosiasi di Indonesia.",
    canonical: "https://football-id-nation.lovable.app/register",
    ogImage: "https://football-id-nation.lovable.app/og-image-default.png",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    robots: "index, follow",
  },
  trace: { screen: "SCR-PUB-03", journey: ["JRN-01", "JRN-02"] },
} as const;

export const Route = createFileRoute("/register")({
  loader: () => REGISTER_LOADER_DEFAULTS,
  head: () => {
    const data = REGISTER_LOADER_DEFAULTS;
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
  component: RegisterPage,
});

const ROLE_OPTIONS: ReadonlyArray<{
  readonly value: RegistrationRole;
  readonly label: string;
  readonly description: string;
  readonly icon: typeof UserRound;
}> = [
  {
    value: "PLAYER",
    label: "Pemain",
    description: "Pemilik perjalanan sepak bola. Usia di bawah 18 memerlukan wali.",
    icon: UserRound,
  },
  {
    value: "GUARDIAN",
    label: "Wali / Orang Tua",
    description: "Memberikan persetujuan dan mendampingi pemain di bawah umur.",
    icon: Users,
  },
];

const STEP_LABELS = ["Pilih peran", "Data akun", "Persetujuan"] as const;

function RegisterPage() {
  const mutation = useRegisterMutation();
  const [step, setStep] = useState(0);
  const [succeeded, setSucceeded] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "PLAYER",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      consentTerms: false,
      consentPrivacy: false,
    },
    mode: "onBlur",
  });

  const role = form.watch("role");
  const errors = form.formState.errors;

  const goNext = async () => {
    const fields: Array<keyof RegisterInput> =
      step === 0
        ? ["role"]
        : ["fullName", "email", "password", "confirmPassword"];
    const valid = await form.trigger(fields);
    if (valid) setStep((current) => Math.min(current + 1, 2));
  };

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, { onSuccess: () => setSucceeded(true) });
  });

  return (
    <AuthLayout variant="register">
      <AuthenticationCard
        titleId="register-title"
        title="Daftar Football ID"
        description="Satu orang, satu akun, banyak peran. Football ID bersifat permanen dan sepenuhnya opaque — tidak memuat tahun, wilayah, atau fakta bisnis apa pun."
        footer={
          <p>
            Sudah punya Football ID?{" "}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Masuk di sini
            </Link>
          </p>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Langkah {step + 1} dari {STEP_LABELS.length} · {STEP_LABELS[step]}
            </span>
            <span>{Math.round(((step + 1) / STEP_LABELS.length) * 100)}%</span>
          </div>
          <Progress
            value={((step + 1) / STEP_LABELS.length) * 100}
            aria-label={`Kemajuan pendaftaran: langkah ${step + 1} dari ${STEP_LABELS.length}`}
          />
        </div>

        {mutation.isError ? (
          <Alert
            variant={isAuthBackendUnavailable(mutation.error) ? "unavailable" : "destructive"}
            role="alert"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>
              {isAuthBackendUnavailable(mutation.error)
                ? "Layanan belum tersedia"
                : "Pendaftaran gagal"}
            </AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        ) : null}

        {succeeded ? (
          <Alert role="status">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Pendaftaran diterima</AlertTitle>
            <AlertDescription>
              Periksa email Anda untuk menyelesaikan verifikasi akun.
            </AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          {step === 0 ? (
            <FormSection
              legend="Peran utama Anda"
              hint="Peran menentukan kapabilitas yang tersedia. Peran tambahan dapat ditambahkan kemudian tanpa membuat akun baru."
            >
              <RadioGroup
                value={role}
                onValueChange={(value) =>
                  form.setValue("role", value as RegistrationRole, { shouldDirty: true })
                }
                className="grid gap-3 sm:grid-cols-2"
                aria-label="Pilih peran utama"
              >
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const inputId = `role-${option.value}`;
                  return (
                    <Label
                      key={option.value}
                      htmlFor={inputId}
                      className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-4 font-normal transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                    >
                      <RadioGroupItem id={inputId} value={option.value} className="mt-1" />
                      <span className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                          {option.label}
                        </span>
                        <span className="text-xs leading-relaxed text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
              {errors.role ? (
                <p role="alert" className="text-xs text-destructive">
                  {errors.role.message}
                </p>
              ) : null}
            </FormSection>
          ) : null}

          {step === 1 ? (
            <FormSection
              legend="Data akun"
              hint="Hanya data minimum yang diperlukan untuk membuat akun dikumpulkan pada tahap ini."
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="register-name">Nama lengkap</Label>
                <Input
                  id="register-name"
                  autoComplete="name"
                  className="min-h-11"
                  aria-invalid={errors.fullName ? true : undefined}
                  aria-describedby={errors.fullName ? "register-name-error" : undefined}
                  {...form.register("fullName")}
                />
                {errors.fullName ? (
                  <p id="register-name-error" role="alert" className="text-xs text-destructive">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </div>



              <div className="flex flex-col gap-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="min-h-11"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                  {...form.register("email")}
                />
                {errors.email ? (
                  <p id="register-email-error" role="alert" className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="register-password">Kata sandi</Label>
                  <Input
                    id="register-password"
                    type="password"
                    autoComplete="new-password"
                    className="min-h-11"
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby="register-password-hint"
                    {...form.register("password")}
                  />
                  <p id="register-password-hint" className="text-xs text-muted-foreground">
                    Minimal 12 karakter.
                  </p>
                  {errors.password ? (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="register-confirm">Konfirmasi kata sandi</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    autoComplete="new-password"
                    className="min-h-11"
                    aria-invalid={errors.confirmPassword ? true : undefined}
                    aria-describedby={
                      errors.confirmPassword ? "register-confirm-error" : undefined
                    }
                    {...form.register("confirmPassword")}
                  />
                  {errors.confirmPassword ? (
                    <p
                      id="register-confirm-error"
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {errors.confirmPassword.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </FormSection>
          ) : null}

          {step === 2 ? (
            <FormSection
              legend="Persetujuan"
              hint="Persetujuan bersifat granular dan dapat dicabut kapan saja dari pengaturan akun."
            >
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="consent-terms"
                  className="mt-0.5"
                  checked={form.watch("consentTerms")}
                  onCheckedChange={(checked) =>
                    form.setValue("consentTerms", checked === true, { shouldDirty: true })
                  }
                  aria-describedby="consent-terms-desc"
                />
                <Label htmlFor="consent-terms" className="font-normal">
                  <span className="text-sm font-medium">Ketentuan Layanan</span>
                  <span id="consent-terms-desc" className="block text-xs text-muted-foreground">
                    Saya menyetujui Ketentuan Layanan platform Football ID.
                  </span>
                </Label>
              </div>
              {errors.consentTerms ? (
                <p role="alert" className="text-xs text-destructive">
                  {errors.consentTerms.message}
                </p>
              ) : null}

              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="consent-privacy"
                  className="mt-0.5"
                  checked={form.watch("consentPrivacy")}
                  onCheckedChange={(checked) =>
                    form.setValue("consentPrivacy", checked === true, { shouldDirty: true })
                  }
                  aria-describedby="consent-privacy-desc"
                />
                <Label htmlFor="consent-privacy" className="font-normal">
                  <span className="text-sm font-medium">Pemrosesan Data Akun (P1)</span>
                  <span id="consent-privacy-desc" className="block text-xs text-muted-foreground">
                    Saya menyetujui pemrosesan data akun untuk tujuan identitas dan
                    keamanan. Tujuan lain diminta terpisah.
                  </span>
                </Label>
              </div>
              {errors.consentPrivacy ? (
                <p role="alert" className="text-xs text-destructive">
                  {errors.consentPrivacy.message}
                </p>
              ) : null}

              <p className="flex items-start gap-2 rounded-lg bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                Kepentingan anak diutamakan. Pemain di bawah 13 tahun tidak pernah
                terekspos pada kapabilitas pemanduan bakat, dan persetujuan pelatihan
                model AI tidak pernah diberikan secara otomatis.
              </p>
            </FormSection>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 sm:w-auto"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              disabled={step === 0 || mutation.isPending}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali
            </Button>

            {step < 2 ? (
              <Button type="button" className="min-h-11 sm:w-auto" onClick={goNext}>
                Lanjut
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button type="submit" className="min-h-11 sm:w-auto" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
                ) : null}
                {mutation.isPending ? "Memproses…" : "Buat Football ID"}
              </Button>
            )}
          </div>
          <span aria-live="polite" className="sr-only">
            {mutation.isPending ? "Sedang memproses pendaftaran" : ""}
          </span>
        </form>
      </AuthenticationCard>
    </AuthLayout>
  );
}
