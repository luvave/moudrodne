import { NextFunction, RequestHandler, Response } from 'express';
import { createSupabaseClient } from '../utils/supabaseClient';
import { AuthenticatedRequest } from '../types/request';
import { ServerError } from '../utils/error';

const supabase = createSupabaseClient();

export const authMiddleware: RequestHandler = async (req: AuthenticatedRequest, _: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) throw new ServerError(401, 'No token provided');

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new ServerError(401, 'Invalid Token');

  req.user = {
    email: data.user.email,
    id: Number(data.user.id),
  };
  next();
};
