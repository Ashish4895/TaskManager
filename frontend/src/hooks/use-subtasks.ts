"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Subtask, type TaskPriority } from "@/lib/api";

export function useSubtasks(todoId: string | null, enabled: boolean) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled || !todoId) {
      setSubtasks([]);
      return;
    }
    setLoading(true);
    try {
      setSubtasks(await api.getSubtasks(todoId));
    } finally {
      setLoading(false);
    }
  }, [enabled, todoId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSubtask = async (title: string, priority: TaskPriority = "none") => {
    if (!todoId) return;
    const subtask = await api.createSubtask(todoId, { title, priority });
    setSubtasks((prev) => [...prev, subtask]);
    return subtask;
  };

  const updateSubtask = async (
    id: string,
    patch: Parameters<typeof api.updateSubtask>[2],
  ) => {
    if (!todoId) return;
    const updated = await api.updateSubtask(todoId, id, patch);
    setSubtasks((prev) => prev.map((s) => (s._id === id ? updated : s)));
    return updated;
  };

  const removeSubtask = async (id: string) => {
    if (!todoId) return;
    await api.deleteSubtask(todoId, id);
    setSubtasks((prev) => prev.filter((s) => s._id !== id));
  };

  return { subtasks, loading, refresh, addSubtask, updateSubtask, removeSubtask };
}
