"use client";

import type { Todo } from "@/lib/api";
import { formatShortDate } from "@/lib/format-date";
import { Avatar } from "@/components/ui/avatar";

export function TaskCard({
  todo,
  userInitials,
  userName,
  onOpen,
  onDragStart,
}: {
  todo: Todo;
  userInitials: string;
  userName: string;
  onOpen: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="font-medium">{todo.title}</h3>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Avatar initials={userInitials} size="sm" />
        <span>{userName}</span>
        <span>·</span>
        <span>{formatShortDate(todo.dueDate)}</span>
      </div>
      <div className="mt-3 inline-flex rounded-full bg-muted px-2 py-1 text-xs">
        Deployment
      </div>
    </article>
  );
}
