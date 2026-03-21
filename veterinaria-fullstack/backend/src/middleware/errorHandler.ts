import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (err.message?.includes('requerido') || err.message?.includes('requerid')) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message?.includes('not found') || err.message?.includes('No encontrado')) {
    res.status(404).json({ error: err.message });
    return;
  }

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Error interno' : err.message,
  });
}
