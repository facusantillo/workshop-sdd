import { Router } from 'express';
import { getHealth } from '../../application/health.service.js';

const router = Router();

router.get('/health', async (_req, res, next) => {
  try {
    const health = await getHealth();
    const httpStatus = health.status === 'ok' ? 200 : 503;
    res.status(httpStatus).json(health);
  } catch (err) {
    next(err);
  }
});

export default router;
