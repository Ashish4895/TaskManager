"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Project } from "@/lib/api";

const SEED: Omit<Parameters<typeof api.createProject>[0], never>[] = [
  {
    name: "Design Homepage",
    priority: "high",
    leadInitials: "DX",
    leadColor: "#8b5cf6",
    dueDate: "2026-09-12",
  },
  {
    name: "Develop Login Feature",
    priority: "low",
    leadInitials: "CN",
    leadColor: "#71717a",
    dueDate: "2026-09-15",
  },
  {
    name: "Test Payment Gateway",
    priority: "medium",
    leadInitials: "+",
    leadColor: "#d4d4d8",
    dueDate: "2026-09-18",
  },
];

export function useProjects(enabled: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      let data = await api.getProjects();
      if (data.length === 0) {
        await Promise.all(SEED.map((p) => api.createProject(p)));
        data = await api.getProjects();
      }
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = async (name: string) => {
    const project = await api.createProject({ name });
    setProjects((prev) => [project, ...prev]);
  };

  return { projects, loading, refresh, addProject };
}
