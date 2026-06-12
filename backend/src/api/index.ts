import express from 'express';
import healthRouter from './routes/health.js';
import { errorMiddleware } from './middleware/error.js';

const app = express();

app.use(express.json());

// Mount routers under /api/v1
app.use('/api/v1', healthRouter);

// Error middleware must be last
app.use(errorMiddleware);

export default app;
