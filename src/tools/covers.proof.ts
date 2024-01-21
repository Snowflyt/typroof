/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { beFalse, beTrue, describe, expect, it } from 'typroof';

import type { Covers, StrictCovers } from './covers';

describe('Covers', () => {
  it('should return `true` for the same types', () => {
    expect<Covers<'foo', 'foo'>>().to(beTrue);
    expect<Covers<123, 123>>().to(beTrue);
    expect<Covers<true, true>>().to(beTrue);
    expect<Covers<false, false>>().to(beTrue);
    expect<Covers<undefined, undefined>>().to(beTrue);
    expect<Covers<null, null>>().to(beTrue);
    expect<Covers<unknown, unknown>>().to(beTrue);
    expect<Covers<never, never>>().to(beTrue);
    expect<Covers<{}, {}>>().to(beTrue);
  });

  it('should return `false` for subtypes', () => {
    expect<Covers<'foo', string>>().to(beFalse);
    expect<Covers<123, number>>().to(beFalse);
    expect<Covers<true, boolean>>().to(beFalse);
    expect<Covers<false, boolean>>().to(beFalse);
    expect<Covers<undefined, undefined | null>>().to(beFalse);
    expect<Covers<null, undefined | null>>().to(beFalse);
    expect<Covers<string[], readonly string[]>>().to(beFalse);
    expect<Covers<never, null>>().to(beFalse);
  });

  it('should return `true` for supertypes', () => {
    expect<Covers<string, 'foo'>>().to(beTrue);
    expect<Covers<number, 123>>().to(beTrue);
    expect<Covers<boolean, true>>().to(beTrue);
    expect<Covers<boolean, false>>().to(beTrue);
    expect<Covers<undefined | null, undefined>>().to(beTrue);
    expect<Covers<undefined | null, null>>().to(beTrue);
    expect<Covers<readonly string[], string[]>>().to(beTrue);
    expect<Covers<null, never>>().to(beTrue);
    expect<Covers<any, string>>().to(beTrue);
    expect<Covers<string, any>>().to(beTrue);
  });
});

describe('StrictCovers', () => {
  it('should return `true` for the same types', () => {
    expect<StrictCovers<'foo', 'foo'>>().to(beTrue);
    expect<StrictCovers<123, 123>>().to(beTrue);
    expect<StrictCovers<true, true>>().to(beTrue);
    expect<StrictCovers<false, false>>().to(beTrue);
    expect<StrictCovers<undefined, undefined>>().to(beTrue);
    expect<StrictCovers<null, null>>().to(beTrue);
    expect<StrictCovers<unknown, unknown>>().to(beTrue);
    expect<StrictCovers<{}, {}>>().to(beTrue);
  });

  it('should return `false` for subtypes', () => {
    expect<StrictCovers<'foo', string>>().to(beFalse);
    expect<StrictCovers<123, number>>().to(beFalse);
    expect<StrictCovers<true, boolean>>().to(beFalse);
    expect<StrictCovers<false, boolean>>().to(beFalse);
    expect<StrictCovers<undefined, undefined | null>>().to(beFalse);
    expect<StrictCovers<null, undefined | null>>().to(beFalse);
    expect<StrictCovers<string[], readonly string[]>>().to(beFalse);
  });

  it('should return `false` for `never`', () => {
    expect<StrictCovers<never, string>>().to(beFalse);
    expect<StrictCovers<never, number>>().to(beFalse);
    expect<StrictCovers<never, boolean>>().to(beFalse);
    expect<StrictCovers<never, undefined>>().to(beFalse);
    expect<StrictCovers<never, null>>().to(beFalse);
    expect<StrictCovers<never, unknown>>().to(beFalse);
    expect<StrictCovers<never, never>>().to(beFalse);
    expect<StrictCovers<never, {}>>().to(beFalse);
  });

  it('should return `false` for `any`', () => {
    expect<StrictCovers<any, string>>().to(beFalse);
    expect<StrictCovers<any, number>>().to(beFalse);
    expect<StrictCovers<any, boolean>>().to(beFalse);
    expect<StrictCovers<any, undefined>>().to(beFalse);
    expect<StrictCovers<any, null>>().to(beFalse);
    expect<StrictCovers<any, unknown>>().to(beFalse);
    expect<StrictCovers<any, never>>().to(beFalse);
    expect<StrictCovers<any, {}>>().to(beFalse);

    expect<StrictCovers<string, any>>().to(beFalse);
    expect<StrictCovers<number, any>>().to(beFalse);
    expect<StrictCovers<boolean, any>>().to(beFalse);
    expect<StrictCovers<undefined, any>>().to(beFalse);
    expect<StrictCovers<null, any>>().to(beFalse);
    expect<StrictCovers<unknown, any>>().to(beFalse);
    expect<StrictCovers<never, any>>().to(beFalse);
    expect<StrictCovers<{}, any>>().to(beFalse);
  });
});
