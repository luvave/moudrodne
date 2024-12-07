import { ZodInferSchema } from './types';
import { User } from '@moudrodne/types';
import { z } from 'zod';

type UserSchema = ZodInferSchema<User>;

export const userSchema = z.object<UserSchema>({ username: z.string() });
