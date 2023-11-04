// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  base:'/webartech/',
  build: {base:'/webartech/',
    rollupOptions:{
      external: ['public/*'], // specifica il file da escludere dalla build
    },
  },
});
