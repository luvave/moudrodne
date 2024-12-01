import { createSupabaseClient } from '../utils/supabaseClient';

const supabase = createSupabaseClient();

export const getAllSayings = async () => {
  const { data, error } = await supabase.from('sayings').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const createOneSaying = async (quote: { text: string; description?: string; preferredDate?: Date; image?: string }) => {
  const { data, error } = await supabase.from('sayings').insert(quote);
  if (error) throw new Error(error.message);
  return data;
};
