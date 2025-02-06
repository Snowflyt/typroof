/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */

import type { Serializer, Type } from './HKT';
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
export interface StringifySerializerRegistry {
  // NOTE: These serializers are in reverse order, since we use `LastOf` to extract the last element
  // each time we iterate over the serializers.

  /* Internationalization */
  'Intl.RelativeTimeFormatConstructor': {
    if: ['equals', typeof Intl.RelativeTimeFormat];
    serializer: 'Intl.RelativeTimeFormatConstructor';
  };
  'Intl.RelativeTimeFormat': {
    if: ['extends', Intl.RelativeTimeFormat];
    serializer: 'Intl.RelativeTimeFormat';
  };
  'Intl.PluralRulesConstructor': {
    if: ['equals', Intl.PluralRulesConstructor];
    serializer: 'Intl.PluralRulesConstructor';
  };
  'Intl.PluralRules': { if: ['extends', Intl.PluralRules]; serializer: 'Intl.PluralRules' };
  'Intl.NumberFormatConstructor': {
    if: ['equals', Intl.NumberFormatConstructor];
    serializer: 'Intl.NumberFormatConstructor';
  };
  'Intl.NumberFormat': { if: ['extends', Intl.NumberFormat]; serializer: 'Intl.NumberFormat' };
  'Intl.LocaleConstructor': {
    if: ['equals', typeof Intl.Locale];
    serializer: 'Intl.LocaleConstructor';
  };
  'Intl.Locale': { if: ['extends', Intl.Locale]; serializer: 'Intl.Locale' };
  'Intl.DisplayNamesConstructor': {
    if: ['equals', typeof Intl.DisplayNames];
    serializer: 'Intl.DisplayNamesConstructor';
  };
  'Intl.DisplayNames': { if: ['extends', Intl.DisplayNames]; serializer: 'Intl.DisplayNames' };
  'Intl.DateTimeFormatConstructor': {
    if: ['equals', Intl.DateTimeFormatConstructor];
    serializer: 'Intl.DateTimeFormatConstructor';
  };
  'Intl.DateTimeFormat': {
    if: ['extends', Intl.DateTimeFormat];
    serializer: 'Intl.DateTimeFormat';
  };
  'Intl.CollatorConstructor': {
    if: ['equals', Intl.CollatorConstructor];
    serializer: 'Intl.CollatorConstructor';
  };
  'Intl.Collator': { if: ['extends', Intl.Collator]; serializer: 'Intl.Collator' };
  Intl: { if: ['equals', typeof Intl]; serializer: 'typeof Intl' };

  /* Reflection */
  ProxyConstructor: { if: ['equals', ProxyConstructor]; serializer: 'ProxyConstructor' };
  Reflect: { if: ['equals', typeof Reflect]; serializer: 'typeof Reflect' };

  /* Indexed collections */
  Int8ArrayConstructor: {
    if: ['equals', Int8ArrayConstructor];
    serializer: 'Int8ArrayConstructor';
  };
  Int8Array: { if: ['extends', Int8Array]; serializer: Int8ArraySerializer };
  Uint8ArrayConstructor: {
    if: ['equals', Uint8ArrayConstructor];
    serializer: 'Uint8ArrayConstructor';
  };
  Uint8Array: { if: ['extends', Uint8Array]; serializer: Uint8ArraySerializer };
  Uint8ClampedArrayConstructor: {
    if: ['equals', Uint8ClampedArrayConstructor];
    serializer: 'Uint8ClampedArrayConstructor';
  };
  Uint8ClampedArray: {
    if: ['extends', Uint8ClampedArray];
    serializer: Uint8ClampedArraySerializer;
  };
  Int16ArrayConstructor: {
    if: ['equals', Int16ArrayConstructor];
    serializer: 'Int16ArrayConstructor';
  };
  Int16Array: { if: ['extends', Int16Array]; serializer: Int16ArraySerializer };
  Uint16ArrayConstructor: {
    if: ['equals', Uint16ArrayConstructor];
    serializer: 'Uint16ArrayConstructor';
  };
  Uint16Array: { if: ['extends', Uint16Array]; serializer: Uint16ArraySerializer };
  Int32ArrayConstructor: {
    if: ['equals', Int32ArrayConstructor];
    serializer: 'Int32ArrayConstructor';
  };
  Int32Array: { if: ['extends', Int32Array]; serializer: Int32ArraySerializer };
  Uint32ArrayConstructor: {
    if: ['equals', Uint32ArrayConstructor];
    serializer: 'Uint32ArrayConstructor';
  };
  Uint32Array: { if: ['extends', Uint32Array]; serializer: Uint32ArraySerializer };
  Float32ArrayConstructor: {
    if: ['equals', Float32ArrayConstructor];
    serializer: 'Float32ArrayConstructor';
  };
  Float32Array: { if: ['extends', Float32Array]; serializer: Float32ArraySerializer };
  Float64ArrayConstructor: {
    if: ['equals', Float64ArrayConstructor];
    serializer: 'Float64ArrayConstructor';
  };
  Float64Array: { if: ['extends', Float64Array]; serializer: Float64ArraySerializer };
  ArrayConstructor: { if: ['equals', ArrayConstructor]; serializer: 'ArrayConstructor' };

