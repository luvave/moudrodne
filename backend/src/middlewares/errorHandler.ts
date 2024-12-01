import { Request, Response } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response) => {
  console.error(err);
  const status = 'status' in err && typeof err.status === 'number' ? err.status : 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
};
