import type { Equals } from './equals';
import type { IsAny } from './is-any';
import type { IsNever } from './is-never';

/**
 * Stringify a type.
 *
 * @example
 * ```typescript
 * type R1 = Stringify<string>;
 * //   ^?: 'string'
 * type R2 = Stringify<10 | 'foo' | true>;
 * //   ^?: "10 | 'foo' | true"
 * type R3 = Stringify<{
 * //   ^?: '{ a: (number, boolean?, ...string[]) => void; b?: string | number; readonly c?: [55 | "bar", ...bigint[]] }'
 *   a: (a: number, b?: boolean, ...args: string[]) => void;
 *   b?: number | string;
 *   readonly c?: [55 | 'bar', ...bigint[]]
 * }>;
 * ```
 */
export type Stringify<
  T,
  Options extends Partial<StringifyOptions> = { quote: 'single'; wrapParenthesesIfUnion: false },
> = _Stringify<
  T,
  {
    [K in keyof StringifyOptions]: K extends keyof Options ? NonNullable<Options[K]>
    : StringifyOptionsDefault[K];
  }
>;
export type StringifyOptions = { quote: 'single' | 'double'; wrapParenthesesIfUnion: boolean };
export type StringifyOptionsDefault = { quote: 'single'; wrapParenthesesIfUnion: false };

type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U ? U[K]
  : K extends keyof T ? T[K]
  : never;
};

export type _Stringify<T, Options extends StringifyOptions> =
  IsAny<T> extends true ? 'any'
  : IsNever<T> extends true ? 'never'
  : Equals<T, unknown> extends true ? 'unknown'
  : Equals<T, boolean> extends true ? 'boolean'
  : boolean extends T ?
    Options['wrapParenthesesIfUnion'] extends true ?
      `(boolean | ${_Stringify<Exclude<T, boolean>, Options>})`
    : `boolean | ${_Stringify<Exclude<T, boolean>, Options>}`
  : JoinStringUnion<
      T extends T ?
        Equals<T, string> extends true ? 'string'
        : T extends string ?
          Options['quote'] extends 'single' ?
            `'${T}'`
          : `"${T}"`
        : Equals<T, number> extends true ? 'number'
        : T extends number ? `${T}`
        : Equals<T, bigint> extends true ? 'bigint'
        : T extends bigint ? `${T}n`
        : T extends true ? 'true'
        : T extends false ? 'false'
        : Equals<T, symbol> extends true ? 'symbol'
        : T extends symbol ? `unique symbol`
        : Equals<T, void> extends true ? 'void'
        : T extends null ? 'null'
        : T extends undefined ? 'undefined'
        : T extends (...args: never[]) => unknown ? StringifyFunction<T, Options>
        : T extends readonly unknown[] ? StringifyArray<T, Options>
        : T extends object ? StringifyObject<T, Options>
        : '...'
      : never,
      Options
    >;

type JoinStringUnion<
  S extends string,
  Options extends StringifyOptions,
  Result extends string = '',
> =
  (
    [S] extends [LastOf<S>] ?
      Options['wrapParenthesesIfUnion'] extends false ? `${S}${Result}`
      : Result extends '' ? S
      : `(${S}${Result})`
    : JoinStringUnion<Exclude<S, LastOf<S>>, Options, ` | ${LastOf<S>}${Result}`>
  ) extends infer R extends string ?
    R
  : never;
type LastOf<U> =
  IntersectOf<U extends unknown ? (x: U) => void : never> extends (x: infer P extends U) => void ? P
  : never;
type IntersectOf<U> =
  (U extends unknown ? (_: U) => void : never) extends (mergedIntersection: infer I) => void ?
    I & U // The `& U` is to allow indexing by the resulting type
  : never;

