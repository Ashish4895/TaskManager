"use client";

import { Plus } from "lucide-react";
import type { Todo } from "@/lib/api";
import type { TaskStatus } from "@/lib/themes";
import { STATUS_LABELS } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";

export function TaskColumn({
  status,
  todos,
  userInitials,
  userName,
  onAdd,
  onOpen,
  onDrop,
  onDragStart,
  dragOver,
}: {
  status: TaskStatus;
  todos: Todo[];
  userInitials: string;
  userName: string;
  onAdd: () => void;
  onOpen: (todo: Todo) => void;
  onDrop: () => void;
  onDragStart: (todo: Todo) => (e: React.DragEvent) => void;
  dragOver: boolean;
}) {
  return (
    <section
      className={cn(
        "min-w-[280px] flex-1 rounded-xl p-2 transition-colors",
        dragOver && "bg-muted/60",
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold">{STATUS_LABELS[status]}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="rounded p-1 hover:bg-muted"
          aria-label={`Add task to ${STATUS_LABELS[status]}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        {todos.map((todo) => (
          <TaskCard
            key={todo._id}
            todo={todo}
            userInitials={userInitials}
            userName={userName}
            onOpen={() => onOpen(todo)}
            onDragStart={onDragStart(todo)}
          />
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>
    </section>
  );
}
