import app from './api/index.js';

const PORT = process.env.PORT ?? '3001';

app.listen(Number(PORT), () => {
  console.log(`[server] Backend running at http://localhost:${PORT}`);
  console.log(`[server] Health check: http://localhost:${PORT}/api/v1/health`);
});
