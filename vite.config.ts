import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['@ant-design/icons', 'antd5'],
    },
  },
  plugins: [react()],
});
