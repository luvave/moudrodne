import { SayingSchema } from '@shared/schemas';
import { Request, Response } from 'express';
import { SayingCreate } from '@shared/types';
import { AuthenticatedRequest } from '../types/request';
import { createSaying, getAllSaying } from '../services/sayingService';

export const getSaying = async (_req: Request, res: Response) => {
  const quotes = await getAllSaying();
  res.status(200).json(quotes);
};

export const postSaying = async (req: AuthenticatedRequest<never, never, SayingCreate>, res: Response) => {
  const data = SayingSchema.parse(req.body);
  const result = await createSaying(data);
  res.status(201).json(result);
};
