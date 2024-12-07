import { sayHello } from '../services/helloService';
import { Request, Response } from 'express';

export const getSaying = async (_req: Request, res: Response) => {
  const hello = await sayHello();
  res.status(200).json(hello);
};
