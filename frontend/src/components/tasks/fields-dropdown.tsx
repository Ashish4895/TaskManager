"use client";

import { useRef, useState } from "react";
import { Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import type { TaskView } from "@/lib/themes";

const FIELD_TOGGLES = ["Priority", "Members", "Due Date", "Status", "Labels"] as const;

export function FieldsDropdown({
  activeView,
  onViewChange,
}: {
  activeView: TaskView;
  onViewChange: (view: TaskView) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted"
      >
        <Columns3 className="h-4 w-4" />
        Fields
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-border bg-card p-3 shadow-lg">
          <div className="mb-2 flex rounded-lg border border-border p-1">
            {(["list", "board"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                className={cn(
                  "flex-1 rounded-md py-1 text-xs capitalize",
                  activeView === v ? "bg-muted font-medium" : "text-muted-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          {FIELD_TOGGLES.map((f) => (
            <label key={f} className="flex items-center gap-2 py-1 text-sm">
              <input type="checkbox" defaultChecked className="rounded" />
              {f}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
