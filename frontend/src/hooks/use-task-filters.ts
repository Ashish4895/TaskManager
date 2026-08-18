"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Todo, TaskPriority } from "@/lib/api";
import { applyTaskFilters } from "@/components/tasks/task-helpers";

export function useTaskFilters(todos: Todo[], query: string, priority: TaskPriority | "all") {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const visible = useMemo(
    () => applyTaskFilters(todos, { query, priority, projectId }),
    [todos, query, priority, projectId],
  );

  return { visible, projectId };
}
