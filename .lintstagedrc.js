// @ts-check

/** @satisfies {import('lint-staged').Config} */
const config = {
  '{src,test}/**/*.{js,ts}':
    'eslint --fix --no-error-on-unmatched-pattern --report-unused-disable-directives-severity error --max-warnings 0',
  '*.{js,cjs,mjs,ts,cts,mts}':
    'eslint --fix --no-error-on-unmatched-pattern --report-unused-disable-directives-severity error --max-warnings 0',
  '{src,test}/**/*.json': 'prettier --loglevel=silent --no-error-on-unmatched-pattern --write',
  '*.{json,md}': 'prettier --loglevel=silent --no-error-on-unmatched-pattern --write',
  '.hintrc': 'prettier --loglevel=silent --no-error-on-unmatched-pattern --write --parser json',
};

export default config;
