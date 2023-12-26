// @ts-check

/** @satisfies {import('lint-staged').Config} */
const config = {
  '{src,test}/**/*.{js,ts}': ['eslint --fix'],
  '*.{js,cjs,mjs,ts,cts,mts}': ['eslint --fix'],
  '{src,test}/**/*.json': ['prettier --loglevel=silent --write'],
  '*.{js,cjs,mjs,ts,cts,mts,json,md}': ['prettier --loglevel=silent --write'],
};

export default config;
