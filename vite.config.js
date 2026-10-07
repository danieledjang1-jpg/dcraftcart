import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Enables React's modern JSX transform across the application.
export default defineConfig({
  plugins: [react()],
});
