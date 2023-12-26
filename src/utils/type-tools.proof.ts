import { describe, expect, it } from 'typroof';

import type {
  Covers,
  Extends,
  IsAny,
  IsNever,
  IsNull,
  IsNullish,
  IsUndefined,
  MatchesBoolean,
  Not,
  StrictCovers,
  StrictExtends,
} from './type-tools';

// `Equals`, `IsTrue` and `IsFalse` are obviously correct, so we don't need to test them,
// and matchers using these three types can be safely used to test other matchers.

describe('Not', () => {
  it('should invert a boolean', () => {
    expect<Not<true>>().toBeFalse();
    expect<Not<false>>().toBeTrue();
  });

  it('should return `boolean` for `boolean`', () => {
    expect<Not<boolean>>().toEqual<boolean>();
  });

  it('should return `never` for `never`', () => {
    expect<Not<never>>().toEqual<never>();
  });

  it('should return `boolean` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<Not<any>>().toEqual<boolean>();
  });
});

describe('IsNever', () => {
  it('should return `true` for `never`', () => {
    expect<IsNever<never>>().toBeTrue();
  });

  it('should return `false` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsNever<any>>().toBeFalse();
  });

  it('should return `false` for other types', () => {
    expect<IsNever<'foo' | 'bar'>>().toBeFalse();
    expect<IsNever<number>>().toBeFalse();
    expect<IsNever<unknown>>().toBeFalse();
  });
});

describe('IsAny', () => {
  it('should return `true` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsAny<any>>().toBeTrue();
  });

  it('should return `false` for `never`', () => {
    expect<IsAny<never>>().toBeFalse();
  });

  it('should return `false` for other types', () => {
    expect<IsAny<'foo' | 'bar'>>().toBeFalse();
    expect<IsAny<number>>().toBeFalse();
    expect<IsAny<unknown>>().toBeFalse();
  });
});

describe('IsUndefined', () => {
  it('should return `true` for `undefined`', () => {
    expect<IsUndefined<undefined>>().toBeTrue();
  });

  it('should return `false` for `never`', () => {
    expect<IsUndefined<never>>().toBeFalse();
  });

  it('should return `false` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsUndefined<any>>().toBeFalse();
  });

  it('should return `false` for other types', () => {
    expect<IsUndefined<'foo' | 'bar'>>().toBeFalse();
    expect<IsUndefined<number>>().toBeFalse();
    expect<IsUndefined<unknown>>().toBeFalse();
  });
});

describe('IsNull', () => {
  it('should return `true` for `null`', () => {
    expect<IsNull<null>>().toBeTrue();
  });

  it('should return `false` for `never`', () => {
    expect<IsNull<never>>().toBeFalse();
  });

  it('should return `false` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsNull<any>>().toBeFalse();
  });

  it('should return `false` for other types', () => {
    expect<IsNull<'foo' | 'bar'>>().toBeFalse();
    expect<IsNull<number>>().toBeFalse();
    expect<IsNull<unknown>>().toBeFalse();
  });
});

describe('IsNullish', () => {
  it('should return `true` for `null`, `undefined` or `null | undefined`', () => {
    expect<IsNullish<null>>().toBeTrue();
    expect<IsNullish<undefined>>().toBeTrue();
    expect<IsNullish<null | undefined>>().toBeTrue();
    expect<IsNullish<undefined | null>>().toBeTrue();
  });

  it('should return `false` for `never`', () => {
    expect<IsNullish<never>>().toBeFalse();
  });

  it('should return `false` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<IsNullish<any>>().toBeFalse();
  });

  it('should return `false` for other types', () => {
    expect<IsNullish<string | null>>().toBeFalse();
    expect<IsNullish<0 | 1 | undefined>>().toBeFalse();
    expect<IsNullish<number | null | undefined>>().toBeFalse();
    expect<IsNullish<undefined | null | number>>().toBeFalse();
    expect<IsNullish<'foo' | 'bar'>>().toBeFalse();
    expect<IsNullish<number>>().toBeFalse();
    expect<IsNullish<unknown>>().toBeFalse();
  });
});