  /* Control abstraction objects */
  AsyncGeneratorFunction: {
    if: ['equals', AsyncGeneratorFunction];
    serializer: 'AsyncGeneratorFunction';
  };
  AsyncGenerator: {
    if: ['extends', AsyncGenerator<any, any, any>];
    serializer: AsyncGeneratorSerializer;
  };
  GeneratorFunction: { if: ['equals', GeneratorFunction]; serializer: 'GeneratorFunction' };
  Generator: { if: ['extends', Generator<any, any, any>]; serializer: GeneratorSerializer };
  AsyncIterator: {
    if: ['extends', AsyncIterator<any, any, any>];
    serializer: AsyncIteratorSerializer;
  };
  Iterator: { if: ['extends', Iterator<any, any, any>]; serializer: IteratorSerializer };

  /* Structured data */
  JSON: { if: ['equals', JSON]; serializer: 'JSON' };
  Atomics: { if: ['equals', Atomics]; serializer: 'Atomics' };
  ArrayBufferConstructor: {
    if: ['equals', ArrayBufferConstructor];
    serializer: 'ArrayBufferConstructor';
  };
  ArrayBuffer: { if: ['extends', ArrayBuffer]; serializer: 'ArrayBuffer' };
  SharedArrayBufferConstructor: {
    if: ['equals', SharedArrayBufferConstructor];
    serializer: 'SharedArrayBufferConstructor';
  };
  SharedArrayBuffer: { if: ['extends', SharedArrayBuffer]; serializer: 'SharedArrayBuffer' };
  DataViewConstructor: { if: ['equals', DataViewConstructor]; serializer: 'DataViewConstructor' };
  DataView: { if: ['extends', DataView]; serializer: 'DataView' };

  /* Keyed collections */
  WeakSetConstructor: { if: ['equals', WeakSetConstructor]; serializer: 'WeakSetConstructor' };
  WeakSet: { if: ['extends', WeakSet<any>]; serializer: WeakSetSerializer };
  WeakMapConstructor: { if: ['equals', WeakMapConstructor]; serializer: 'WeakMapConstructor' };
  WeakMap: { if: ['extends', WeakMap<any, any>]; serializer: WeakMapSerializer };
  SetConstructor: { if: ['equals', SetConstructor]; serializer: 'SetConstructor' };
  Set: { if: ['extends', Set<any>]; serializer: SetSerializer };
  MapConstructor: { if: ['equals', MapConstructor]; serializer: 'MapConstructor' };
  Map: { if: ['extends', Map<any, any>]; serializer: MapSerializer };

  /* Text processing */
  RegExpConstructor: { if: ['equals', RegExpConstructor]; serializer: 'RegExpConstructor' };
  RegExp: { if: ['extends', RegExp]; serializer: 'RegExp' };

  /* Numbers and dates */
  DateConstructor: { if: ['equals', DateConstructor]; serializer: 'DateConstructor' };
  Date: { if: ['extends', Date]; serializer: 'Date' };
  Math: { if: ['equals', Math]; serializer: 'Math' };

  /* Error objects */
  // Sadly, the type of some error objects are entirely the same in TypeScript,
  // so `Stringify<TypeError>` will return `'Error'` instead of `'TypeError'`.
  ErrorConstructor: { if: ['equals', ErrorConstructor]; serializer: 'ErrorConstructor' };
  Error: { if: ['equals', Error]; serializer: 'Error' };

  /* Value properties */
  globalThis: { if: ['equals', typeof globalThis]; serializer: 'typeof globalThis' };
}

/* Built-in serializers */

interface IteratorSerializer extends Serializer<Iterator<any, any, any>> {
  return: Type<this> extends Iterator<infer T, infer TReturn, infer TNext> ?
    `Iterator<${Stringify<T>}, ${Stringify<TReturn>}, ${Stringify<TNext>}>`
  : never;
}
interface AsyncIteratorSerializer extends Serializer<AsyncIterator<any, any, any>> {
  return: Type<this> extends AsyncIterator<infer T, infer TReturn, infer TNext> ?
    `AsyncIterator<${Stringify<T>}, ${Stringify<TReturn>}, ${Stringify<TNext>}>`
  : never;
}
interface GeneratorSerializer extends Serializer<Generator<any, any, any>> {
  return: Type<this> extends Generator<infer T, infer TReturn, infer TNext> ?
    `Generator<${Stringify<T>}, ${Stringify<TReturn>}, ${Stringify<TNext>}>`
  : never;
}
interface AsyncGeneratorSerializer extends Serializer<AsyncGenerator<any, any, any>> {
  return: Type<this> extends AsyncGenerator<infer T, infer TReturn, infer TNext> ?
    `AsyncGenerator<${Stringify<T>}, ${Stringify<TReturn>}, ${Stringify<TNext>}>`
  : never;
}

