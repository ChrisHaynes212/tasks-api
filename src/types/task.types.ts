export interface Task {
  id: string;
  name: string;
  description: string | null;
  dueAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
  dueAt?: Date;
}

export interface EditTaskRequest {
  taskId: string;
  name?: string;
  description?: string;
  dueAt?: Date;
}