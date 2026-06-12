import type { ErrorRequestHandler } from 'express';

// Express error middleware must have exactly 4 parameters (err, req, res, next)
// to be recognized as an error handler.
export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('[ErrorMiddleware]', err);

  const status: number =
    typeof (err as { status?: unknown }).status === 'number'
      ? ((err as { status: number }).status)
      : typeof (err as { statusCode?: unknown }).statusCode === 'number'
        ? ((err as { statusCode: number }).statusCode)
        : 500;

  const message: string =
    err instanceof Error ? err.message : String(err);

  const details: unknown =
    (err as { details?: unknown }).details ?? undefined;

  const body: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) {
    body.details = details;
  }

  res.status(status).json(body);
};
