import { createSupabaseClient } from '../utils/supabaseClient';

const supabase = createSupabaseClient();

export const createUser = async (id: string, email: string, username: string) => {
  const { error } = await supabase.from('users').insert({ id, email, username });
  if (error) throw new Error(error.message);
};
