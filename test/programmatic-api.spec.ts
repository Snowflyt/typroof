import { describe, expect, it } from 'vitest';

import typroof, { formatGroupResult, formatSummary } from 'typroof';

const trimIndent = (str: string) => {
  const lines = str.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const indent = line.search(/\S/);
    if (indent !== -1) minIndent = Math.min(minIndent, indent);
  }
  return lines
    .map((line) => line.slice(minIndent))
    .join('\n')
    .trim();
};

// eslint-disable-next-line no-control-regex
const cleanAnsi = (str: string) => str.replace(/\u001b\[[0-9;]*m/g, '');

describe('Programmatic API', async () => {
  const results = await typroof({
    testFiles: 'test/programmatic-api-test-proof.ts',
  });

  it('should output the same results as the CLI', () => {
    const formattedResults = results.map((r) => formatGroupResult(r.rootGroupResult)).join('\n');
    expect(cleanAnsi(formattedResults)).toEqual(
      trimIndent(`
        ❯ test/programmatic-api-test-proof.ts (5)
          ✔ Append
          ❯ Prepend (2)
            ✘ should prepend a string to another
              × 21:12 Expect Prepend<'foo', 'bar'> to equal "foobar", but got "barfoo".
            ✔ should accept only strings
          ✔ describe01 (2)
            ✔ it01
            ✔ describe02 (1)
              ✔ it02
      `),
    );
  });

  it('should output the same summary as the CLI', () => {
    const summary = formatSummary({ groups: results.map((r) => r.rootGroupResult) });
    expect(trimIndent(cleanAnsi(summary))).toEqual(
      trimIndent(`
        Test Files  1 failed (1)
             Tests  1 failed | 4 passed (5)
      `),
    );
  });
});
