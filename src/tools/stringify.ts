/* eslint-disable @typescript-eslint/no-wrapper-object-types */

import type { Equals } from './equals';
import type { IsAny } from './is-any';
import type { IsNever } from './is-never';

/**
 * Custom serializers for {@linkcode Stringify}.
 *
 * Register your own serializers here using [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).
 */
// We already registered the built-in serializers for some global objects here.
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
export interface StringifySerializer<T> {
  /* Value properties */
  globalThis: Equals<T, typeof globalThis> extends true ? 'typeof globalThis' : never;

  /* Error objects */
  // Sadly, the type of some error objects are entirely the same in TypeScript,
  // so `Stringify<TypeError>` will return `'Error'` instead of `'TypeError'`.
  Error: Equals<T, Error> extends true ? 'Error' : never;
  ErrorConstructor: Equals<T, ErrorConstructor> extends true ? 'ErrorConstructor' : never;

  /* Numbers and dates */
  Math: Equals<T, Math> extends true ? 'Math' : never;
  Date: T extends Date ? 'Date' : never;
  DateConstructor: Equals<T, DateConstructor> extends true ? 'DateConstructor' : never;

  /* Text processing */
  RegExp: T extends RegExp ? 'RegExp' : never;
  RegExpConstructor: Equals<T, RegExpConstructor> extends true ? 'RegExpConstructor' : never;

  /* Indexed collections */
  ArrayConstructor: Equals<T, ArrayConstructor> extends true ? 'ArrayConstructor' : never;
  Int8Array: T extends Int8Array<ArrayBufferLike> ? 'Int8Array'
  : T extends Int8Array<infer B> ? `Int8Array<${Stringify<B>}`
  : never;
  Int8ArrayConstructor: Equals<T, Int8ArrayConstructor> extends true ? 'Int8ArrayConstructor'
  : never;
  Uint8Array: T extends Uint8Array<ArrayBufferLike> ? 'Uint8Array'
  : T extends Uint8Array<infer B> ? `Uint8Array<${Stringify<B>}`
  : never;
  Uint8ArrayConstructor: Equals<T, Uint8ArrayConstructor> extends true ? 'Uint8ArrayConstructor'
  : never;
  Uint8ClampedArray: T extends Uint8ClampedArray<ArrayBufferLike> ? 'Uint8ClampedArray'
  : T extends Uint8ClampedArray<infer B> ? `Uint8ClampedArray<${Stringify<B>}`
  : never;
  Uint8ClampedArrayConstructor: Equals<T, Uint8ClampedArrayConstructor> extends true ?
    'Uint8ClampedArrayConstructor'
  : never;
  Int16Array: T extends Int16Array<ArrayBufferLike> ? 'Int16Array'
  : T extends Int16Array<infer B> ? `Int16Array<${Stringify<B>}`
  : never;
  Int16ArrayConstructor: Equals<T, Int16ArrayConstructor> extends true ? 'Int16ArrayConstructor'
  : never;
  Uint16Array: T extends Uint16Array<ArrayBufferLike> ? 'Uint16Array'
  : T extends Uint16Array<infer B> ? `Uint16Array<${Stringify<B>}`
  : never;
  Uint16ArrayConstructor: Equals<T, Uint16ArrayConstructor> extends true ? 'Uint16ArrayConstructor'
  : never;
  Int32Array: T extends Int32Array<ArrayBufferLike> ? 'Int32Array'
  : T extends Int32Array<infer B> ? `Int32Array<${Stringify<B>}`
  : never;
  Int32ArrayConstructor: Equals<T, Int32ArrayConstructor> extends true ? 'Int32ArrayConstructor'
  : never;
  Uint32Array: T extends Uint32Array<ArrayBufferLike> ? 'Uint32Array'
  : T extends Uint32Array<infer B> ? `Uint32Array<${Stringify<B>}`
  : never;
  Uint32ArrayConstructor: Equals<T, Uint32ArrayConstructor> extends true ? 'Uint32ArrayConstructor'
  : never;
  Float32Array: T extends Float32Array<ArrayBufferLike> ? 'Float32Array'
  : T extends Float32Array<infer B> ? `Float32Array<${Stringify<B>}`
  : never;
  Float32ArrayConstructor: Equals<T, Float32ArrayConstructor> extends true ?
    'Float32ArrayConstructor'
  : never;
  Float64Array: T extends Float64Array<ArrayBufferLike> ? 'Float64Array'
  : T extends Float64Array<infer B> ? `Float64Array<${Stringify<B>}`
  : never;
  Float64ArrayConstructor: Equals<T, Float64ArrayConstructor> extends true ?
    'Float64ArrayConstructor'
  : never;