/**
 * Stringify a function type.
 *
 * @example
 * ```typescript
 * type R1 = StringifyFunction<(a: string, b?: number) => boolean>;
 * //   ^?: '(string, number?) => boolean'
 * type R2 = StringifyFunction<(a: number, b?: boolean, ...args: string[]) => void>;
 * //   ^?: '(number, boolean?, ...string[]) => void'
 * ```
 */
type StringifyFunction<
  F extends (...args: never[]) => unknown,
  Options extends StringifyOptions,
> = `(${[Parameters<F>] extends [never] ? '...never'
: _StringifyTuple<Parameters<F>, Options>}) => ${_Stringify<ReturnType<F>, Options>}`;

/**
 * Stringify an array type.
 *
 * @example
 * ```typescript
 * type R1 = StringifyArray<string[]>;
 * //   ^?: 'string[]'
 * type R2 = StringifyArray<readonly (string | number)[]>;
 * //   ^?: 'readonly (string | number)[]'
 * type R3 = StringifyArray<[a: string, b?: number, ...boolean[]]>;
 * //   ^?: '[string, number?, ...boolean[]]'
 * type R4 = StringifyArray<readonly [boolean | 10n, ...string[], 'foo' | 42, number]>;
 * //   ^?: "readonly [boolean | 10n, ...string[], 'foo' | 42, number]"
 * ```
 */
type StringifyArray<TS extends readonly unknown[], Options extends StringifyOptions> =
  IsTuple<TS> extends true ? StringifyTuple<TS, Options> : _StringifyArray<TS, Options>;
type _StringifyArray<TS extends readonly unknown[], Options extends StringifyOptions> =
  TS extends unknown[] ?
    `${_Stringify<TS[number], Merge<Options, { wrapParenthesesIfUnion: true }>>}[]`
  : `readonly ${_Stringify<TS[number], Merge<Options, { wrapParenthesesIfUnion: true }>>}[]`;
type IsTuple<TS extends readonly unknown[]> =
  IsFixedLengthTuple<TS> extends true ?
    // Must be a tuple if `length` is not `number`
    true
  : TS extends readonly [...unknown[], unknown] | readonly [unknown, ...unknown[]] ?
    // Must be a tuple If have at least 1 required element
    true
  : // If have no required element, it may have only optional elements, and if so, it must have an
  // optional element at `0`, since optional elements cannot follow rest elements
  // Check if the type of `TS[0]` is different from `TS[number]`
  Equals<TS[0], TS[number]> extends false ? true
  : // All possible cases are covered, so it is not a tuple
    // Notably, cases like `[string?, ...string[]]` are also considered as non-tuple, since it is
    // not possible to distinguish it from `string[]`
    false;
type IsFixedLengthTuple<TS extends readonly unknown[]> = number extends TS['length'] ? false : true;
type StringifyTuple<TS extends readonly unknown[], Options extends StringifyOptions> =
  TS extends unknown[] ? `[${_StringifyTuple<TS, Options>}]`
  : `readonly [${_StringifyTuple<TS, Options>}]`;
type _StringifyTuple<TS extends readonly unknown[], Options extends StringifyOptions> =
  (
    IsTuple<TS> extends false ? `...${_StringifyArray<TS, Options>}`
    : IsFixedLengthTuple<TS> extends true ?
      // Have no rest elements (but may have optional elements)
      _StringifyFixedLengthTuple<TS, Options>
    : // Have rest elements
    TS extends readonly [infer Head, ...infer Middle, infer Last] ?
      // If rest elements is in middle, `Head` and `Last` must be required elements
      // Proof:
      // 1. If `Last` is optional, since optional elements cannot follow rest elements, so `Last`
      //    must be required
      // 2. If `Head` is optional, since required elements cannot follow optional elements, `Last`
      //    must be optional, but we already know that `Last` is required, contradiction
      `${_Stringify<Head, Options>}, ${_StringifyTuple<Middle, Options>}, ${_Stringify<Last, Options>}`
    : TS extends readonly [...infer Init, infer Last] ?
      // If rest elements is at the beginning, `Last` must be required, which is obvious
      `${_StringifyTuple<Init, Options>}, ${_Stringify<Last, Options>}`
    : // If rest elements is at the end, `Head` can be optional, so we have 2 cases to consider
    // 1. `Head` is required
    TS extends readonly [infer Head, ...infer Tail] ?
      `${_Stringify<Head, Options>}, ${_StringifyTuple<Tail, Options>}`
    : // 2. `Head` is optional
    TS extends readonly [(infer Head)?, ...infer Tail] ?
      `${_Stringify<Head, Options>}?, ${_StringifyTuple<Tail, Merge<Options, { wrapParenthesesIfUnion: true }>>}`
    : never
  ) extends infer R extends string ?
    R
  : never;
