import prisma from '../db.js';
import type { Task, CreateTaskRequest, EditTaskRequest } from '../types/task.types.js';

export async function createTask(
  task: CreateTaskRequest
): Promise<Task> {
  return await prisma.task.create({
    data: {
      name: task.name,
      description: task.description,
      dueAt: task.dueAt,
    }
  });
}

export async function getTasks(
  includeCompleted: boolean = false
): Promise<Task[]> {
  return await prisma.task.findMany({
    where: includeCompleted ? {} : { completedAt: null },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  return await prisma.task.findUnique({
    where: { id: taskId }
  });
}

export async function completeTask(taskId: string): Promise<Task> {
  return await prisma.task.update({
    where: { id: taskId },
    data: {
      completedAt: new Date()
    }
  });
}

export async function editTask(
  update: EditTaskRequest
): Promise<Task> {
  return await prisma.task.update({
    where: { id: update.taskId },
    data: {
      ...(update.name !== undefined && { name: update.name }),
      ...(update.description !== undefined && { description: update.description }),
      ...(update.dueAt !== undefined && { dueAt: update.dueAt }),
    }
  });
}

export async function deleteTask(taskId: string): Promise<Task> {
  return await prisma.task.delete({
    where: { id: taskId }
  });
}