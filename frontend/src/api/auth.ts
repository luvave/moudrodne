import axios from 'axios';

export const login = async (email: string, password: string) => {
  const response = await axios.post('http://localhost:7000/api/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, username: string) => {
  const response = await axios.post('http://localhost:7000/api/auth/register', { email, password, username });
  return response.data;
};
