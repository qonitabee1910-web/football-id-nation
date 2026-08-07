import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Info, ShieldAlert, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlobalSearchResult {
  readonly id: string;
  readonly scope: "lookup" | "roster" | "national" | "duplicate";
  readonly primary: string;
  readonly secondary?: string;
  readonly badge?: string;
  readonly masked?: boolean;
  readonly onClick?: () => void;
}

export interface GlobalSearchProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly loading?: boolean;
  readonly minChars?: number;
  readonly placeholder?: string;
  readonly allowedScopes?: readonly GlobalSearchResult["scope"][];
  readonly results?: readonly GlobalSearchResult[];
  readonly onQueryChange?: (query: string) => void;
  readonly errorMessage?: string | null;
  readonly authenticated?: boolean;
}

const SCOPE_LABELS: Record<GlobalSearchResult["scope"], { label: string; hint: string }> = {
  lookup: { label: "Cari Kode ID", hint: "Min. 3 karakter. Setiap upaya tercatat audit." },
  roster: { label: "Daftar Roster", hint: "Hanya pemain di klub Anda." },
  national: { label: "Pencarian Nasional", hint: "Terbatas untuk Federasi." },
  duplicate: { label: "Kandidat Duplikat", hint: "Pencocokan identitas." },
};

export function GlobalSearch({
  open,
  onOpenChange,
  loading = false,
  minChars = 3,
  placeholder = "Cari Football ID, nama, atau kode…",
  allowedScopes = ["lookup"],
  results = [],
  onQueryChange,
  errorMessage,
  authenticated = true,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [activeScope, setActiveScope] = useState<GlobalSearchResult["scope"]>(
    allowedScopes[0] ?? "lookup",
  );
  const tooShort = query.trim().length < minChars;

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (tooShort) return;
    const id = window.setTimeout(() => onQueryChange?.(query.trim()), 220);
    return () => window.clearTimeout(id);
  }, [query, tooShort, onQueryChange]);

  const scopedResults = results.filter((r) => r.scope === activeScope);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="global-search-dialog"
        className="flex h-[85vh] max-h-[640px] w-[95vw] max-w-2xl flex-col gap-0 p-0"
        aria-describedby="global-search-desc"
      >
        <DialogHeader className="gap-2 border-b px-4 py-3 md:px-5 md:py-4">
          <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <Search className="h-5 w-5 text-primary" aria-hidden="true" />
            Pencarian
            {authenticated ? null : (
              <Badge variant="outline" className="ml-1 text-[10px]">
                Masuk diperlukan
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription id="global-search-desc" className="sr-only">
            Cari berdasarkan kode Football ID, nama pemain, atau lingkup organisasi.
          </DialogDescription>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Kata kunci pencarian"
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "global-search-error" : undefined}
              className="h-11 pl-9 pr-16"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-muted-foreground">
              <kbd className="rounded border border-border bg-background px-1 font-mono">ESC</kbd>
              <span className="sr-only">Tutup dengan ESC</span>
            </div>
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            {SCOPE_LABELS[activeScope].hint}
          </p>
          {errorMessage ? (
            <p
              id="global-search-error"
              role="alert"
              className="text-xs font-medium text-destructive"
            >
              {errorMessage}
            </p>
          ) : null}
        </DialogHeader>

        {allowedScopes.length > 1 ? (
          <div className="border-b px-2 pt-1 md:px-4">
            <TabsList className="h-9 bg-transparent p-0">
              {allowedScopes.map((scope) => (
                <TabsTrigger
                  key={scope}
                  value={scope}
                  onClick={() => setActiveScope(scope)}
                  className="h-8 rounded-none border-b-2 border-transparent px-3 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  {SCOPE_LABELS[scope].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        ) : (
          <Tabs defaultValue={allowedScopes[0] ?? "lookup"} className="hidden">
            <TabsList>
              <TabsTrigger value={allowedScopes[0] ?? "lookup"} />
            </TabsList>
          </Tabs>
        )}

        <ScrollArea className="min-h-0 flex-1 px-2 pb-4 md:px-4">
          <div className="mt-4 md:mt-5">
            {authenticated === false ? (
              <LoginRequiredState />
            ) : tooShort ? (
              <HintState minChars={minChars} />
            ) : loading && scopedResults.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => <ResultSkeleton key={i} />)
            ) : scopedResults.length === 0 ? (
              <NoResultsState query={query} />
            ) : (
              <ul className="space-y-1.5 md:space-y-2" role="listbox">
                {scopedResults.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={r.onClick}
                      className={cn(
                        "group flex w-full min-h-[48px] items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                      role="option"
                      aria-selected="false"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Search className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {r.masked ? maskForNonOwner(r.primary) : r.primary}
                          </p>
                          {r.secondary ? (
                            <p className="truncate text-xs text-muted-foreground">{r.secondary}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {r.badge ? (
                          <Badge variant="outline" className="text-[10px]">
                            {r.badge}
                          </Badge>
                        ) : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function maskForNonOwner(value: string): string {
  if (value.length <= 4) return "••••";
  const last4 = value.slice(-4);
  return `${"•".repeat(Math.max(value.length - 4, 3))}${last4}`;
}

function ResultSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
      <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function HintState({ minChars }: { readonly minChars: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Clock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-sm font-semibold">Ketik setidaknya {minChars} karakter</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Pencarian akan berjalan otomatis setelah Anda mengetik cukup karakter.
        </p>
      </div>
    </div>
  );
}

function NoResultsState({ query }: { readonly query: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Search className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-sm font-semibold">Tidak ada hasil untuk "{query}"</h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Coba kode ID yang berbeda atau periksa ejaan nama yang Anda masukkan.
        </p>
      </div>
    </div>
  );
}

function LoginRequiredState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Info className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-sm font-semibold">Masuk untuk menggunakan pencarian</h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Fitur pencarian Football ID memerlukan autentikasi untuk audit dan pembatasan laju.
        </p>
      </div>
      <Button asChild size="sm">
        <a href="/login">Masuk</a>
      </Button>
    </div>
  );
}
