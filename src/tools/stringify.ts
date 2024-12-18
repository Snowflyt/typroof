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
  [],
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

type _IsVisited<T, Visited extends unknown[]> =
  Visited extends [infer Head, ...infer Tail] ?
    Equals<T, Head> extends true ?
      true
    : _IsVisited<T, Tail>
  : false;

type _Stringify<T, Visited extends unknown[], Options extends StringifyOptions> =
  IsAny<T> extends true ? 'any'
  : IsNever<T> extends true ? 'never'
  : Equals<T, unknown> extends true ? 'unknown'
  : Equals<T, boolean> extends true ? 'boolean'
  : boolean extends T ?
    Options['wrapParenthesesIfUnion'] extends true ?
      `(boolean | ${_Stringify<Exclude<T, boolean>, [...Visited, T], Options>})`
    : `boolean | ${_Stringify<Exclude<T, boolean>, [...Visited, T], Options>}`
  : _IsVisited<T, Visited> extends true ? '...'
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
        : Equals<T, typeof globalThis> extends true ? 'typeof globalThis'
        : T extends Date ? 'Date'
        : T extends RegExp ? 'RegExp'
        : T extends (...args: never[]) => unknown ? StringifyFunction<T, Visited, Options>
        : T extends readonly unknown[] ? StringifyArray<T, [...Visited, T], Options>
        : T extends object ? StringifyObject<T, [...Visited, T], Options>
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
  Visited extends unknown[],
  Options extends StringifyOptions,
> = `(${[Parameters<F>] extends [never] ? '...never' : _StringifyTuple<Parameters<F>, Visited, Options>}) => ${_Stringify<ReturnType<F>, Visited, Options>}`;

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
type StringifyArray<
  TS extends readonly unknown[],
  Visited extends unknown[],
  Options extends StringifyOptions,
> =
  IsTuple<TS> extends true ? StringifyTuple<TS, Visited, Options>
  : _StringifyArray<TS, Visited, Options>;
type _StringifyArray<
  TS extends readonly unknown[],
  Visited extends unknown[],
  Options extends StringifyOptions,
> =
  TS extends unknown[] ?
    `${_Stringify<TS[number], Visited, Merge<Options, { wrapParenthesesIfUnion: true }>>}[]`
  : `readonly ${_Stringify<
      TS[number],
      Visited,
      Merge<Options, { wrapParenthesesIfUnion: true }>
    >}[]`;
type IsTuple<TS extends readonly unknown[]> =
  IsFixedLengthTuple<TS> extends true ? true
  : TS extends readonly [...unknown[], unknown] | readonly [unknown, ...unknown[]] ? true
  : Equals<TS[0], TS[number]> extends false ? true
  : false;
type IsFixedLengthTuple<TS extends readonly unknown[]> = number extends TS['length'] ? false : true;
type StringifyTuple<
  TS extends readonly unknown[],
  Visited extends unknown[],
  Options extends StringifyOptions,
> =
  TS extends unknown[] ? `[${_StringifyTuple<TS, Visited, Options>}]`
  : `readonly [${_StringifyTuple<TS, Visited, Options>}]`;
type _StringifyTuple<
  TS extends readonly unknown[],
  Visited extends unknown[],
  Options extends StringifyOptions,
> =
  (
    IsTuple<TS> extends false ? `...${_StringifyArray<TS, Visited, Options>}`
    : IsFixedLengthTuple<TS> extends true ? _StringifyFixedLengthTuple<TS, Visited, Options>
    : TS extends readonly [infer Head, ...infer Middle, infer Last] ?
      `${_Stringify<Head, Visited, Options>}, ${_StringifyTuple<Middle, Visited, Options>}, ${_Stringify<Last, Visited, Options>}`
    : TS extends readonly [...infer Init, infer Last] ?
      `${_StringifyTuple<Init, Visited, Options>}, ${_Stringify<Last, Visited, Options>}`
    : TS extends readonly [infer Head, ...infer Tail] ?
      `${_Stringify<Head, Visited, Options>}, ${_StringifyTuple<Tail, Visited, Options>}`
    : TS extends readonly [(infer Head)?, ...infer Tail] ?
      `${_Stringify<Head, Visited, Options>}?, ${_StringifyTuple<
        Tail,
        Visited,
        Merge<Options, { wrapParenthesesIfUnion: true }>
      >}`
    : never
  ) extends infer R extends string ?
    R
  : never;
type _StringifyFixedLengthTuple<
  TS extends readonly unknown[],
  Visited extends unknown[],
  Options extends StringifyOptions,
  Result extends string = '',
> =
  TS extends readonly [] ? Result
  : TS extends readonly [infer Head] ?
    `${Result}${Result extends '' ? '' : ', '}${_Stringify<Head, Visited, Options>}`
  : TS extends readonly [(infer Head)?] ?
    `${Result}${Result extends '' ? '' : ', '}${_Stringify<
      Head,
      Visited,
      Merge<Options, { wrapParenthesesIfUnion: true }>
    >}?`
  : TS extends readonly [infer Head, ...infer Tail] ?
    _StringifyFixedLengthTuple<
      Tail,
      Visited,
      Options,
      `${Result}${Result extends '' ? '' : ', '}${_Stringify<Head, Visited, Options>}`
    >
  : TS extends readonly [(infer Head)?, ...infer Tail] ?
    _StringifyFixedLengthTuple<
      Tail,
      Visited,
      Options,
      `${Result}${Result extends '' ? '' : ', '}${_Stringify<
        Head,
        Visited,
        Merge<Options, { wrapParenthesesIfUnion: true }>
      >}?`
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
  Visited extends unknown[],
  Options extends StringifyOptions,
> = `{ ${_StringifyObject<T, Visited, Options>} }`;
type _StringifyObject<
  T extends object,
  Visited extends unknown[],
  Options extends StringifyOptions,
  Result extends string = '',
> =
  keyof T extends LastOf<keyof T> ?
    `${StringifyPair<T, keyof T, Visited, Options>}${Result extends '' ? '' : '; '}${Result}`
  : _StringifyObject<
      Omit<T, LastOf<keyof T>>,
      Visited,
      Options,
      `${StringifyPair<T, LastOf<keyof T>, Visited, Options>}${Result extends '' ? '' : '; '}${Result}`
    >;
type StringifyPair<
  T extends object,
  K extends keyof T,
  Visited extends unknown[],
  Options extends StringifyOptions,
> = `${StringifyKey<
  K,
  { optional: IsOptional<T, K>; readonly: IsReadonly<T, K> }
>}: ${_Stringify<IsOptional<T, K> extends true ? Exclude<T[K], undefined> : T[K], Visited, Options>}`;
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