  /* Keyed collections */
  Map: T extends Map<infer K, infer V> ? `Map<${Stringify<K>}, ${Stringify<V>}` : never;
  MapConstructor: Equals<T, MapConstructor> extends true ? 'MapConstructor' : never;
  Set: T extends Set<infer V> ? `Set<${Stringify<V>}` : never;
  SetConstructor: Equals<T, SetConstructor> extends true ? 'SetConstructor' : never;
  WeakMap: T extends WeakMap<infer K, infer V> ? `WeakMap<${Stringify<K>}, ${Stringify<V>}` : never;
  WeakMapConstructor: Equals<T, WeakMapConstructor> extends true ? 'WeakMapConstructor' : never;
  WeakSet: T extends WeakSet<infer V> ? `WeakSet<${Stringify<V>}` : never;
  WeakSetConstructor: Equals<T, WeakSetConstructor> extends true ? 'WeakSetConstructor' : never;

  /* Structured data */
  ArrayBuffer: T extends ArrayBuffer ? 'ArrayBuffer' : never;
  ArrayBufferConstructor: Equals<T, ArrayBufferConstructor> extends true ? 'ArrayBufferConstructor'
  : never;
  SharedArrayBuffer: T extends SharedArrayBuffer ? 'SharedArrayBuffer' : never;
  SharedArrayBufferConstructor: Equals<T, SharedArrayBufferConstructor> extends true ?
    'SharedArrayBufferConstructor'
  : never;
  DataView: T extends DataView<ArrayBufferLike> ? 'DataView'
  : T extends DataView<infer B> ? `DataView<${Stringify<B>}`
  : never;
  DataViewConstructor: Equals<T, DataViewConstructor> extends true ? 'DataViewConstructor' : never;
  Atomics: Equals<T, Atomics> extends true ? 'Atomics' : never;
  JSON: Equals<T, JSON> extends true ? 'JSON' : never;

  /* Control abstraction objects */
  Iterator: T extends Iterator<infer T, infer TReturn, infer TNext> ?
    `Iterator<${Stringify<T>}, ${Stringify<TReturn>}, ${Stringify<TNext>}`
  : never;
  AsyncIterator: T extends AsyncIterator<infer T, infer TReturn, infer TNext> ?
    `AsyncIterator<${Stringify<T>}, ${Stringify<TReturn>}, ${Stringify<TNext>}`
  : never;

  /* Reflection */
  Reflect: Equals<T, typeof Reflect> extends true ? 'typeof Reflect' : never;
  ProxyConstructor: Equals<T, ProxyConstructor> extends true ? 'ProxyConstructor' : never;

