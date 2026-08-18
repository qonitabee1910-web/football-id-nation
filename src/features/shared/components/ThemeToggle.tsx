import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  readonly className?: string;
  readonly variant?: "icon" | "text";
  readonly size?: "sm" | "md" | "lg";
}

const themeMeta: Record<Theme, { label: string; icon: typeof Moon }> = {
  light: { label: "Terang", icon: Sun },
  dark: { label: "Gelap", icon: Moon },
  system: { label: "Sistem", icon: Monitor },
};

export function ThemeToggle({
  className,
  variant = "icon",
  size = "md",
}: ThemeToggleProps) {
  const { theme, setTheme, themeOptions, isDark } = useTheme();
  const CurrentIcon = themeMeta[theme].icon;
  const sizeClasses =
    size === "sm" ? "min-h-11 min-w-11" : size === "lg" ? "h-11 w-11" : "h-10 w-10";

  if (variant === "text") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-2", className)}
            aria-label={`Tema saat ini: ${themeMeta[theme].label}. Buka pilihan tema`}
          >
            <CurrentIcon className="h-4 w-4" aria-hidden="true" />
            <span>{themeMeta[theme].label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" role="menu" aria-label="Pilihan tema">
          {themeOptions.map((opt) => {
            const { label, icon: Icon } = themeMeta[opt];
            const selected = theme === opt;
            return (
              <DropdownMenuItem
                key={opt}
                onClick={() => setTheme(opt)}
                role="menuitemradio"
                aria-checked={selected}
                data-selected={selected}
                className="gap-2"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(sizeClasses, className)}
          aria-label={`Tema saat ini: ${themeMeta[theme].label}. Buka pilihan tema`}
        >
          {isDark ? (
            <Moon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Sun className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="menu" aria-label="Pilihan tema">
        {themeOptions.map((opt) => {
          const { label, icon: Icon } = themeMeta[opt];
          const selected = theme === opt;
          return (
            <DropdownMenuItem
              key={opt}
              onClick={() => setTheme(opt)}
              role="menuitemradio"
              aria-checked={selected}
              data-selected={selected}
              className="gap-2"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
