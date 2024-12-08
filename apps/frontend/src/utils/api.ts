import type { AxiosInstance, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

export const injectToken = (config: InternalAxiosRequestConfig, token?: string) => {
  if (typeof token === 'string' && typeof config.headers !== 'undefined' && config.headers !== null) {
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
  }
  return config;
};

class ApiWrapper {
  private instance: AxiosInstance | null = null;

  private currentToken: undefined | string = undefined;

  getInstance() {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    let baseUrl: string;
    if (typeof import.meta.env.VITE_API_URL === 'string' && typeof import.meta.env.VITE_API_PREFIX === 'string') {
      baseUrl = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PREFIX}`;
    } else {
      throw new Error('Please check if env variables are setup correctly!');
    }

    const http = axios.create({
      baseURL: baseUrl,
    });

    http.defaults.headers.post['Content-Type'] = 'application/json';

    http.interceptors.request.use(
      (config) => injectToken(config, this.currentToken),
      (error) => Promise.reject(error),
    );

    this.instance = http;

    return http;
  }

  setToken(token?: string) {
    this.currentToken = token;
  }
}

export const api = new ApiWrapper();
