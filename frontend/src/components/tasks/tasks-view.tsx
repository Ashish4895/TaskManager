"use client";

import { useEffect, useMemo, useState } from "react";
import type { Todo, TaskStatus, TaskPriority } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { PageHeader } from "@/components/layout/page-header";
import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { TaskBoardView } from "@/components/tasks/board/task-board-view";
import { TaskListView } from "@/components/tasks/list/task-list-view";
import { TaskDetailDrawer } from "@/components/tasks/detail/task-detail-drawer";
import { FieldsDropdown } from "@/components/tasks/fields-dropdown";
import { PriorityFilter } from "@/components/tasks/priority-filter";
import { TaskSearchBar } from "@/components/tasks/task-search-bar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useProjects } from "@/hooks/use-projects";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { useTasks } from "@/hooks/use-tasks";
import { VIEW_STORAGE_KEY, type TaskView } from "@/lib/themes";

export function TasksView() {
  const { user, ready } = useAuthGuard();
  const { projects } = useProjects(ready);
  const { todos, loading, addTask, updateTask, moveTask } = useTasks(ready, projects);
  const [view, setView] = useState<TaskView>("board");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "all">("all");
  const [selected, setSelected] = useState<Todo | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addStatus, setAddStatus] = useState<TaskStatus>("todo");

  const { visible, projectId } = useTaskFilters(todos, query, priority);

  const activeProject = useMemo(
    () => projects.find((p) => p._id === projectId),
    [projects, projectId],
  );

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "list" || stored === "board") setView(stored);
  }, []);

  if (!ready || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const userInitials = user!.fullName.slice(0, 2);
  const userName = user!.fullName.split(" ")[0];

  const handleAdd = (status: TaskStatus = "todo") => {
    setAddStatus(status);
    setAddOpen(true);
  };

  const submitAdd = async (title: string) => {
    await addTask(title, addStatus, projectId ?? undefined);
  };

  const openTask = (todo: Todo) => {
    setSelected(todo);
    setDrawerOpen(true);
  };

  const setTaskView = (v: TaskView) => {
    setView(v);
    localStorage.setItem(VIEW_STORAGE_KEY, v);
  };

  const breadcrumb = activeProject ? (
    <BreadcrumbNav
      items={[
        { label: "Projects", href: "/projects" },
        { label: activeProject.name },
      ]}
    />
  ) : null;

  return (
    <AppShell>
      <PageHeader
        title={activeProject ? activeProject.name : "Tasks"}
        breadcrumb={breadcrumb}
        onAdd={() => handleAdd()}
      >
        <TaskSearchBar value={query} onChange={setQuery} />
        <PriorityFilter value={priority} onChange={setPriority} />
        <FieldsDropdown activeView={view} onViewChange={setTaskView} />
      </PageHeader>

      {view === "board" ? (
        <TaskBoardView
          todos={visible}
          userInitials={userInitials}
          userName={userName}
          onAdd={handleAdd}
          onOpen={openTask}
          onMove={moveTask}
        />
      ) : (
        <TaskListView
          todos={visible}
          userInitials={userInitials}
          onAdd={handleAdd}
          onOpen={openTask}
        />
      )}

      <TaskDetailDrawer
        todo={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={async (id, patch) => {
          const updated = await updateTask(id, patch);
          setSelected(updated);
          return updated;
        }}
      />

      <AddTaskDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={submitAdd}
      />
    </AppShell>
  );
}
