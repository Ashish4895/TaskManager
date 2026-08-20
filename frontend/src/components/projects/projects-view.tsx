"use client";

import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectsTable } from "@/components/projects/projects-table";
import { TaskSearchBar } from "@/components/tasks/task-search-bar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useProjects } from "@/hooks/use-projects";
import { useMemo, useState } from "react";

export function ProjectsView() {
  const { ready } = useAuthGuard();
  const { projects, loading, addProject } = useProjects(ready);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(q));
  }, [projects, query]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleAdd = async () => {
    const name = window.prompt("Project name");
    if (!name?.trim()) return;
    await addProject(name.trim());
  };

  return (
    <AppShell>
      <PageHeader title="Projects" addLabel="+ Add Project" onAdd={handleAdd}>
        <TaskSearchBar value={query} onChange={setQuery} />
      </PageHeader>
      <div className="p-6">
        <ProjectsTable projects={visible} onAdd={handleAdd} />
      </div>
    </AppShell>
  );
}
