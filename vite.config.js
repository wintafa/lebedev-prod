import { defineConfig } from 'vite';

// base: './' = относительные пути к ассетам.
// Работает и на корне, и на /<repo>/ — не нужно знать имя репо заранее.
export default defineConfig({
  base: '/lebedev-prod/',
  build: {
    outDir: 'dist',
  },
});
