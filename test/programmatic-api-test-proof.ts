/* eslint-disable @typescript-eslint/ban-ts-comment */

import { describe, equal, error, expect, extend, it, test } from 'typroof';

type Append<S extends string, Ext extends string> = `${S}${Ext}`;
type Prepend<S extends string, Start extends string> = `${Start}${S}`;

const append = <S extends string, Ext extends string>(s: S, ext: Ext): Append<S, Ext> =>
  `${s}${ext}`;

test('Append', () => {
  expect<Append<'foo', 'bar'>>().to(equal<'foobar'>);
  expect<Append<'foo', 'bar'>>().to(extend<string>);
  expect<Append<'foo', 'bar'>>().not.to(extend<number>);
  expect(append('foo', 'bar')).to(equal('foobar' as const));
});

describe('Prepend', () => {
  it('should prepend a string to another', () => {
    // @ts-expect-error
    expect<Prepend<'foo', 'bar'>>().to(equal<'foobar'>);
  });

  it('should accept only strings', () => {
    // @ts-expect-error
    expect<Prepend<42, 43>>().to(error);
  });
});

// Test for nested describe blocks
// See #1: https://github.com/Snowflyt/typroof/issues/1
describe('describe01', () => {
  it('it01', () => {
    type S = 'a';
    type R = 'a';
    expect<S>().to(equal<R>);
  });

  describe('describe02', () => {
    it('it02', () => {
      type S = 'a';
      type R = 'a';
      expect<S>().to(equal<R>);
    });
  });
});
