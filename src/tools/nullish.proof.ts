import { beFalse, beTrue, describe, expect, it } from 'typroof';

import type { IsNull, IsNullish, IsUndefined } from './nullish';

describe('IsUndefined', () => {
  it('should return `true` for `undefined`', () => {
    expect<IsUndefined<undefined>>().to(beTrue);
  });

  it('should return `false` for `never`', () => {
    expect<IsUndefined<never>>().to(beFalse);
  });

  it('should return `false` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsUndefined<any>>().to(beFalse);
  });

  it('should return `false` for other types', () => {
    expect<IsUndefined<'foo' | 'bar'>>().to(beFalse);
    expect<IsUndefined<number>>().to(beFalse);
    expect<IsUndefined<unknown>>().to(beFalse);
  });
});

describe('IsNull', () => {
  it('should return `true` for `null`', () => {
    expect<IsNull<null>>().to(beTrue);
  });

  it('should return `false` for `never`', () => {
    expect<IsNull<never>>().to(beFalse);
  });

  it('should return `false` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsNull<any>>().to(beFalse);
  });

  it('should return `false` for other types', () => {
    expect<IsNull<'foo' | 'bar'>>().to(beFalse);
    expect<IsNull<number>>().to(beFalse);
    expect<IsNull<unknown>>().to(beFalse);
  });
});

describe('IsNullish', () => {
  it('should return `true` for `null`, `undefined` or `null | undefined`', () => {
    expect<IsNullish<null>>().to(beTrue);
    expect<IsNullish<undefined>>().to(beTrue);
    expect<IsNullish<null | undefined>>().to(beTrue);
    expect<IsNullish<undefined | null>>().to(beTrue);
  });

  it('should return `false` for `never`', () => {
    expect<IsNullish<never>>().to(beFalse);
  });

  it('should return `false` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsNullish<any>>().to(beFalse);
  });

  it('should return `false` for other types', () => {
    expect<IsNullish<string | null>>().to(beFalse);
    expect<IsNullish<0 | 1 | undefined>>().to(beFalse);
    expect<IsNullish<number | null | undefined>>().to(beFalse);
    expect<IsNullish<undefined | null | number>>().to(beFalse);
    expect<IsNullish<'foo' | 'bar'>>().to(beFalse);
    expect<IsNullish<number>>().to(beFalse);
    expect<IsNullish<unknown>>().to(beFalse);
  });
});
