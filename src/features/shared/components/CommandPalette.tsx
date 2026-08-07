import { useMemo, useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  Bell,
  Settings,
  Sun,
  Moon,
  Monitor,
  FileText,
  Users,
  Activity,
  FileCheck,
  Home,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export interface CommandPaletteItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: LucideIcon;
  readonly keywords?: readonly string[];
  readonly group: string;
  readonly onSelect: () => void;
}

export interface CommandPaletteProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly authenticated?: boolean;
  readonly areaItems?: readonly CommandPaletteItem[];
  readonly children?: ReactNode;
}

const NAV_SHORTCUTS: readonly CommandPaletteItem[] = [
  { id: "nav-home", label: "Beranda", description: "Ke halaman utama", icon: Home, group: "Navigasi", keywords: ["home", "beranda", "utama"], onSelect: () => {} },
  { id: "nav-login", label: "Masuk", description: "Halaman login", icon: User, group: "Navigasi", keywords: ["login", "masuk", "signin"], onSelect: () => {} },
  { id: "nav-register", label: "Daftar", description: "Halaman pendaftaran", icon: Users, group: "Navigasi", keywords: ["register", "daftar", "signup"], onSelect: () => {} },
  { id: "nav-legal", label: "Ketentuan Hukum", description: "Kebijakan & ketentuan", icon: FileText, group: "Navigasi", keywords: ["legal", "kebijakan", "privasi"], onSelect: () => {} },
];

const AUTH_SHORTCUTS: readonly CommandPaletteItem[] = [
  { id: "nav-dashboard", label: "Dashboard Saya", icon: LayoutDashboard, group: "Akun", keywords: ["dashboard", "beranda"], onSelect: () => {} },
  { id: "nav-profile", label: "Profil", icon: User, group: "Akun", keywords: ["profile", "profil", "biodata"], onSelect: () => {} },
  { id: "nav-consent", label: "Persetujuan", icon: ShieldCheck, group: "Akun", keywords: ["consent", "persetujuan", "privasi"], onSelect: () => {} },
  { id: "nav-notifications", label: "Notifikasi", icon: Bell, group: "Akun", keywords: ["notifications", "notifikasi"], onSelect: () => {} },
  { id: "nav-settings", label: "Pengaturan", icon: Settings, group: "Akun", keywords: ["settings", "pengaturan"], onSelect: () => {} },
  { id: "nav-logout", label: "Keluar", icon: LogOut, group: "Akun", keywords: ["logout", "keluar", "sign out"], onSelect: () => {} },
];

export function CommandPalette({
  open,
  onOpenChange,
  authenticated = false,
  areaItems,
}: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const themeItems = useMemo<CommandPaletteItem[]>(() => {
    const meta: { key: Theme; label: string; icon: LucideIcon; keywords: string[] }[] = [
      { key: "light", label: "Tema Terang", icon: Sun, keywords: ["light", "terang", "mode terang"] },
      { key: "dark", label: "Tema Gelap", icon: Moon, keywords: ["dark", "gelap", "night", "malam"] },
      { key: "system", label: "Tema Sistem", icon: Monitor, keywords: ["system", "sistem", "auto", "otomatis"] },
    ];
    return meta.map((m) => ({
      id: `theme-${m.key}`,
      label: m.label,
      icon: m.icon,
      keywords: m.keywords,
      group: "Tampilan",
      onSelect: () => setTheme(m.key),
    }));
  }, [setTheme]);

  const staticItems = useMemo<CommandPaletteItem[]>(() => {
    const base = [...NAV_SHORTCUTS];
    if (authenticated) base.push(...AUTH_SHORTCUTS);
    return base;
  }, [authenticated]);

  const allItems = useMemo<CommandPaletteItem[]>(() => {
    const extras = areaItems ? [...areaItems] : [];
    return [...staticItems, ...extras, ...themeItems];
  }, [staticItems, areaItems, themeItems]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandPaletteItem[]>();
    for (const it of allItems) {
      const arr = map.get(it.group);
      if (arr) arr.push(it);
      else map.set(it.group, [it]);
    }
    return Array.from(map.entries());
  }, [allItems]);

  const applyNavigate = (item: CommandPaletteItem) => {
    const navigateMap: Record<string, string> = {
      "nav-home": "/",
      "nav-login": "/login",
      "nav-register": "/register",
      "nav-legal": "/legal",
      "nav-dashboard": "/player/",
      "nav-profile": "/player/profile",
      "nav-consent": "/player/consent",
      "nav-notifications": "/player/notifications",
      "nav-settings": "/player/settings",
      "nav-logout": "/login?loggedOut=true",
    };
    const target = navigateMap[item.id];
    if (target) {
      router.navigate({ to: target });
    } else {
      item.onSelect();
    }
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const filterFn = (value: string, search: string, keywords?: readonly string[]) => {
    if (!search.trim()) return 1;
    const needle = search.toLowerCase();
    if (value.toLowerCase().includes(needle)) return 1;
    if (keywords?.some((k) => k.toLowerCase().includes(needle))) return 1;
    return 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden rounded-lg p-0 shadow-lg sm:max-w-xl"
        aria-describedby="command-desc"
      >
        <DialogTitle className="sr-only">Palet Perintah</DialogTitle>
        <DialogDescription id="command-desc" className="sr-only">
          Cari navigasi, tindakan cepat, dan pengaturan tampilan.
        </DialogDescription>
        <Command
          className="rounded-lg"
          filter={(value, search, keywords) =>
            filterFn(value, search, keywords as readonly string[] | undefined)
          }
          loop
        >
          <CommandInput
            placeholder="Ketik untuk mencari atau pilih tindakan…"
            aria-label="Pencarian palet perintah"
            autoFocus
          />
          <CommandList>
            <CommandEmpty>Tidak ada hasil yang cocok.</CommandEmpty>
            {groups.map(([group, items], gIdx) => (
              <div key={group}>
                {gIdx > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={group}>
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.id}
                        value={[item.label, item.description, ...(item.keywords ?? [])].join(" ")}
                        keywords={item.keywords ? [...item.keywords] : []}
                        onSelect={() => applyNavigate(item)}
                        className={cn("gap-2")}
                      >
                        {Icon ? <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-sm font-medium">{item.label}</span>
                          {item.description ? (
                            <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                          ) : null}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
