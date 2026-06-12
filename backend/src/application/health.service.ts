import { createRequire } from 'module';
import prisma from '../infrastructure/prisma.js';

const require = createRequire(import.meta.url);

export interface HealthResponse {
  status: 'ok' | 'degraded';
  version: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      latencyMs: number;
    };
  };
}

export async function getHealth(): Promise<HealthResponse> {
  // Read version from root package.json (two levels up from src/application/)
  // src/application/ -> src/ -> backend/ -> workspace root
  const rootPkg = require('../../../package.json') as { version: string };
  const version = rootPkg.version;

  let dbStatus: 'up' | 'down' = 'up';
  let latencyMs = 0;

  try {
    const start = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    latencyMs = Math.round(performance.now() - start);
  } catch {
    dbStatus = 'down';
    latencyMs = 0;
  }

  const overallStatus: 'ok' | 'degraded' = dbStatus === 'up' ? 'ok' : 'degraded';

  return {
    status: overallStatus,
    version,
    uptime: process.uptime(),
    checks: {
      database: {
        status: dbStatus,
        latencyMs,
      },
    },
  };
}
