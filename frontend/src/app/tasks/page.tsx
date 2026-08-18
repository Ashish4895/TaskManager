"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { TasksView } from "@/components/tasks/tasks-view";

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <TasksView />
    </Suspense>
  );
}
