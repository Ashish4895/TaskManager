"use client";

import type { TaskPriority, TaskStatus } from "@/lib/api";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/themes";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { formatDate } from "@/lib/format-date";

const PRIORITIES: TaskPriority[] = ["none", "urgent", "high", "medium", "low"];
const STATUSES: TaskStatus[] = ["todo", "doing", "completed", "on_hold"];

export function TaskDetailSidebar({
  status,
  priority,
  dueDate,
  onStatusChange,
  onPriorityChange,
}: {
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  onStatusChange: (s: TaskStatus) => void;
  onPriorityChange: (p: TaskPriority) => void;
}) {
  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-border bg-muted/20 p-6 pt-14">
      <h3 className="text-sm font-semibold">Details</h3>

      <div className="mt-6 space-y-5 text-sm">
        <Field label="Status">
          <select
            className="w-full rounded-lg border border-border bg-card px-2 py-1.5"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority">
          <select
            className="w-full rounded-lg border border-border bg-card px-2 py-1.5"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <PriorityBadge priority={priority} label={PRIORITY_LABELS[priority]} />
          </div>
        </Field>

        <Field label="Due Date">
          <span className="text-muted-foreground">{formatDate(dueDate)}</span>
        </Field>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
