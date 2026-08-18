"use client";

import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import type { Todo } from "@/lib/api";
import { LIST_SECTIONS, PRIORITY_LABELS, STATUS_LABELS, type TaskStatus } from "@/lib/themes";
import { formatDate } from "@/lib/format-date";
import { groupByStatus } from "@/components/tasks/task-helpers";
import { Avatar } from "@/components/ui/avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";

function TaskListRow({
  todo,
  userInitials,
  onOpen,
}: {
  todo: Todo;
  userInitials: string;
  onOpen: () => void;
}) {
  return (
    <div
      className="grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr_40px] items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-muted/40"
      onClick={onOpen}
    >
      <span>{todo.title}</span>
      <PriorityBadge
        priority={todo.priority ?? "none"}
        label={PRIORITY_LABELS[todo.priority ?? "none"]}
      />
      <Avatar initials={userInitials} size="sm" />
      <span className="text-muted-foreground">{formatDate(todo.dueDate)}</span>
      <button type="button" className="rounded p-1 hover:bg-muted" onClick={(e) => e.stopPropagation()}>
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}

function TaskListSection({
  status,
  todos,
  userInitials,
  onAdd,
  onOpen,
}: {
  status: TaskStatus;
  todos: Todo[];
  userInitials: string;
  onAdd: () => void;
  onOpen: (todo: Todo) => void;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <ChevronDown className="h-4 w-4" />
        {STATUS_LABELS[status]}
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>Task</span>
          <span>Priority</span>
          <span>Members</span>
          <span>Due Date</span>
          <span />
        </div>
        {todos.map((todo) => (
          <TaskListRow
            key={todo._id}
            todo={todo}
            userInitials={userInitials}
            onOpen={() => onOpen(todo)}
          />
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>
    </section>
  );
}

export function TaskListView({
  todos,
  userInitials,
  onAdd,
  onOpen,
}: {
  todos: Todo[];
  userInitials: string;
  onAdd: (status: TaskStatus) => void;
  onOpen: (todo: Todo) => void;
}) {
  const byStatus = groupByStatus(todos);

  return (
    <div className="p-6">
      {LIST_SECTIONS.map((status) => (
        <TaskListSection
          key={status}
          status={status}
          todos={byStatus(status)}
          userInitials={userInitials}
          onAdd={() => onAdd(status)}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
