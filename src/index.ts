import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors'
import tasks from './routes/task.routes.js';

const app = new Hono();

// Add CORS middleware
app.use('/*', cors({
  origin: process.env.UI_URL || 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowHeaders: ['Content-Type'],
}))

// Middleware
app.use('*', logger());

// Health check / Status endpoint
app.get('/status', (c) => {
  return c.json({ 
    status: 'ok',
    service: 'Tasks API',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.route('/tasks', tasks);

// Start server
const port = parseInt(process.env.PORT || '3000');

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Tasks API running on http://localhost:${info.port}`);
});