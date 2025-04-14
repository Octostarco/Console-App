import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  },
  base: '/apps/${process.env.OS_DEPLOYMENT_NAME}/',
  plugins: [react()],
});
