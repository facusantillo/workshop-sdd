import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../api/index.js';
import prisma from '../infrastructure/prisma.js';

describe('GET /api/v1/health', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns 200 with correct shape when DB is up', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      checks: {
        database: {
          status: 'up',
        },
      },
    });
    expect(typeof res.body.version).toBe('string');
    expect(res.body.version.length).toBeGreaterThan(0);
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.checks.database.latencyMs).toBe('number');
  });
});
