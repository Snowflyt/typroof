import { defineConfig } from 'typroof/config';

import foo from './src';

export default defineConfig({
  plugins: [foo()],
});