  /* Internationalization */
  Intl: Equals<T, typeof Intl> extends true ? 'typeof Intl' : never;
  'Intl.Collator': T extends Intl.Collator ? 'Intl.Collator' : never;
  'Intl.CollatorConstructor': Equals<T, Intl.CollatorConstructor> extends true ?
    'Intl.CollatorConstructor'
  : never;
  'Intl.DateTimeFormat': T extends Intl.DateTimeFormat ? 'Intl.DateTimeFormat' : never;
  'Intl.DateTimeFormatConstructor': Equals<T, Intl.DateTimeFormatConstructor> extends true ?
    'Intl.DateTimeFormatConstructor'
  : never;
  'Intl.DisplayNames': T extends Intl.DisplayNames ? 'Intl.DisplayNames' : never;
  'Intl.DisplayNamesConstructor': Equals<T, typeof Intl.DisplayNames> extends true ?
    'Intl.DisplayNamesConstructor'
  : never;
  'Intl.Locale': T extends Intl.Locale ? 'Intl.Locale' : never;
  'Intl.LocaleConstructor': Equals<T, typeof Intl.Locale> extends true ? 'Intl.LocaleConstructor'
  : never;
  'Intl.NumberFormat': T extends Intl.NumberFormat ? 'Intl.NumberFormat' : never;
  'Intl.NumberFormatConstructor': Equals<T, Intl.NumberFormatConstructor> extends true ?
    'Intl.NumberFormatConstructor'
  : never;
  'Intl.PluralRules': T extends Intl.PluralRules ? 'Intl.PluralRules' : never;
  'Intl.PluralRulesConstructor': Equals<T, Intl.PluralRulesConstructor> extends true ?
    'Intl.PluralRulesConstructor'
  : never;
  'Intl.RelativeTimeFormat': T extends Intl.RelativeTimeFormat ? 'Intl.RelativeTimeFormat' : never;
  'Intl.RelativeTimeFormatConstructor': Equals<T, typeof Intl.RelativeTimeFormat> extends true ?
    'Intl.RelativeTimeFormatConstructor'
  : never;
}

type GetSerializer<T> = _GetSerializer<T, keyof StringifySerializer<T>>;
type _GetSerializer<T, K extends keyof StringifySerializer<T>> =
  [K] extends [LastOf<K>] ? StringifySerializer<T>[K]
  : [StringifySerializer<T>[LastOf<K>]] extends [never] ? _GetSerializer<T, Exclude<K, LastOf<K>>>
  : StringifySerializer<T>[LastOf<K>];

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
  // `any` and `never` should be handled first because of their special behavior
  IsAny<T> extends true ? 'any'
  : IsNever<T> extends true ? 'never'
  : Equals<T, unknown> extends true ? 'unknown'
  : // We must handle `Boolean` and `boolean` just after because they are unions
  // Sadly, `Boolean` and `boolean` are not the same type, so we need to handle them separately,
  // so is the case for `String/Number/BigInt/Symbol/Object`
  Equals<T, Boolean> extends true ? 'Boolean'
  : UnionHas<T, Boolean> extends true ?
    Options['wrapParenthesesIfUnion'] extends true ?
      `(Boolean | ${_Stringify<Exclude<T, Boolean>, [...Visited, T], Options>})`
    : `Boolean | ${_Stringify<Exclude<T, Boolean>, [...Visited, T], Options>}`
  : Equals<T, boolean> extends true ? 'boolean'
  : UnionHas<T, boolean> extends true ?
    Options['wrapParenthesesIfUnion'] extends true ?
      `(boolean | ${_Stringify<Exclude<T, boolean>, [...Visited, T], Options>})`
    : `boolean | ${_Stringify<Exclude<T, boolean>, [...Visited, T], Options>}`
  : // Handle visited types to avoid infinite recursion
  _IsVisited<T, Visited> extends true ? '...'
  : // Force distribute for union types
    JoinStringUnion<
      T extends T ?
        /* Custom serializers */
        IsNever<GetSerializer<T>> extends false ? GetSerializer<T>
        : /* string */
        Equals<T, String> extends true ? 'String'
        : Equals<T, string> extends true ? 'string'
        : T extends string ?
          Options['quote'] extends 'single' ?
            `'${T}'`
          : `"${T}"`
        : /* number/bigint */
        Equals<T, Number> extends true ? 'Number'
        : Equals<T, number> extends true ? 'number'
        : T extends number ? `${T}`
        : Equals<T, BigInt> extends true ? 'BigInt'
        : Equals<T, bigint> extends true ? 'bigint'
        : T extends bigint ? `${T}n`
        : /* boolean */
        // `Boolean` and `boolean` are handled above
        T extends true ? 'true'
        : T extends false ? 'false'
        : /* symbol */
        Equals<T, Symbol> extends true ? 'Symbol'
        : Equals<T, symbol> extends true ? 'symbol'
        : T extends symbol ? `unique symbol`
        : /* void/null/undefined */
        Equals<T, void> extends true ? 'void'
        : T extends null ? 'null'
        : T extends undefined ? 'undefined'
        : /* function */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        Equals<T, Function> extends true ? 'Function'
        : T extends (...args: never[]) => unknown ? StringifyFunction<T, [...Visited, T], Options>
        : T extends readonly unknown[] ? StringifyArray<T, [...Visited, T], Options>
        : /* object */
        Equals<T, Object> extends true ? 'Object'
        : Equals<T, object> extends true ? 'object'
        : Equals<T, {}> extends true ? '{}'
        : T extends object ? StringifyObject<T, [...Visited, T], Options>
        : '...'
      : never,
      ' | ',
      Options
    >;

