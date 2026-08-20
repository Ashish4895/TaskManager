import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-lg border border-border bg-input px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/30",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
