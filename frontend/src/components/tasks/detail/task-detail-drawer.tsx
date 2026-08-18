"use client";

import { useEffect, useState } from "react";
import type { Todo } from "@/lib/api";
import { LABEL_PRESETS } from "@/components/tasks/task-helpers";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { TaskDetailSidebar } from "./task-detail-sidebar";
import { TaskSubtasksTable } from "./task-subtasks-table";
import { TaskComments } from "./task-comments";

type UpdatePatch = Parameters<
  (id: string, patch: Record<string, unknown>) => Promise<Todo>
>[1];

export function TaskDetailDrawer({
  todo,
  open,
  onClose,
  onUpdate,
}: {
  todo: Todo | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, patch: UpdatePatch) => Promise<Todo>;
}) {
  const [draft, setDraft] = useState<Todo | null>(todo);

  useEffect(() => {
    setDraft(todo);
  }, [todo]);

  if (!draft) return null;

  const save = async (patch: UpdatePatch) => {
    const updated = await onUpdate(draft._id, patch);
    setDraft(updated);
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 pt-14">
          <Input
            className="border-none bg-transparent px-0 text-2xl font-semibold shadow-none focus:ring-0"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            onBlur={() => save({ title: draft.title })}
          />
          <textarea
            className="mt-3 w-full resize-none rounded-lg border border-border bg-input p-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            rows={3}
            placeholder="Add a description..."
            value={draft.description ?? ""}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            onBlur={() => save({ description: draft.description })}
          />

          <section className="mt-8 space-y-4 border-t border-border pt-6 text-sm">
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <span className="text-muted-foreground">Assignee</span>
              <span className="w-fit rounded-full bg-muted px-3 py-1">Designer</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <span className="text-muted-foreground">Due Date</span>
              <Input
                type="date"
                className="max-w-[160px]"
                value={draft.dueDate?.slice(0, 10) ?? ""}
                onChange={(e) => {
                  const dueDate = e.target.value || undefined;
                  setDraft({ ...draft, dueDate });
                  save({ dueDate });
                }}
              />
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="text-muted-foreground">Labels</span>
              <div className="flex flex-wrap gap-2">
                {LABEL_PRESETS.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-border px-2 py-1 text-xs"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <TaskSubtasksTable
            todoId={draft._id}
            parentTitle={draft.title}
            enabled={open}
          />
          <TaskComments todoId={draft._id} enabled={open} />
        </div>

        <TaskDetailSidebar
          status={draft.status ?? "todo"}
          priority={draft.priority ?? "none"}
          dueDate={draft.dueDate}
          onStatusChange={(status) => save({ status })}
          onPriorityChange={(priority) => save({ priority })}
        />
      </div>
    </Drawer>
  );
}
