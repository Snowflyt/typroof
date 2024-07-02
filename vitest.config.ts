import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      typroof: path.resolve(__dirname, 'src'),
    },
  },
});
