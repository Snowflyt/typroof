/* eslint-disable @typescript-eslint/no-explicit-any */

import { beFalse, beTrue, describe, expect, it } from 'typroof';

import type { Extends, StrictExtends } from './extends';

describe('Extends', () => {
  it('should evaluate to `true` for the same types', () => {
    expect<Extends<42, 42>>().to(beTrue);
    expect<Extends<42n, 42n>>().to(beTrue);
    expect<Extends<'foo', 'foo'>>().to(beTrue);
    expect<Extends<true, true>>().to(beTrue);
    expect<Extends<false, false>>().to(beTrue);
    expect<Extends<boolean, boolean>>().to(beTrue);
    expect<Extends<true | false, boolean>>().to(beTrue);
    expect<Extends<boolean, true | false>>().to(beTrue);
    expect<Extends<symbol, symbol>>().to(beTrue);
    expect<Extends<undefined, undefined>>().to(beTrue);
    expect<Extends<null, null>>().to(beTrue);
    expect<Extends<unknown, unknown>>().to(beTrue);
    expect<Extends<never, never>>().to(beTrue);
    expect<Extends<{ foo: 42 }, { foo: 42 }>>().to(beTrue);
    expect<Extends<{}, {}>>().to(beTrue);
    expect<Extends<[], []>>().to(beTrue);
    expect<Extends<readonly [], readonly []>>().to(beTrue);
    expect<Extends<[42, 'foo'], [42, 'foo']>>().to(beTrue);
    expect<Extends<readonly [42, 'foo'], readonly [42, 'foo']>>().to(beTrue);
    expect<Extends<() => void, () => void>>().to(beTrue);
    expect<Extends<() => never, () => never>>().to(beTrue);
    expect<Extends<() => any, () => any>>().to(beTrue);
    expect<Extends<(_1: 42, _2: 'foo') => void, (_1: 42, _2: 'foo') => void>>().to(beTrue);
    expect<Extends<(_1: 42, _2: 'foo') => never, (_1: 42, _2: 'foo') => never>>().to(beTrue);
    expect<Extends<(_1: any, _2: any) => any, (_1: any, _2: any) => any>>().to(beTrue);
  });

  it('should work with unions', () => {
    expect<Extends<42, 42 | 43>>().to(beTrue);
    expect<Extends<42 | 43, 42>>().to(beFalse);
    expect<Extends<'a' | 'b', string>>().to(beTrue);
    expect<Extends<string, 'a' | 'b'>>().to(beFalse);
    expect<Extends<42 | 43, number>>().to(beTrue);
    expect<Extends<number, 42 | 43>>().to(beFalse);
    expect<Extends<{ foo: 42 | 43 }, object>>().to(beTrue);
    expect<Extends<object, { foo: 42 | 43 }>>().to(beFalse);
    expect<Extends<{ foo: 42 | 43 }, {}>>().to(beTrue);
    expect<Extends<{}, { foo: 42 | 43 }>>().to(beFalse);
  });

  it('should work with intersections', () => {
    expect<Extends<{ foo: 42 } & { bar: 43 }, { foo: 42; bar: 43 }>>().to(beTrue);
    expect<Extends<{ foo: 42; bar: 43 }, { foo: 42 } & { bar: 43 }>>().to(beTrue);
    expect<Extends<{ foo: 42; bar: 43 }, { foo: 42 }>>().to(beTrue);
    expect<Extends<{ foo: 42 }, { foo: 42 } & { bar: 43 }>>().to(beFalse);
    expect<Extends<42 & 43, never>>().to(beTrue);
    expect<Extends<never, 42 & 43>>().to(beTrue);
    expect<Extends<string & number, never>>().to(beTrue);
    expect<Extends<never, string & number>>().to(beTrue);
  });

  it('should return `true` for subtypes', () => {
    expect<Extends<'foo', string>>().to(beTrue);
    expect<Extends<42, number>>().to(beTrue);
    expect<Extends<42n, bigint>>().to(beTrue);
    expect<Extends<true, boolean>>().to(beTrue);
    expect<Extends<false, boolean>>().to(beTrue);
    expect<Extends<undefined, undefined | null>>().to(beTrue);
    expect<Extends<null, undefined | null>>().to(beTrue);
    expect<Extends<[], unknown[]>>().to(beTrue);
    expect<Extends<readonly [], readonly unknown[]>>().to(beTrue);
    expect<Extends<string[], readonly string[]>>().to(beTrue);
    expect<Extends<42, unknown>>().to(beTrue);
    expect<Extends<never, null>>().to(beTrue);
    expect<Extends<string, any>>().to(beTrue);
    expect<Extends<any, string>>().to(beTrue);
  });

  it('should return `false` for supertypes', () => {
    expect<Extends<string, 'foo'>>().to(beFalse);
    expect<Extends<number, 42>>().to(beFalse);
    expect<Extends<bigint, 42n>>().to(beFalse);
    expect<Extends<boolean, true>>().to(beFalse);
    expect<Extends<boolean, false>>().to(beFalse);
    expect<Extends<undefined | null, undefined>>().to(beFalse);
    expect<Extends<undefined | null, null>>().to(beFalse);
    expect<Extends<unknown[], []>>().to(beFalse);
    expect<Extends<readonly unknown[], readonly []>>().to(beFalse);
    expect<Extends<readonly string[], string[]>>().to(beFalse);
    expect<Extends<null, never>>().to(beFalse);
    expect<Extends<unknown, 42>>().to(beFalse);
  });

  it('should return `false` for non-related types', () => {
    expect<Extends<42, 43>>().to(beFalse);
    expect<Extends<'foo', 'bar'>>().to(beFalse);
    expect<Extends<42n, 43n>>().to(beFalse);
    expect<Extends<42n, 42>>().to(beFalse);
    expect<Extends<[42, 'foo'], ['foo', 42]>>().to(beFalse);
    expect<Extends<readonly [42, 'foo'], readonly ['foo', 42]>>().to(beFalse);
  });

  it('should return `false` for `Extends<any, never>`', () => {
    expect<Extends<any, never>>().to(beFalse);
  });
});

