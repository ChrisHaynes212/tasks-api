import { test, expect } from '@playwright/test';

test('health check returns status ok', async ({ request }) => {
  console.log('Base URL:', process.env.API_URL || 'http://localhost:3000');
  
  const response = await request.get('/status');
  
  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(body.service).toBe('Tasks API');
  expect(body.timestamp).toBeDefined();
});