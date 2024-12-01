import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) throw new Error('Could not connect to external providers.');

  return createClient(url, key);
};
