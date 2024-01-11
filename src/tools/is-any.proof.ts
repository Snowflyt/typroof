import { beFalse, beTrue, describe, expect, it } from 'typroof';

import type { IsAny } from './is-any';

describe('IsAny', () => {
  it('should return `true` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsAny<any>>().to(beTrue);
  });

  it('should return `false` for `never`', () => {
    expect<IsAny<never>>().to(beFalse);
  });

  it('should return `false` for other types', () => {
    expect<IsAny<'foo' | 'bar'>>().to(beFalse);
    expect<IsAny<number>>().to(beFalse);
    expect<IsAny<unknown>>().to(beFalse);
  });
});
