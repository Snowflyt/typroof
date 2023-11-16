import chalk from 'chalk';

import { registerMatcher } from '../matcher';

export const toThrow = 'toThrow';

export type ToThrow = () => void;
export type NotToThrow = () => void;

export const registerToThrow = () =>
  registerMatcher(toThrow, (actual, _1, _2, { diagnostics, not }) => {
    const diagnostic = diagnostics.find((diagnostic) => {
      const start = diagnostic.getStart();
      if (!start) return false;
      const length = diagnostic.getLength();
      if (!length) return false;
      const end = start + length;
      return start >= actual.node.getStart() && end <= actual.node.getEnd();
    });

    if (not ? !!diagnostic : !diagnostic) {
      const actualText = chalk.bold(actual.text);
      throw `Expect ${actualText} ${not ? 'not ' : ''}to throw, but ${not ? 'did' : 'did not'}.`;
    }
  });
