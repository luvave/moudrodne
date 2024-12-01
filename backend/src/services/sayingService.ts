import { createOneSaying, getAllSayings } from '../data/sayingRepository';
import { SayingCreate } from '@shared/types';

export const getAllSaying = async () => {
  return await getAllSayings();
};

export const createSaying = async ({ text, description, preferredDate, image }: SayingCreate) => {
  return await createOneSaying({ text, description, preferredDate, image });
};
