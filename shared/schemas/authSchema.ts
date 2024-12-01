import { z, ZodType } from 'zod';
import { UserCreate, UserLogin } from '../types';

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
}) satisfies ZodType<UserCreate>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}) satisfies ZodType<UserLogin>;
