import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    port: 8000,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'), // Alias for shared module
    },
  },
  plugins: [react()],
});
