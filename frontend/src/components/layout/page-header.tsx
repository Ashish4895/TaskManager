"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  breadcrumb,
  onAdd,
  addLabel = "+ Add Task",
  children,
  className,
}: {
  title: string;
  breadcrumb?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border px-6 py-5", className)}>
      {breadcrumb}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          {children}
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="h-4 w-4" />
              {addLabel.replace("+ ", "")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
