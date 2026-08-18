import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  color = "#8b5cf6",
  size = "md",
  className,
}: {
  initials: string;
  color?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-white font-medium",
        size === "sm" ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-xs",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
