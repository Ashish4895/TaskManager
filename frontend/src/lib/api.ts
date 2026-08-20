const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Something went wrong";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  isGuest?: boolean;
}

export type TaskStatus = "todo" | "doing" | "completed" | "on_hold";
export type TaskPriority = "none" | "urgent" | "high" | "medium" | "low";

export interface Project {
  _id: string;
  name: string;
  priority: TaskPriority;
  leadInitials: string;
  leadColor: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  _id: string;
  title: string;
  priority: TaskPriority;
  dueDate?: string;
  assigneeInitials?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  signup: (body: { fullName: string; email: string; password: string }) =>
    request<User>("/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<User>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  guest: () => request<User>("/auth/guest", { method: "POST" }),

  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),

  me: () => request<User>("/auth/me"),

  getTodos: () => request<Todo[]>("/todo"),

  createTodo: (body: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    projectId?: string;
  }) => request<Todo>("/todo", { method: "POST", body: JSON.stringify(body) }),

  updateTodo: (
    id: string,
    body: {
      title?: string;
      description?: string;
      completed?: boolean;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string;
      projectId?: string;
    },
  ) => request<Todo>(`/todo/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  deleteTodo: (id: string) =>
    request<{ message: string }>(`/todo/${id}`, { method: "DELETE" }),

  getProjects: () => request<Project[]>("/project"),

  createProject: (body: {
    name: string;
    priority?: TaskPriority;
    leadInitials?: string;
    leadColor?: string;
    dueDate?: string;
  }) => request<Project>("/project", { method: "POST", body: JSON.stringify(body) }),

  updateProject: (
    id: string,
    body: {
      name?: string;
      priority?: TaskPriority;
      leadInitials?: string;
      leadColor?: string;
      dueDate?: string;
    },
  ) => request<Project>(`/project/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  deleteProject: (id: string) =>
    request<{ message: string }>(`/project/${id}`, { method: "DELETE" }),

  getSubtasks: (todoId: string) =>
    request<Subtask[]>(`/todo/${todoId}/subtask`),

  createSubtask: (
    todoId: string,
    body: {
      title: string;
      priority?: TaskPriority;
      dueDate?: string;
      assigneeInitials?: string;
    },
  ) =>
    request<Subtask>(`/todo/${todoId}/subtask`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSubtask: (
    todoId: string,
    id: string,
    body: {
      title?: string;
      priority?: TaskPriority;
      dueDate?: string;
      assigneeInitials?: string;
    },
  ) =>
    request<Subtask>(`/todo/${todoId}/subtask/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteSubtask: (todoId: string, id: string) =>
    request<{ message: string }>(`/todo/${todoId}/subtask/${id}`, {
      method: "DELETE",
    }),

  getComments: (todoId: string) =>
    request<Comment[]>(`/todo/${todoId}/comment`),

  createComment: (todoId: string, body: { text: string }) =>
    request<Comment>(`/todo/${todoId}/comment`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteComment: (todoId: string, id: string) =>
    request<{ message: string }>(`/todo/${todoId}/comment/${id}`, {
      method: "DELETE",
    }),
};
