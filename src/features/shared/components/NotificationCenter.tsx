import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Info,
  AlertTriangle,
  ShieldCheck,
  Activity,
  MoreHorizontal,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "../types";

export interface NotificationCenterProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly items?: readonly NotificationItem[];
  readonly loading?: boolean;
  readonly onMarkRead?: (id: string) => void;
  readonly onMarkAllRead?: () => void;
  readonly onDismiss?: (id: string) => void;
  readonly authenticated?: boolean;
}

const TYPE_META: Record<NotificationItem["type"], { label: string; icon: LucideIcon; className: string }> = {
  info: { label: "Info", icon: Info, className: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  success: { label: "Berhasil", icon: ShieldCheck, className: "bg-green-500/15 text-green-700 dark:text-green-300" },
  warning: { label: "Perhatian", icon: AlertTriangle, className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  danger: { label: "Kritis", icon: AlertTriangle, className: "bg-red-500/15 text-red-700 dark:text-red-300" },
};

function NotificationCard({
  item,
  onMarkRead,
  onDismiss,
}: {
  readonly item: NotificationItem;
  readonly onMarkRead?: (id: string) => void;
  readonly onDismiss?: (id: string) => void;
}) {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  return (
    <article
      aria-labelledby={`notif-${item.id}-title`}
      className={cn(
        "relative rounded-lg border p-4 transition-colors",
        item.read ? "bg-transparent border-transparent" : "bg-accent/30 border-border",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            meta.className,
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              id={`notif-${item.id}-title`}
              className={cn("text-sm", item.read ? "font-normal" : "font-semibold")}
            >
              {item.title}
            </p>
            <div className="flex shrink-0 items-center gap-0.5">
              {!item.read ? (
                <button
                  type="button"
                  onClick={() => onMarkRead?.(item.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={`Tandai "${item.title}" sudah dibaca`}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={`Opsi untuk notifikasi: ${item.title}`}
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {!item.read ? (
                    <DropdownMenuItem onClick={() => onMarkRead?.(item.id)} className="gap-2">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Tandai dibaca
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem onClick={() => onDismiss?.(item.id)} className="gap-2 text-destructive focus:text-destructive">
                    <X className="h-4 w-4" aria-hidden="true" />
                    Hapus notifikasi
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {item.message ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.message}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <time
              dateTime={item.timestamp}
              className="text-xs text-muted-foreground"
            >
              {new Date(item.timestamp).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
            {item.action ? (
              <Button asChild variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                <Link to={item.action.to}>
                  {item.action.label}
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
        {!item.read ? (
          <span
            className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary"
            aria-label="Belum dibaca"
          />
        ) : null}
      </div>
    </article>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-lg border border-transparent p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter({
  open,
  onOpenChange,
  items = [],
  loading = false,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  authenticated = true,
}: NotificationCenterProps) {
  const unread = items.filter((i) => !i.read).length;
  const today = items.filter((i) => {
    const d = new Date(i.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const earlier = items.filter((i) => !today.includes(i));

  if (!authenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notifikasi tidak tersedia</DialogTitle>
            <DialogDescription>
              Silakan masuk untuk melihat notifikasi terkait perjalanan Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button asChild variant="secondary" size="sm">
              <a href="/login">Masuk</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="notification-center"
        className="flex h-[85vh] max-h-[720px] w-[95vw] max-w-xl flex-col gap-0 p-0 sm:w-full"
        aria-describedby="notif-desc"
      >
        <DialogHeader className="border-b px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
              <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
              Pusat Notifikasi
              {unread > 0 ? (
                <Badge variant="default" className="ml-1 rounded-full px-2 text-[10px]">
                  {unread} baru
                </Badge>
              ) : null}
            </DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllRead}
                disabled={unread === 0}
                className="h-8 gap-1"
                aria-label="Tandai semua notifikasi sudah dibaca"
              >
                <CheckCheck className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Semua dibaca</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
                aria-label="Buka pengaturan notifikasi"
              >
                <a href="/player/settings">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
          <DialogDescription id="notif-desc" className="sr-only">
            Daftar notifikasi informasi, aktivitas, dan perhatian terkait akun.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b px-2 pt-1 md:px-4">
            <TabsList className="h-9 bg-transparent p-0">
              <TabsTrigger value="all" className="h-8 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="relative h-8 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                Belum dibaca
                {unread > 0 ? (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">
                    {unread}
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="h-8 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
              >
                <Activity className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Aktivitas
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="min-h-0 flex-1 px-2 pb-4 md:px-4">
            <TabsContent value="all" className="mt-4 space-y-2 md:mt-5 md:space-y-3">
              {loading && items.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => <LoadingCard key={i} />)
              ) : items.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {today.length > 0 ? (
                    <Section label="Hari ini">
                      {today.map((item) => (
                        <NotificationCard
                          key={item.id}
                          item={item}
                          onMarkRead={onMarkRead ?? (() => {})}
                          onDismiss={onDismiss ?? (() => {})}
                        />
                      ))}
                    </Section>
                  ) : null}
                  {earlier.length > 0 ? (
                    <Section label="Sebelumnya">
                      {earlier.map((item) => (
                        <NotificationCard
                          key={item.id}
                          item={item}
                          onMarkRead={onMarkRead ?? (() => {})}
                          onDismiss={onDismiss ?? (() => {})}
                        />
                      ))}
                    </Section>
                  ) : null}
                </>
              )}
            </TabsContent>

            <TabsContent value="unread" className="mt-4 space-y-2 md:mt-5 md:space-y-3">
              {loading && items.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => <LoadingCard key={i} />)
              ) : unread === 0 ? (
                <EmptyState title="Tidak ada notifikasi baru" subtitle="Semua notifikasi sudah dibaca." />
              ) : (
                items
                  .filter((i) => !i.read)
                  .map((item) => (
                    <NotificationCard
                      key={item.id}
                      item={item}
                      onMarkRead={onMarkRead ?? (() => {})}
                      onDismiss={onDismiss ?? (() => {})}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-4 space-y-2 md:mt-5 md:space-y-3">
              {loading && items.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
              ) : (
                items
                  .filter((i) => i.type === "success" || i.type === "info")
                  .map((item) => (
                    <NotificationCard
                      key={item.id}
                      item={item}
                      onMarkRead={onMarkRead ?? (() => {})}
                      onDismiss={onDismiss ?? (() => {})}
                    />
                  ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Section({ label, children }: { readonly label: string; readonly children: React.ReactNode }) {
  return (
    <section aria-labelledby={`notif-section-${label}`} className="space-y-2 md:space-y-3">
      <h2
        id={`notif-section-${label}`}
        className="sticky top-0 z-10 bg-background/95 px-1 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur"
      >
        {label}
      </h2>
      {children}
    </section>
  );
}

function EmptyState({
  title = "Belum ada notifikasi",
  subtitle = "Notifikasi terkait aktivitas, persetujuan, dan verifikasi akan muncul di sini.",
}: {
  readonly title?: string;
  readonly subtitle?: string;
}) {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
      role="status"
    >
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Bell className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  );
}
