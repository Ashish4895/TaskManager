export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const COLOR_MODES = [
  "amber",
  "blue",
  "pink",
  "rose",
  "emerald",
  "black",
] as const;
export type ColorMode = (typeof COLOR_MODES)[number];

export const THEME_STORAGE_KEY = "dexter-theme";
export const COLOR_STORAGE_KEY = "dexter-color";
export const VIEW_STORAGE_KEY = "dexter-task-view";

export const COLOR_LABELS: Record<ColorMode, string> = {
  amber: "Amber",
  blue: "Blue",
  pink: "Pink",
  rose: "Rose",
  emerald: "Emerald",
  black: "Black",
};

export const COLOR_SWATCHES: Record<ColorMode, string> = {
  amber: "#f59e0b",
  blue: "#3b82f6",
  pink: "#ec4899",
  rose: "#f43f5e",
  emerald: "#10b981",
  black: "#171717",
};

export function isTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme);
}

export function isColorMode(value: string): value is ColorMode {
  return COLOR_MODES.includes(value as ColorMode);
}

export type TaskView = "list" | "board";
export type TaskStatus = "todo" | "doing" | "completed" | "on_hold";
export type TaskPriority = "none" | "urgent" | "high" | "medium" | "low";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  doing: "Doing",
  completed: "Completed",
  on_hold: "On Hold",
};

export const BOARD_COLUMNS: TaskStatus[] = [
  "todo",
  "doing",
  "completed",
  "on_hold",
];

export const LIST_SECTIONS: TaskStatus[] = ["todo", "doing", "completed"];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  none: "No Priority",
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};