describe('Extends', () => {
  it('should return `true` for the same types', () => {
    expect<Extends<'foo', 'foo'>>().toBeTrue();
    expect<Extends<123, 123>>().toBeTrue();
    expect<Extends<true, true>>().toBeTrue();
    expect<Extends<false, false>>().toBeTrue();
    expect<Extends<undefined, undefined>>().toBeTrue();
    expect<Extends<null, null>>().toBeTrue();
    expect<Extends<unknown, unknown>>().toBeTrue();
    expect<Extends<never, never>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<Extends<{}, {}>>().toBeTrue();
  });

  it('should return `true` for subtypes', () => {
    expect<Extends<'foo', string>>().toBeTrue();
    expect<Extends<123, number>>().toBeTrue();
    expect<Extends<true, boolean>>().toBeTrue();
    expect<Extends<false, boolean>>().toBeTrue();
    expect<Extends<undefined, undefined | null>>().toBeTrue();
    expect<Extends<null, undefined | null>>().toBeTrue();
    expect<Extends<string[], readonly string[]>>().toBeTrue();
    expect<Extends<never, null>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<Extends<string, any>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<Extends<any, string>>().toBeTrue();
  });

  it('should return `false` for supertypes', () => {
    expect<Extends<string, 'foo'>>().toBeFalse();
    expect<Extends<number, 123>>().toBeFalse();
    expect<Extends<boolean, true>>().toBeFalse();
    expect<Extends<boolean, false>>().toBeFalse();
    expect<Extends<undefined | null, undefined>>().toBeFalse();
    expect<Extends<undefined | null, null>>().toBeFalse();
    expect<Extends<readonly string[], string[]>>().toBeFalse();
    expect<Extends<null, never>>().toBeFalse();
  });
});

describe('StrictExtends', () => {
  it('should return `true` for the same types', () => {
    expect<StrictExtends<'foo', 'foo'>>().toBeTrue();
    expect<StrictExtends<123, 123>>().toBeTrue();
    expect<StrictExtends<true, true>>().toBeTrue();
    expect<StrictExtends<false, false>>().toBeTrue();
    expect<StrictExtends<undefined, undefined>>().toBeTrue();
    expect<StrictExtends<null, null>>().toBeTrue();
    expect<StrictExtends<unknown, unknown>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictExtends<{}, {}>>().toBeTrue();
  });

  it('should return `true` for subtypes', () => {
    expect<StrictExtends<'foo', string>>().toBeTrue();
    expect<StrictExtends<123, number>>().toBeTrue();
    expect<StrictExtends<true, boolean>>().toBeTrue();
    expect<StrictExtends<false, boolean>>().toBeTrue();
    expect<StrictExtends<undefined, undefined | null>>().toBeTrue();
    expect<StrictExtends<null, undefined | null>>().toBeTrue();
    expect<StrictExtends<string[], readonly string[]>>().toBeTrue();
  });

  it('should return `false` for `never`', () => {
    expect<StrictExtends<never, string>>().toBeFalse();
    expect<StrictExtends<never, number>>().toBeFalse();
    expect<StrictExtends<never, boolean>>().toBeFalse();
    expect<StrictExtends<never, undefined>>().toBeFalse();
    expect<StrictExtends<never, null>>().toBeFalse();
    expect<StrictExtends<never, unknown>>().toBeFalse();
    expect<StrictExtends<never, never>>().toBeFalse();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictExtends<never, {}>>().toBeFalse();
  });

  it('should return `false` for `any`', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    expect<StrictExtends<any, string>>().toBeFalse();
    expect<StrictExtends<any, number>>().toBeFalse();
    expect<StrictExtends<any, boolean>>().toBeFalse();
    expect<StrictExtends<any, undefined>>().toBeFalse();
    expect<StrictExtends<any, null>>().toBeFalse();
    expect<StrictExtends<any, unknown>>().toBeFalse();
    expect<StrictExtends<any, never>>().toBeFalse();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictExtends<any, {}>>().toBeFalse();

    expect<StrictExtends<string, any>>().toBeFalse();
    expect<StrictExtends<number, any>>().toBeFalse();
    expect<StrictExtends<boolean, any>>().toBeFalse();
    expect<StrictExtends<undefined, any>>().toBeFalse();
    expect<StrictExtends<null, any>>().toBeFalse();
    expect<StrictExtends<unknown, any>>().toBeFalse();
    expect<StrictExtends<never, any>>().toBeFalse();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictExtends<{}, any>>().toBeFalse();
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });
});

