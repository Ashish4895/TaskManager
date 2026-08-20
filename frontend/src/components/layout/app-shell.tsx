"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  LogOut,
  Moon,
  Palette,
  PanelLeft,
  Settings,
  Sun,
  Briefcase,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { Avatar } from "@/components/ui/avatar";
import {
  COLOR_LABELS,
  COLOR_MODES,
  COLOR_SWATCHES,
  THEMES,
  type ColorMode,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/tasks", label: "Tasks", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: Briefcase },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setThemeOpen(false);
        setColorOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = user?.fullName?.slice(0, 2) ?? "DX";

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border bg-sidebar transition-all",
          collapsed ? "w-16" : "w-56",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white">
            D
          </span>
          {!collapsed && <span className="text-sm font-semibold">Dexter</span>}
        </div>

        <div className="relative p-3" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted"
          >
            <Avatar initials={initials} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate text-left text-sm font-medium">
                  {user?.fullName ?? "Dexter"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </button>

          {menuOpen && !collapsed && (
            <div className="absolute left-3 right-3 top-full z-50 mt-1 rounded-xl border border-border bg-card p-3 shadow-lg">
              <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
                <Avatar initials={initials} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user?.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-muted"
                  onClick={() => {
                    setThemeOpen((v) => !v);
                    setColorOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Sun className="h-4 w-4" /> Change Theme
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                {themeOpen && (
                  <div className="ml-2 space-y-1 rounded-lg border border-border p-2">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTheme(t)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                      >
                        {t === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        <span className="capitalize">{t}</span>
                        {theme === t && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-muted"
                  onClick={() => {
                    setColorOpen((v) => !v);
                    setThemeOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: COLOR_SWATCHES[colorMode] }}
                    />
                    Color Mode
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                {colorOpen && (
                  <div className="ml-2 space-y-1 rounded-lg border border-border p-2">
                    {COLOR_MODES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColorMode(c as ColorMode)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                      >
                        <span
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: COLOR_SWATCHES[c] }}
                        />
                        {COLOR_LABELS[c]}
                        {colorMode === c && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}

                <Link
                  href="/settings/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted"
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>

                <button
                  type="button"
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-destructive hover:bg-muted disabled:opacity-50"
                  onClick={async () => {
                    setLoggingOut(true);
                    try {
                      await logout();
                      setMenuOpen(false);
                      router.replace("/login");
                    } finally {
                      setLoggingOut(false);
                    }
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Logging out…" : "Log out"}
                </button>
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Workspace</p>
          </div>
        )}

        <nav className="flex-1 space-y-1 px-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                pathname.startsWith(href)
                  ? "bg-muted text-foreground"
                  : "text-sidebar-foreground hover:bg-muted/60",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center border-b border-border px-4">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md p-2 hover:bg-muted"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
