/* eslint-disable @typescript-eslint/ban-ts-comment */

import { expect, test } from 'typroof';

import { beFoo } from '../src';

test('foo', () => {
  expect<'foo'>().to(beFoo);
  expect<'bar'>().not.to(beFoo);
  // @ts-expect-error
  expect<'bar'>().to(beFoo);
});
