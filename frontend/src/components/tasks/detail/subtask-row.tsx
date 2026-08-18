"use client";

import { MoreHorizontal } from "lucide-react";
import type { Subtask } from "@/lib/api";
import type { TaskPriority } from "@/lib/themes";
import { PRIORITY_LABELS } from "@/lib/themes";
import { formatDate } from "@/lib/format-date";
import { Avatar } from "@/components/ui/avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";

export function SubtaskRow({
  subtask,
  onDelete,
}: {
  subtask: Subtask;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0">
      <span>{subtask.title}</span>
      <PriorityBadge
        priority={subtask.priority as TaskPriority}
        label={PRIORITY_LABELS[subtask.priority as TaskPriority]}
      />
      <Avatar initials={subtask.assigneeInitials ?? "—"} size="sm" />
      <span className="text-muted-foreground">{formatDate(subtask.dueDate)}</span>
      <button
        type="button"
        className="rounded p-1 hover:bg-muted"
        onClick={onDelete}
        aria-label="Delete subtask"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}
