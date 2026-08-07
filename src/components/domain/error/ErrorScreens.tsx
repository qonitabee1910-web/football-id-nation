import { Clock, Wrench, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export interface SessionExpiredProps {
  onLogin?: () => void;
  className?: string;
  returnUrl?: string;
}

export function SessionExpired({ onLogin, className, returnUrl }: SessionExpiredProps) {
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
      return;
    }
    if (typeof window !== "undefined") {
      const target = returnUrl
        ? `/login?return=${encodeURIComponent(returnUrl)}`
        : "/login";
      window.location.href = target;
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-[60vh] w-full items-center justify-center px-4 py-12",
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-amber-500/10">
          <Clock
            className="h-32 w-32 text-amber-500/70"
            strokeWidth={1.25}
            aria-hidden="true"
          />
        </div>

        <span
          aria-hidden="true"
          className="mb-4 text-7xl font-bold tracking-tight text-amber-500/40 select-none"
        >
          {t("error.sessionExpired.code", "401")}
        </span>

        <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {t("error.sessionExpired.title", "Sesi berakhir")}
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {t(
            "error.sessionExpired.description",
            "Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.",
          )}
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="default" onClick={handleLogin} className="sm:w-auto">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {t("error.sessionExpired.loginAgain", "Masuk kembali")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface MaintenanceProps {
  onBackHome?: () => void;
  className?: string;
  eta?: string;
}

export function Maintenance({
  onBackHome,
  className,
  eta,
}: MaintenanceProps) {
  const handleBackHome = () => {
    if (onBackHome) {
      onBackHome();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const displayEta = eta ?? t("error.maintenance.eta", "Kembali online dalam 30 menit");

  return (
    <div
      className={cn(
        "flex min-h-[60vh] w-full items-center justify-center px-4 py-12",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-blue-500/10">
          <Wrench
            className="h-32 w-32 text-blue-500/70 animate-spin-slow"
            strokeWidth={1.25}
            aria-hidden="true"
          />
        </div>

        <span
          aria-hidden="true"
          className="mb-4 text-7xl font-bold tracking-tight text-blue-500/40 select-none"
        >
          {t("error.maintenance.code", "503")}
        </span>

        <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {t("error.maintenance.title", "Pemeliharaan sistem")}
        </h1>

        <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
          {t(
            "error.maintenance.description",
            "Sistem sedang dalam pemeliharaan rutin untuk meningkatkan layanan.",
          )}
        </p>

        <p className="mb-8 text-sm font-medium text-foreground/80">{displayEta}</p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="default" onClick={handleBackHome} className="sm:w-auto">
            <Home className="h-4 w-4" aria-hidden="true" />
            {t("error.maintenance.backHome", "Kembali ke beranda")}
          </Button>
        </div>
      </div>
    </div>
  );
}
