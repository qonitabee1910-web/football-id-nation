import { useMutation } from "@tanstack/react-query";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "../schemas/auth.schemas";

/**
 * Sprint 2 is UI-only. IDN-API-001 command endpoints are not implemented until
 * Sprint 3 (Identity backend). These hooks own loading / error / retry state and
 * deliberately surface a documented, non-silent failure instead of fabricating
 * a successful response (Constitution Art. 11 — never fake a passing path).
 */
export const AUTH_BACKEND_PENDING_MESSAGE =
  "Layanan identitas belum aktif pada rilis ini. Fungsi ini akan tersedia setelah Sprint 3 (Identity Backend) disetujui Council.";

class AuthBackendPendingError extends Error {
  public constructor(public readonly command: string) {
    super(AUTH_BACKEND_PENDING_MESSAGE);
    this.name = "AuthBackendPendingError";
  }
}

function pending(command: string): Promise<never> {
  return Promise.reject(new AuthBackendPendingError(command));
}

export function useLoginMutation() {
  return useMutation<void, Error, LoginInput>({
    mutationKey: ["auth", "login"],
    mutationFn: () => pending("C-01 AuthenticateAccount"),
    retry: false,
  });
}

export function useRegisterMutation() {
  return useMutation<void, Error, RegisterInput>({
    mutationKey: ["auth", "register"],
    mutationFn: () => pending("C-02 RegisterAccount"),
    retry: false,
  });
}

export function useForgotPasswordMutation() {
  return useMutation<void, Error, ForgotPasswordInput>({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: () => pending("C-03 RequestCredentialRecovery"),
    retry: false,
  });
}
