"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSubtasks } from "@/hooks/use-subtasks";
import { SubtaskRow } from "./subtask-row";

export function TaskSubtasksTable({
  todoId,
  parentTitle,
  enabled,
}: {
  todoId: string;
  parentTitle: string;
  enabled: boolean;
}) {
  const { subtasks, loading, addSubtask, removeSubtask } = useSubtasks(todoId, enabled);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      await addSubtask(trimmed);
      setTitle("");
      setAdding(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-10">
      <h3 className="mb-3 text-sm font-semibold">Subtasks for {parentTitle}</h3>
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>Task</span>
          <span>Priority</span>
          <span>Members</span>
          <span>Due Date</span>
          <span />
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          subtasks.map((s) => (
            <SubtaskRow
              key={s._id}
              subtask={s}
              onDelete={() => removeSubtask(s._id)}
            />
          ))
        )}

        {adding ? (
          <div className="flex items-center gap-2 border-t border-border px-4 py-3">
            <Input
              autoFocus
              placeholder="Subtask title"
              value={title}
              disabled={busy}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") {
                  setAdding(false);
                  setTitle("");
                }
              }}
            />
            <button
              type="button"
              className="text-sm font-medium text-accent"
              disabled={busy || !title.trim()}
              onClick={submit}
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Add Subtasks
          </button>
        )}
      </div>
    </section>
  );
}