type JoinStringUnion<
  S extends string,
  Sep extends string,
  Options extends StringifyOptions,
  Result extends string = '',
> =
  (
    [S] extends [LastOf<S>] ?
      Options['wrapParenthesesIfUnion'] extends false ? `${S}${Result}`
      : Result extends '' ? S
      : `(${S}${Result})`
    : JoinStringUnion<Exclude<S, LastOf<S>>, Sep, Options, `${Sep}${LastOf<S>}${Result}`>
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
 * Check if a union type has a specific type.
 */
type UnionHas<Union, T> =
  [Union] extends [LastOf<Union>] ? Equals<Union, T>
  : Equals<LastOf<Union>, T> extends true ? true
  : UnionHas<Exclude<Union, LastOf<Union>>, T>;

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
> =
  [Exclude<Overload<F>, LastOf<Overload<F>>>] extends [never] ?
    `(${[Parameters<F>] extends [never] ? '...never' : _StringifyTuple<Parameters<F>, Visited, Options>}) => ${_Stringify<ReturnType<F>, Visited, Options>}`
  : Overload<F> extends infer F extends (...args: never) => unknown ?
    JoinStringUnion<
      F extends F ?
        `((${[Parameters<F>] extends [never] ? '...never' : _StringifyTuple<Parameters<F>, Visited, Options>}) => ${_Stringify<ReturnType<F>, Visited, Options>})`
      : never,
      ' & ',
      Options
    >
  : never;
/**
 * Get all overloads of a function type as a union.
 *
 * Copied from [expect-type source code](https://github.com/mmkal/expect-type/blob/213a745ba82db8a52bf6216f6b1c90475a7f73cb/src/overloads.ts#L14-L17).
 */
type Overload<F> =
  F extends (
    {
      (...args: infer A1): infer R1;
      (...args: infer A2): infer R2;
      (...args: infer A3): infer R3;
      (...args: infer A4): infer R4;
      (...args: infer A5): infer R5;
      (...args: infer A6): infer R6;
      (...args: infer A7): infer R7;
      (...args: infer A8): infer R8;
      (...args: infer A9): infer R9;
      (...args: infer A10): infer R10;
    }
  ) ?
    | ((...p: A1) => R1)
    | ((...p: A2) => R2)
    | ((...p: A3) => R3)
    | ((...p: A4) => R4)
    | ((...p: A5) => R5)
    | ((...p: A6) => R6)
    | ((...p: A7) => R7)
    | ((...p: A8) => R8)
    | ((...p: A9) => R9)
    | ((...p: A10) => R10)
  : never;

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
