import { Hono } from 'hono';
import * as taskService from '../services/task.service.js';

const tasks = new Hono();

// Get all tasks
tasks.get('/', async (c) => {
  try {
    const includeCompleted = c.req.query('includeCompleted') === 'true';
    const allTasks = await taskService.getTasks(includeCompleted);
    return c.json(allTasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    return c.json({ error: 'Failed to get tasks' }, 500);
  }
});

// Get task by ID
tasks.get('/:id', async (c) => {
  try {
    const taskId = c.req.param('id');
    const task = await taskService.getTaskById(taskId);
    
    if (!task) {
      return c.json({ error: 'Task not found' }, 404);
    }
    
    return c.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    return c.json({ error: 'Failed to get task' }, 500);
  }
});

// Create task
tasks.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, dueAt } = body;
    
    if (!name) {
      return c.json({ error: 'Name is required' }, 400);
    }
    
    const task = await taskService.createTask(name, description, dueAt);
    return c.json(task, 201);
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// Complete task
tasks.patch('/:id/complete', async (c) => {
  try {
    const taskId = c.req.param('id');
    const task = await taskService.completeTask(taskId);
    return c.json(task);
  } catch (error) {
    console.error('Error completing task:', error);
    return c.json({ error: 'Failed to complete task' }, 500);
  }
});

// Edit task
tasks.put('/:id', async (c) => {
  try {
    const taskId = c.req.param('id');
    const body = await c.req.json();
    const { name, description, dueAt } = body;
    
    const task = await taskService.editTask(taskId, name, description, dueAt);
    return c.json(task);
  } catch (error) {
    console.error('Error editing task:', error);
    return c.json({ error: 'Failed to edit task' }, 500);
  }
});

// Delete task
tasks.delete('/:id', async (c) => {
  try {
    const taskId = c.req.param('id');
    await taskService.deleteTask(taskId);
    return c.body(null, 204);
  } catch (error) {
    console.error('Error deleting task:', error);
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

export default tasks;