import axios from 'axios';
import { SayingCreate } from '@shared/types';

export const fetchSayings = async () => {
  const response = await axios.get('http://localhost:7000/api/saying');
  return response.data;
};

export const createSaying = async (token: string, sayingData: SayingCreate) => {
  const response = await axios.post('http://localhost:7000/api/saying', sayingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
