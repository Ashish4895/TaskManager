"use client";

import Link from "next/link";
import { MoreHorizontal, Plus } from "lucide-react";
import type { Project } from "@/lib/api";
import type { TaskPriority } from "@/lib/themes";
import { PRIORITY_LABELS } from "@/lib/themes";
import { formatDate } from "@/lib/format-date";
import { Avatar } from "@/components/ui/avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";

export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/tasks?projectId=${project._id}`}
      className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0 hover:bg-muted/40"
    >
      <span>{project.name}</span>
      <PriorityBadge
        priority={project.priority as TaskPriority}
        label={PRIORITY_LABELS[project.priority as TaskPriority]}
      />
      <Avatar initials={project.leadInitials} color={project.leadColor} size="sm" />
      <span className="text-muted-foreground">{formatDate(project.dueDate)}</span>
      <button
        type="button"
        className="rounded p-1 hover:bg-muted"
        onClick={(e) => e.preventDefault()}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </Link>
  );
}

export function ProjectsTable({
  projects,
  onAdd,
}: {
  projects: Project[];
  onAdd: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span>Projects</span>
        <span>Priority</span>
        <span>Lead</span>
        <span>Due Date</span>
        <span />
      </div>
      {projects.map((p) => (
        <ProjectRow key={p._id} project={p} />
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Add Projects
      </button>
    </div>
  );
}
