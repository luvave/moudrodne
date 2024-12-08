import { AxiosRequestConfig } from 'axios';
import { api } from './api';

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return api
    .getInstance()({
      ...config,
    })
    .then(({ data }) => {
      return data;
    });
};
