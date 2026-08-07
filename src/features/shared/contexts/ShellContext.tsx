import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AreaKey, ShellContextValue } from "../types";

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({ children }: { readonly children: ReactNode }) {
  const [activeArea, setActiveArea] = useState<AreaKey | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const value = useMemo<ShellContextValue>(
    () => ({
      activeArea,
      setActiveArea,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
    }),
    [activeArea, sidebarOpen, toggleSidebar],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext);
  if (ctx == null) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return ctx;
}
