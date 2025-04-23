import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  base: process.env.OS_BASE_PATH,
  plugins: [react()],
});
