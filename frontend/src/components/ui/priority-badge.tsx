import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/lib/themes";
import { SignalHigh, SignalLow, SignalMedium, Minus } from "lucide-react";

const styles: Record<TaskPriority, string> = {
  none: "text-muted-foreground",
  urgent: "text-red-600",
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-blue-500",
};

const icons: Record<TaskPriority, typeof Minus> = {
  none: Minus,
  urgent: SignalHigh,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
};

export function PriorityBadge({
  priority,
  label,
}: {
  priority: TaskPriority;
  label: string;
}) {
  const Icon = icons[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", styles[priority])}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
