"use client";

import { useState } from "react";
import type { Todo } from "@/lib/api";
import { BOARD_COLUMNS, type TaskStatus } from "@/lib/themes";
import { groupByStatus } from "@/components/tasks/task-helpers";
import { TaskColumn } from "@/components/tasks/board/task-column";

export function TaskBoardView({
  todos,
  userInitials,
  userName,
  onAdd,
  onOpen,
  onMove,
}: {
  todos: Todo[];
  userInitials: string;
  userName: string;
  onAdd: (status: TaskStatus) => void;
  onOpen: (todo: Todo) => void;
  onMove: (todoId: string, status: TaskStatus) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null);
  const byStatus = groupByStatus(todos);

  const handleDrop = (status: TaskStatus) => {
    if (draggingId) onMove(draggingId, status);
    setDraggingId(null);
    setOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto p-6">
      {BOARD_COLUMNS.map((status) => (
        <div
          key={status}
          onDragEnter={() => setOverColumn(status)}
          onDragLeave={() => setOverColumn((c) => (c === status ? null : c))}
        >
          <TaskColumn
            status={status}
            todos={byStatus(status)}
            userInitials={userInitials}
            userName={userName}
            onAdd={() => onAdd(status)}
            onOpen={onOpen}
            dragOver={overColumn === status}
            onDrop={() => handleDrop(status)}
            onDragStart={(todo) => (e) => {
              setDraggingId(todo._id);
              e.dataTransfer.setData("text/plain", todo._id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
