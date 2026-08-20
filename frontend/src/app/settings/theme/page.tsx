"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { cn } from "@/lib/utils";

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsLayout>
      <h1 className="text-3xl font-semibold">Theme</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your theme preference is saved and persists across page refreshes.
      </p>

      <div className="mt-8 grid max-w-md gap-3">
        {(["light", "dark"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left",
              theme === t && "ring-2 ring-accent",
            )}
          >
            {t === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="capitalize">{t}</span>
            {theme === t && <span className="ml-auto text-sm">✓</span>}
          </button>
        ))}
      </div>
    </SettingsLayout>
  );
}
