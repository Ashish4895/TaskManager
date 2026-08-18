"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Project, type Todo, type TaskStatus } from "@/lib/api";

const TASK_SEED = (
  projects: Project[],
): { title: string; status: TaskStatus; priority: Todo["priority"]; projectId?: string }[] => {
  const homepage = projects.find((p) => p.name === "Design Homepage");
  const login = projects.find((p) => p.name === "Develop Login Feature");
  return [
    { title: "Hero section mockup", status: "todo", priority: "high", projectId: homepage?._id },
    { title: "Navigation wireframes", status: "doing", priority: "medium", projectId: homepage?._id },
    { title: "OAuth callback route", status: "todo", priority: "low", projectId: login?._id },
    { title: "Session persistence", status: "on_hold", priority: "none" },
  ];
};

export function useTasks(enabled: boolean, projects: Project[] = []) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seeded, setSeeded] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      setTodos(await api.getTodos());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!enabled || seeded || loading || todos.length > 0 || projects.length === 0) return;
    (async () => {
      const seeds = TASK_SEED(projects);
      await Promise.all(seeds.map((s) => api.createTodo(s)));
      setSeeded(true);
      await refresh();
    })();
  }, [enabled, seeded, loading, todos.length, projects, refresh]);

  const addTask = async (
    title: string,
    status: TaskStatus = "todo",
    projectId?: string,
  ) => {
    const todo = await api.createTodo({ title, status, projectId });
    setTodos((prev) => [todo, ...prev]);
    return todo;
  };

  const updateTask = async (id: string, patch: Parameters<typeof api.updateTodo>[1]) => {
    const updated = await api.updateTodo(id, patch);
    setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    return updated;
  };

  const moveTask = async (id: string, status: TaskStatus) => {
    return updateTask(id, { status });
  };

  const removeTask = async (id: string) => {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  return {
    todos,
    loading,
    error,
    refresh,
    addTask,
    updateTask,
    moveTask,
    removeTask,
    setTodos,
  };
}
