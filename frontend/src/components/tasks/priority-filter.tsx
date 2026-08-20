"use client";

import { useRef, useState } from "react";
import { Flag } from "lucide-react";
import type { TaskPriority } from "@/lib/api";
import { PRIORITY_LABELS } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";

const OPTIONS: (TaskPriority | "all")[] = [
  "all",
  "urgent",
  "high",
  "medium",
  "low",
  "none",
];

export function PriorityFilter({
  value,
  onChange,
}: {
  value: TaskPriority | "all";
  onChange: (v: TaskPriority | "all") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const label = value === "all" ? "Priority" : PRIORITY_LABELS[value];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted",
          value !== "all" && "border-accent/40 bg-accent/5",
        )}
      >
        <Flag className="h-4 w-4" />
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-44 rounded-xl border border-border bg-card py-1 shadow-lg">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={cn(
                "flex w-full px-3 py-2 text-left text-sm hover:bg-muted",
                value === opt && "font-medium",
              )}
            >
              {opt === "all" ? "All priorities" : PRIORITY_LABELS[opt]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
