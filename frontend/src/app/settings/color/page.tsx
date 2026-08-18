"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { COLOR_LABELS, COLOR_MODES, COLOR_SWATCHES, type ColorMode } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function ColorSettingsPage() {
  const { colorMode, setColorMode } = useTheme();

  return (
    <SettingsLayout>
      <h1 className="text-3xl font-semibold">Color</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose an accent color for the app. Saved in local storage.
      </p>

      <div className="mt-8 grid max-w-md gap-2">
        {COLOR_MODES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColorMode(c as ColorMode)}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left",
              colorMode === c && "ring-2 ring-accent",
            )}
          >
            <span
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: COLOR_SWATCHES[c] }}
            />
            {COLOR_LABELS[c]}
            {colorMode === c && <span className="ml-auto text-sm">✓</span>}
          </button>
        ))}
      </div>
    </SettingsLayout>
  );
}
