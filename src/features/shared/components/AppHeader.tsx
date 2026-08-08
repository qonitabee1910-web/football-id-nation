import { Link, useRouter } from "@tanstack/react-router";
import { Search, Bell, Command as CommandIcon, LogOut, UserCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface AppHeaderProps {
  readonly title?: string;
  readonly searchOpen: boolean;
  readonly onSearchOpenChange: (open: boolean) => void;
  readonly commandOpen: boolean;
  readonly onCommandOpenChange: (open: boolean) => void;
  readonly notificationOpen: boolean;
  readonly onNotificationOpenChange: (open: boolean) => void;
  readonly unreadNotifications?: number;
  readonly displayName?: string | null;
  readonly displayCode?: string | null;
  readonly authenticated?: boolean;
  readonly homeTo?: string;
  readonly leftSlot?: ReactNode;
  readonly rightSlot?: ReactNode;
  readonly className?: string;
}

function initialsFrom(name: string | null | undefined): string {
  if (!name) return "ID";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "ID";
}

export function AppHeader({
  title,
  searchOpen,
  onSearchOpenChange,
  commandOpen,
  onCommandOpenChange,
  notificationOpen,
  onNotificationOpenChange,
  unreadNotifications = 0,
  displayName,
  displayCode,
  authenticated = false,
  homeTo = "/",
  leftSlot,
  rightSlot,
  className,
}: AppHeaderProps) {
  const router = useRouter();
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login?loggedOut=true";
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:h-16 md:px-6",
        className,
      )}
      role="banner"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to={homeTo}
          className="flex shrink-0 items-center gap-2"
          aria-label="Ke halaman utama"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden md:block">
            <span className="text-sm font-semibold tracking-tight">Football ID Nation</span>
          </span>
        </Link>
        {title ? (
          <>
            <span
              className="hidden h-5 w-px bg-border md:block"
              role="separator"
              aria-hidden="true"
            />
            <h1 className="truncate text-sm font-semibold md:text-base">{title}</h1>
          </>
        ) : null}
        {leftSlot}
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSearchOpenChange(true)}
          aria-label="Buka pencarian"
          aria-expanded={searchOpen}
          aria-controls="global-search-dialog"
          className="relative h-9 w-9 md:hidden"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </Button>

        <button
          type="button"
          onClick={() => onCommandOpenChange(true)}
          aria-label="Buka palet perintah"
          aria-expanded={commandOpen}
          className="group hidden h-9 items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/60 md:flex md:w-64"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-left">Cari atau ketik perintah…</span>
          <kbd
            className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground"
            aria-hidden="true"
          >
            <CommandIcon className="h-3 w-3" /> K
          </kbd>
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCommandOpenChange(true)}
          aria-label="Buka palet perintah"
          aria-expanded={commandOpen}
          className="h-9 w-9 md:hidden"
        >
          <CommandIcon className="h-5 w-5" aria-hidden="true" />
        </Button>

        {rightSlot}

        {authenticated ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNotificationOpenChange(true)}
              aria-label={
                unreadNotifications > 0
                  ? `${unreadNotifications} notifikasi baru. Buka pusat notifikasi`
                  : "Buka pusat notifikasi"
              }
              aria-expanded={notificationOpen}
              aria-controls="notification-center"
              className="relative h-9 w-9"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadNotifications > 0 ? (
                <Badge
                  variant="destructive"
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
                  aria-label={`${unreadNotifications} belum dibaca`}
                >
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </Badge>
              ) : null}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 gap-2 rounded-full pr-2"
                  aria-label="Buka menu akun"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs font-semibold">
                      {initialsFrom(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">
                    {displayName ?? "Akun"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" role="menu">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold">{displayName ?? "Pengguna"}</p>
                    {displayCode ? (
                      <p className="font-mono text-xs text-muted-foreground">{displayCode}</p>
                    ) : null}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild role="menuitem">
                    <a href="/player/profile" className="gap-2">
                      <UserCircle className="h-4 w-4" aria-hidden="true" />
                      Profil
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild role="menuitem">
                    <a href="/player/settings" className="gap-2">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      Pengaturan
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 text-destructive focus:text-destructive"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href="/login">Masuk</a>
            </Button>
            <Button asChild size="sm">
              <a href="/register">Daftar</a>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
