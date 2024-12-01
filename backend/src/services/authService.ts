import { createUser } from '../data/userRepository';
import { createSupabaseClient } from '../utils/supabaseClient';

const supabase = createSupabaseClient();

export const register = async (email: string, username: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  await createUser(data.user?.id || '0', email, username);
  return { message: 'User registered successfully', user: data.user };
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return { message: 'Login successful', user: data.user };
};
