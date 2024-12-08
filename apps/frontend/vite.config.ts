import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const PORT = Number(env.VITE_PORT ?? '5000');

  return {
    server: {
      port: PORT,
    },
    plugins: [react()],
  };
});
