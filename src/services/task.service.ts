import type { Task } from '../types/task.types.js';
import * as taskRepository from '../repositories/task.repository.js';

export async function createTask(
  name: string,
  description?: string,
  dueAt?: string
): Promise<Task> {
  return await taskRepository.createTask({
    name,
    description,
    dueAt: dueAt ? new Date(dueAt) : undefined,
  });
}

export async function getTasks(
  includeCompleted: boolean = false
): Promise<Task[]> {
  return await taskRepository.getTasks(includeCompleted);
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  return await taskRepository.getTaskById(taskId);
}

export async function completeTask(taskId: string): Promise<Task> {
  return await taskRepository.completeTask(taskId);
}

export async function editTask(
  taskId: string,
  name?: string,
  description?: string,
  dueAt?: string
): Promise<Task> {
  return await taskRepository.editTask({
    taskId,
    name,
    description,
    dueAt: dueAt ? new Date(dueAt) : undefined,
  });
}

export async function deleteTask(taskId: string): Promise<Task> {
  return await taskRepository.deleteTask(taskId);
}