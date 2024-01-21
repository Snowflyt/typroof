/* eslint-disable @typescript-eslint/no-explicit-any */

import { beFalse, beTrue, describe, equal, expect, it } from 'typroof';

import type { Not } from './not';

describe('Not', () => {
  it('should invert a boolean', () => {
    expect<Not<true>>().to(beFalse);
    expect<Not<false>>().to(beTrue);
  });

  it('should return `boolean` for `boolean`', () => {
    expect<Not<boolean>>().to(equal<boolean>);
  });

  it('should return `never` for `never`', () => {
    expect<Not<never>>().to(equal<never>);
  });

  it('should return `boolean` for `any`', () => {
    expect<Not<any>>().to(equal<boolean>);
  });
});
