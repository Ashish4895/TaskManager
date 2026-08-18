import type { Todo, TaskPriority, TaskStatus } from "@/lib/api";

export function normalizeStatus(todo: Todo): TaskStatus {
  if (todo.status) return todo.status;
  return todo.completed ? "completed" : "todo";
}

export function groupByStatus(todos: Todo[]) {
  return (status: TaskStatus) =>
    todos.filter((t) => normalizeStatus(t) === status);
}

export function filterTodos(todos: Todo[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return todos;
  return todos.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q),
  );
}

export function applyTaskFilters(
  todos: Todo[],
  {
    query,
    priority,
    projectId,
  }: {
    query: string;
    priority: TaskPriority | "all";
    projectId: string | null;
  },
) {
  let result = todos;
  if (projectId) {
    result = result.filter((t) => t.projectId === projectId);
  }
  if (priority !== "all") {
    result = result.filter((t) => (t.priority ?? "none") === priority);
  }
  return filterTodos(result, query);
}

export const LABEL_PRESETS = [
  "Research",
  "Design",
  "Development",
  "Testing",
  "Deployment",
] as const;

export function priorityColor(priority: TaskPriority) {
  const map: Record<TaskPriority, string> = {
    none: "#71717a",
    urgent: "#dc2626",
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#3b82f6",
  };
  return map[priority];
}
