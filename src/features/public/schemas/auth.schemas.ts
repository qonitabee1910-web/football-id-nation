import { z } from "zod";

/**
 * Zod schemas — Sprint 2 Public Experience.
 * Fields are limited to the approved IDN-API-001 registration/authentication
 * contract. No additional fields may be introduced here.
 */

const email = z
  .string()
  .trim()
  .min(1, { message: "Email wajib diisi" })
  .email({ message: "Format email tidak valid" })
  .max(255, { message: "Email maksimal 255 karakter" });

const password = z
  .string()
  .min(12, { message: "Kata sandi minimal 12 karakter" })
  .max(128, { message: "Kata sandi maksimal 128 karakter" });

const personName = z
  .string()
  .trim()
  .min(2, { message: "Nama minimal 2 karakter" })
  .max(120, { message: "Nama maksimal 120 karakter" });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { message: "Kata sandi wajib diisi" }),
  rememberMe: z.boolean(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Scope note: IDN-API-001 C-01 RegisterPerson brings a *Person* into the
 * ecosystem. Organization / Association onboarding has no approved command in
 * C-01..C-22, so those roles are structurally absent from public self-service
 * registration until a contract amendment is approved by Council.
 */
export const REGISTRATION_ROLES = ["PLAYER", "GUARDIAN"] as const;
export type RegistrationRole = (typeof REGISTRATION_ROLES)[number];

export const roleStepSchema = z.object({
  role: z.enum(REGISTRATION_ROLES, {
    message: "Pilih salah satu peran",
  }),
});

export const registerSchema = z
  .object({
    role: z.enum(REGISTRATION_ROLES),
    fullName: personName,
    email,
    password,
    confirmPassword: z.string(),
    consentTerms: z.boolean(),
    consentPrivacy: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => data.consentTerms, {
    message: "Persetujuan ketentuan layanan wajib diberikan",
    path: ["consentTerms"],
  })
  .refine((data) => data.consentPrivacy, {
    message: "Persetujuan pemrosesan data wajib diberikan",
    path: ["consentPrivacy"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
