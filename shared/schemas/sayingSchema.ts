import { z, ZodType } from 'zod';
import { SayingCreate } from '../types';

export const SayingSchema = z.object({
  text: z.string(),
  description: z.string(),
  preferredDate: z.date().optional(),
  image: z.string().optional(),
}) satisfies ZodType<SayingCreate>;
