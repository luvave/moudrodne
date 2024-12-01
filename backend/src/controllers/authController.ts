import { Request, Response } from 'express';
import { login, register } from '../services/authService';
import { UserCreate, UserLogin } from '@shared/types';
import { LoginSchema, RegisterSchema } from '@shared/schemas';

export const postRegister = async (req: Request<never, never, UserCreate>, res: Response) => {
  const data = RegisterSchema.parse(req.body); // Zod validation
  const result = await register(data.email, data.username, data.password);
  res.status(201).json(result);
};

export const postLogin = async (req: Request<never, never, UserLogin>, res: Response) => {
  const data = LoginSchema.parse(req.body); // Zod validation
  const result = await login(data.email, data.password);
  res.status(200).json(result);
};