describe('StrictExtends', () => {
  it('should return `true` for the same types', () => {
    expect<StrictExtends<'foo', 'foo'>>().to(beTrue);
    expect<StrictExtends<123, 123>>().to(beTrue);
    expect<StrictExtends<true, true>>().to(beTrue);
    expect<StrictExtends<false, false>>().to(beTrue);
    expect<StrictExtends<undefined, undefined>>().to(beTrue);
    expect<StrictExtends<null, null>>().to(beTrue);
    expect<StrictExtends<unknown, unknown>>().to(beTrue);
    expect<StrictExtends<{}, {}>>().to(beTrue);
  });

  it('should return `true` for subtypes', () => {
    expect<StrictExtends<'foo', string>>().to(beTrue);
    expect<StrictExtends<123, number>>().to(beTrue);
    expect<StrictExtends<true, boolean>>().to(beTrue);
    expect<StrictExtends<false, boolean>>().to(beTrue);
    expect<StrictExtends<undefined, undefined | null>>().to(beTrue);
    expect<StrictExtends<null, undefined | null>>().to(beTrue);
    expect<StrictExtends<string[], readonly string[]>>().to(beTrue);
  });

  it('should return `false` for `never`', () => {
    expect<StrictExtends<never, string>>().to(beFalse);
    expect<StrictExtends<never, number>>().to(beFalse);
    expect<StrictExtends<never, boolean>>().to(beFalse);
    expect<StrictExtends<never, undefined>>().to(beFalse);
    expect<StrictExtends<never, null>>().to(beFalse);
    expect<StrictExtends<never, unknown>>().to(beFalse);
    expect<StrictExtends<never, never>>().to(beFalse);
    expect<StrictExtends<never, {}>>().to(beFalse);
  });

  it('should return `false` for `any`', () => {
    expect<StrictExtends<any, string>>().to(beFalse);
    expect<StrictExtends<any, number>>().to(beFalse);
    expect<StrictExtends<any, boolean>>().to(beFalse);
    expect<StrictExtends<any, undefined>>().to(beFalse);
    expect<StrictExtends<any, null>>().to(beFalse);
    expect<StrictExtends<any, unknown>>().to(beFalse);
    expect<StrictExtends<any, never>>().to(beFalse);
    expect<StrictExtends<any, {}>>().to(beFalse);

    expect<StrictExtends<string, any>>().to(beFalse);
    expect<StrictExtends<number, any>>().to(beFalse);
    expect<StrictExtends<boolean, any>>().to(beFalse);
    expect<StrictExtends<undefined, any>>().to(beFalse);
    expect<StrictExtends<null, any>>().to(beFalse);
    expect<StrictExtends<unknown, any>>().to(beFalse);
    expect<StrictExtends<never, any>>().to(beFalse);
    expect<StrictExtends<{}, any>>().to(beFalse);
  });
});
