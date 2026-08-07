import { ShieldQuestion, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export type UnifiedNotFoundVariant = "404" | "403";

export interface UnifiedNotFoundProps {
  variant?: UnifiedNotFoundVariant;
  onBackHome?: () => void;
  onTryAgain?: () => void;
  className?: string;
}

export function UnifiedNotFound({
  variant = "404",
  onBackHome,
  onTryAgain,
  className,
}: UnifiedNotFoundProps) {
  const code = variant === "404"
    ? t("error.notFound.code404", "404")
    : t("error.notFound.code403", "403");

  const handleBackHome = () => {
    if (onBackHome) {
      onBackHome();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const handleTryAgain = () => {
    if (onTryAgain) {
      onTryAgain();
      return;
    }
    if (typeof window !== "undefined") {
      window.location.reload();
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
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <ShieldQuestion
            className="h-32 w-32 text-primary/60"
            strokeWidth={1.25}
            aria-hidden="true"
          />
        </div>

        <h1 className="sr-only">{code}</h1>
        <span
          aria-hidden="true"
          className="mb-4 text-7xl font-bold tracking-tight text-primary/40 select-none"
        >
          {code}
        </span>

        <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {t("error.notFound.title", "Halaman tidak dapat diakses")}
        </h2>

        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {t(
            "error.notFound.description",
            "Periksa URL kembali atau gunakan navigasi untuk melanjutkan",
          )}
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="default" onClick={handleBackHome} className="sm:w-auto">
            <Home className="h-4 w-4" aria-hidden="true" />
            {t("error.notFound.backHome", "Kembali ke beranda")}
          </Button>
          <Button variant="secondary" onClick={handleTryAgain} className="sm:w-auto">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t("error.notFound.tryAgain", "Coba lagi")}
          </Button>
        </div>
      </div>
    </div>
  );
}
