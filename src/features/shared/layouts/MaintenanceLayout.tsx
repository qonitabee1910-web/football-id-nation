import { Wrench, Clock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyLayout } from "./EmptyLayout";
import { PageContainer } from "@/components/ui/patterns/PageContainer";
import { ContentContainer } from "@/components/ui/patterns/ContentContainer";
import { Badge } from "@/components/ui/badge";

export interface MaintenanceLayoutProps {
  readonly title?: string;
  readonly description?: string;
  readonly scheduledFrom?: string;
  readonly scheduledTo?: string;
  readonly expectedBackAt?: string;
  readonly retryWindowMinutes?: number;
  readonly contactEmail?: string;
  readonly className?: string;
}

export function MaintenanceLayout({
  title = "Sistem dalam pemeliharaan terjadwal",
  description = "Kami sedang melakukan pembaruan untuk menjaga keamanan dan performa identitas sepak bola nasional. Akses Anda akan segera dipulihkan.",
  scheduledFrom,
  scheduledTo,
  expectedBackAt,
  retryWindowMinutes,
  contactEmail = "support@football-id.example",
  className,
}: MaintenanceLayoutProps) {
  return (
    <EmptyLayout centreContent maxWidth="md" {...(className ? { className } : {})}>
      <PageContainer as="div" maxWidth="md" className="py-0">
        <ContentContainer variant="outlined" padding="lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex h-28 w-28 items-center justify-center rounded-full bg-amber-500/10">
              <Wrench
                className="h-16 w-16 text-amber-600/80 dark:text-amber-400/80"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>

            <Badge variant="outline" className="mb-4 gap-1.5 border-amber-500/30 text-amber-700 dark:text-amber-400">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Pemeliharaan Sedang Berjalan
            </Badge>

            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>

            {(scheduledFrom || scheduledTo || expectedBackAt || retryWindowMinutes) ? (
              <dl
                role="group"
                aria-label="Detail jadwal pemeliharaan"
                className="mt-6 grid w-full max-w-md grid-cols-1 gap-3 text-sm md:grid-cols-2"
              >
                {scheduledFrom ? (
                  <InfoRow
                    label="Mulai"
                    value={new Date(scheduledFrom).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                  />
                ) : null}
                {scheduledTo ? (
                  <InfoRow
                    label="Selesai"
                    value={new Date(scheduledTo).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                  />
                ) : null}
                {expectedBackAt ? (
                  <InfoRow
                    label="Perkiraan kembali"
                    value={new Date(expectedBackAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
                  />
                ) : null}
                {typeof retryWindowMinutes === "number" ? (
                  <InfoRow
                    label="Coba ulang setiap"
                    value={`${retryWindowMinutes} menit`}
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                  />
                ) : null}
              </dl>
            ) : null}

            <div
              role="navigation"
              aria-label="Aksi saat pemeliharaan"
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Button
                variant="secondary"
                onClick={() => (typeof window !== "undefined" ? window.location.reload() : undefined)}
                className="min-h-[48px] sm:w-auto"
              >
                <Clock className="h-4 w-4" aria-hidden="true" />
                Coba Ulang
              </Button>
              <Button asChild variant="ghost" className="min-h-[48px] sm:w-auto">
                <a href={`mailto:${contactEmail}`}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Hubungi Dukungan
                </a>
              </Button>
              <Button asChild variant="default" className="min-h-[48px] sm:w-auto">
                <a href="/legal">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Baca Kebijakan
                </a>
              </Button>
            </div>

            <p
              role="note"
              className="mt-8 max-w-md text-xs leading-relaxed text-muted-foreground"
            >
              Pemeliharaan ini dilaksanakan untuk mematuhi kebijakan keamanan data dan
              perlindungan anak. Setiap akses selama jendela pemeliharaan dicatat audit.
            </p>
          </div>
        </ContentContainer>
      </PageContainer>
    </EmptyLayout>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  readonly label: string;
  readonly value: string;
  readonly icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/40 px-3 py-2 text-left">
      <div className="mt-0.5">{icon}</div>
      <div>
        <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