interface MapSerializer extends Serializer<Map<any, any>> {
  return: Type<this> extends Map<infer K, infer V> ? `Map<${Stringify<K>}, ${Stringify<V>}>`
  : never;
}
interface SetSerializer extends Serializer<Set<any>> {
  return: Type<this> extends Set<infer T> ? `Set<${Stringify<T>}>` : never;
}
interface WeakMapSerializer extends Serializer<WeakMap<any, any>> {
  return: Type<this> extends WeakMap<infer K, infer V> ? `WeakMap<${Stringify<K>}, ${Stringify<V>}>`
  : never;
}
interface WeakSetSerializer extends Serializer<WeakSet<any>> {
  return: Type<this> extends WeakSet<infer T> ? `WeakSet<${Stringify<T>}>` : never;
}

interface Int8ArraySerializer extends Serializer<Int8Array> {
  return: Type<this> extends Int8Array<ArrayBufferLike> ? 'Int8Array'
  : Type<this> extends Int8Array<infer B> ? `Int8Array<${Stringify<B>}>`
  : never;
}
interface Uint8ArraySerializer extends Serializer<Uint8Array> {
  return: Type<this> extends Uint8Array<ArrayBufferLike> ? 'Uint8Array'
  : Type<this> extends Uint8Array<infer B> ? `Uint8Array<${Stringify<B>}>`
  : never;
}
interface Uint8ClampedArraySerializer extends Serializer<Uint8ClampedArray> {
  return: Type<this> extends Uint8ClampedArray<ArrayBufferLike> ? 'Uint8ClampedArray'
  : Type<this> extends Uint8ClampedArray<infer B> ? `Uint8ClampedArray<${Stringify<B>}>`
  : never;
}
interface Int16ArraySerializer extends Serializer<Int16Array> {
  return: Type<this> extends Int16Array<ArrayBufferLike> ? 'Int16Array'
  : Type<this> extends Int16Array<infer B> ? `Int16Array<${Stringify<B>}>`
  : never;
}
interface Uint16ArraySerializer extends Serializer<Uint16Array> {
  return: Type<this> extends Uint16Array<ArrayBufferLike> ? 'Uint16Array'
  : Type<this> extends Uint16Array<infer B> ? `Uint16Array<${Stringify<B>}>`
  : never;
}
interface Int32ArraySerializer extends Serializer<Int32Array> {
  return: Type<this> extends Int32Array<ArrayBufferLike> ? 'Int32Array'
  : Type<this> extends Int32Array<infer B> ? `Int32Array<${Stringify<B>}>`
  : never;
}
interface Uint32ArraySerializer extends Serializer<Uint32Array> {
  return: Type<this> extends Uint32Array<ArrayBufferLike> ? 'Uint32Array'
  : Type<this> extends Uint32Array<infer B> ? `Uint32Array<${Stringify<B>}>`
  : never;
}
interface Float32ArraySerializer extends Serializer<Float32Array> {
  return: Type<this> extends Float32Array<ArrayBufferLike> ? 'Float32Array'
  : Type<this> extends Float32Array<infer B> ? `Float32Array<${Stringify<B>}>`
  : never;
}
interface Float64ArraySerializer extends Serializer<Float64Array> {
  return: Type<this> extends Float64Array<ArrayBufferLike> ? 'Float64Array'
  : Type<this> extends Float64Array<infer B> ? `Float64Array<${Stringify<B>}>`
  : never;
}
/* Built-in serializers end */

type GetSerializer<T> = _GetSerializer<T, keyof StringifySerializerRegistry>;
type _GetSerializer<T, K extends keyof StringifySerializerRegistry> =
  (
    [K] extends [LastOf<K>] ?
      _MatchSerializer<T, K> extends true ?
        'serializer' extends keyof StringifySerializerRegistry[K] ?
          StringifySerializerRegistry[K]['serializer']
        : never
      : never
    : _MatchSerializer<T, LastOf<K>> extends true ?
      'serializer' extends keyof StringifySerializerRegistry[LastOf<K>] ?
        StringifySerializerRegistry[LastOf<K>]['serializer']
      : never
    : _GetSerializer<T, Exclude<K, LastOf<K>>>
  ) extends infer R extends Serializer<any> | string ?
    R
  : never;
type _MatchSerializer<T, K extends keyof StringifySerializerRegistry> =
  StringifySerializerRegistry[K] extends { if: readonly ['extends', infer U] } ?
    T extends U ?
      true
    : false
  : StringifySerializerRegistry[K] extends { if: readonly ['equals', infer U] } ?
    Equals<T, U> extends true ?
      true
    : false
  : StringifySerializerRegistry[K] extends { if: infer Predicate } ?
    Predicate & { readonly Args: (_: [T]) => void } extends { readonly return: true } ?
      true
    : false
  : false;
type CallSerializer<S extends Serializer<any> | string, T> =
  S extends string ? S
  : S & { readonly Args: (_: [T]) => void } extends { readonly return: infer R } ? R
  : never;

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
  (
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
          IsNever<GetSerializer<T>> extends false ? CallSerializer<GetSerializer<T>, T>
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
      >
  ) extends (
    // Tell TS that `R` is a string to prevent deep assignability check
    infer R extends string
  ) ?
    R
  : never;

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