describe('Covers', () => {
  it('should return `true` for the same types', () => {
    expect<Covers<'foo', 'foo'>>().toBeTrue();
    expect<Covers<123, 123>>().toBeTrue();
    expect<Covers<true, true>>().toBeTrue();
    expect<Covers<false, false>>().toBeTrue();
    expect<Covers<undefined, undefined>>().toBeTrue();
    expect<Covers<null, null>>().toBeTrue();
    expect<Covers<unknown, unknown>>().toBeTrue();
    expect<Covers<never, never>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<Covers<{}, {}>>().toBeTrue();
  });

  it('should return `false` for subtypes', () => {
    expect<Covers<'foo', string>>().toBeFalse();
    expect<Covers<123, number>>().toBeFalse();
    expect<Covers<true, boolean>>().toBeFalse();
    expect<Covers<false, boolean>>().toBeFalse();
    expect<Covers<undefined, undefined | null>>().toBeFalse();
    expect<Covers<null, undefined | null>>().toBeFalse();
    expect<Covers<string[], readonly string[]>>().toBeFalse();
    expect<Covers<never, null>>().toBeFalse();
  });

  it('should return `true` for supertypes', () => {
    expect<Covers<string, 'foo'>>().toBeTrue();
    expect<Covers<number, 123>>().toBeTrue();
    expect<Covers<boolean, true>>().toBeTrue();
    expect<Covers<boolean, false>>().toBeTrue();
    expect<Covers<undefined | null, undefined>>().toBeTrue();
    expect<Covers<undefined | null, null>>().toBeTrue();
    expect<Covers<readonly string[], string[]>>().toBeTrue();
    expect<Covers<null, never>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<Covers<any, string>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<Covers<string, any>>().toBeTrue();
  });
});

describe('StrictCovers', () => {
  it('should return `true` for the same types', () => {
    expect<StrictCovers<'foo', 'foo'>>().toBeTrue();
    expect<StrictCovers<123, 123>>().toBeTrue();
    expect<StrictCovers<true, true>>().toBeTrue();
    expect<StrictCovers<false, false>>().toBeTrue();
    expect<StrictCovers<undefined, undefined>>().toBeTrue();
    expect<StrictCovers<null, null>>().toBeTrue();
    expect<StrictCovers<unknown, unknown>>().toBeTrue();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictCovers<{}, {}>>().toBeTrue();
  });

  it('should return `false` for subtypes', () => {
    expect<StrictCovers<'foo', string>>().toBeFalse();
    expect<StrictCovers<123, number>>().toBeFalse();
    expect<StrictCovers<true, boolean>>().toBeFalse();
    expect<StrictCovers<false, boolean>>().toBeFalse();
    expect<StrictCovers<undefined, undefined | null>>().toBeFalse();
    expect<StrictCovers<null, undefined | null>>().toBeFalse();
    expect<StrictCovers<string[], readonly string[]>>().toBeFalse();
  });

  it('should return `false` for `never`', () => {
    expect<StrictCovers<never, string>>().toBeFalse();
    expect<StrictCovers<never, number>>().toBeFalse();
    expect<StrictCovers<never, boolean>>().toBeFalse();
    expect<StrictCovers<never, undefined>>().toBeFalse();
    expect<StrictCovers<never, null>>().toBeFalse();
    expect<StrictCovers<never, unknown>>().toBeFalse();
    expect<StrictCovers<never, never>>().toBeFalse();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictCovers<never, {}>>().toBeFalse();
  });

  it('should return `false` for `any`', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    expect<StrictCovers<any, string>>().toBeFalse();
    expect<StrictCovers<any, number>>().toBeFalse();
    expect<StrictCovers<any, boolean>>().toBeFalse();
    expect<StrictCovers<any, undefined>>().toBeFalse();
    expect<StrictCovers<any, null>>().toBeFalse();
    expect<StrictCovers<any, unknown>>().toBeFalse();
    expect<StrictCovers<any, never>>().toBeFalse();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictCovers<any, {}>>().toBeFalse();

    expect<StrictCovers<string, any>>().toBeFalse();
    expect<StrictCovers<number, any>>().toBeFalse();
    expect<StrictCovers<boolean, any>>().toBeFalse();
    expect<StrictCovers<undefined, any>>().toBeFalse();
    expect<StrictCovers<null, any>>().toBeFalse();
    expect<StrictCovers<unknown, any>>().toBeFalse();
    expect<StrictCovers<never, any>>().toBeFalse();
    // eslint-disable-next-line @typescript-eslint/ban-types
    expect<StrictCovers<{}, any>>().toBeFalse();
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });
});

describe('MatchesBoolean', () => {
  it('should return `true` for `true`, `false` or `boolean`', () => {
    expect<MatchesBoolean<true>>().toBeTrue();
    expect<MatchesBoolean<false>>().toBeTrue();
    expect<MatchesBoolean<boolean>>().toBeTrue();
  });

  it('should return `false` for `never`', () => {
    expect<MatchesBoolean<never>>().toBeFalse();
  });

  it('should return `boolean` for `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect<MatchesBoolean<any>>().toEqual<boolean>();
  });

  it('should return `false` for other types', () => {
    expect<MatchesBoolean<'foo' | 'bar'>>().toBeFalse();
    expect<MatchesBoolean<number>>().toBeFalse();
    expect<MatchesBoolean<unknown>>().toBeFalse();
  });
});