type _StringifyFixedLengthTuple<
  TS extends readonly unknown[],
  Options extends StringifyOptions,
  Result extends string = '',
> =
  TS extends readonly [] ? Result
  : TS extends readonly [infer Head] ?
    `${Result}${Result extends '' ? '' : ', '}${_Stringify<Head, Options>}`
  : TS extends readonly [(infer Head)?] ?
    `${Result}${Result extends '' ? '' : ', '}${_Stringify<Head, Merge<Options, { wrapParenthesesIfUnion: true }>>}?`
  : TS extends readonly [infer Head, ...infer Tail] ?
    _StringifyFixedLengthTuple<
      Tail,
      Options,
      `${Result}${Result extends '' ? '' : ', '}${_Stringify<Head, Options>}`
    >
  : TS extends readonly [(infer Head)?, ...infer Tail] ?
    _StringifyFixedLengthTuple<
      Tail,
      Options,
      `${Result}${Result extends '' ? '' : ', '}${_Stringify<Head, Merge<Options, { wrapParenthesesIfUnion: true }>>}?`
    >
  : never;

/**
 * Stringify an object type.
 *
 * @example
 * ```typescript
 * type R = StringifyObject<{ a: string, b?: number; readonly c?: boolean; }>;
 * //   ^?: '{ a: string; b?: number; readonly c?: boolean; }'
 * ```
 */
type StringifyObject<
  T extends object,
  Options extends StringifyOptions,
> = `{ ${_StringifyObject<T, Options>} }`;
type _StringifyObject<
  T extends object,
  Options extends StringifyOptions,
  Result extends string = '',
> =
  keyof T extends LastOf<keyof T> ?
    `${StringifyPair<T, keyof T, Options>}${Result extends '' ? '' : '; '}${Result}`
  : _StringifyObject<
      Omit<T, LastOf<keyof T>>,
      Options,
      `${StringifyPair<T, LastOf<keyof T>, Options>}${Result extends '' ? '' : '; '}${Result}`
    >;
type StringifyPair<
  T extends object,
  K extends keyof T,
  Options extends StringifyOptions,
> = `${StringifyKey<K, { optional: IsOptional<T, K>; readonly: IsReadonly<T, K> }>}: ${_Stringify<
  IsOptional<T, K> extends true ? Exclude<T[K], undefined> : T[K],
  Options
>}`;
type IsOptional<T, K extends keyof T> = { [P in K]?: T[K] } extends Pick<T, K> ? true : false;
type IsReadonly<T, K extends keyof T> =
  Equals<Pick<T, K>, { readonly [P in K]: T[K] }> extends true ? true : false;
type StringifyKey<
  K extends PropertyKey,
  Metadata extends { optional: boolean; readonly: boolean },
> =
  Metadata extends { optional: true; readonly: true } ? `readonly ${_StringifyKey<K>}?`
  : Metadata extends { optional: true } ? `${_StringifyKey<K>}?`
  : Metadata extends { readonly: true } ? `readonly ${_StringifyKey<K>}`
  : _StringifyKey<K>;
type _StringifyKey<K extends PropertyKey> =
  K extends symbol ? '[unique symbol]'
  : K extends string | number ? `${K}`
  : never;
