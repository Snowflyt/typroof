# Typroof

> Test your TypeScript type definitions elegantly

## Installation

### npm

```bash
npm install --save-dev typroof
```

### yarn

```bash
yarn add -D typroof
```

### pnpm

```bash
pnpm add -D typroof
```

## Overview

This tool lets you write tests for your TypeScript type definitions just like what you would do for your runtime code like Jest, Vitest, etc. It provides similar APIs like `test`, `expect`, `describe` in Jest, but for your type definitions.

By default, these test files should end with `.proof.ts` or be placed in a `proof` directory. They will not be really executed, but instead be parsed and statically analyzed against your type definitions. Special constructs such as `expect<Append<'foo', 'bar'>>().toEqual<'foobar'>()` or `expect<Append<'foo', 42>>().toThrow()` will be parsed and analyzed to see if they are valid.

The `typroof` CLI will search for these test files and run static analysis on them. It will then report the results to the console.

```bash
[npx] typroof [path]
```

Use `typroof --help` for usage information.

## Usage

Assume that you write a `string-utils.ts` file with the following type definitions:

```typescript
export type Append<S extends string, Ext extends string> = `${S}${Ext}`;
export type Prepend<S extends string, Start extends string> = `${Start}${S}`;
```

Then you can write a `string-utils.proof.ts` file to test them:

```typescript
import { describe, expect, it, test } from 'typroof';

type Append<S extends string, End extends string> = `${S}${End}`;
type Prepend<S extends string, Start extends string> = `${Start}${S}`;

test('Append', () => {
  expect<Append<'foo', 'bar'>>().toEqual<'foobar'>();
});

describe('Prepend', () => {
  it('should prepend a string to another', () => {
    expect<Prepend<'foo', 'bar'>>().toEqual('foobar');
  });
});
```

You can see that the APIs are very similar to Jest. The `test` function and its alias `it` to create a test case. The `describe` function to create a test suite (group of test cases). The `expect` function to create an assertion. The `toEqual` function to assert that the type is equal to the expected type.

You may notice that we use two different syntaxes for the `toEqual` function. You can either pass the expected type as a type argument, or pass it as a value argument. The former is more concise, but the latter is more readable. You can choose whichever you like. Even `expect` itself can use a value argument instead of a type argument, such as `expect('foobar').toEqual('foobar')`.

Then run `typroof` to test your type definitions:

![Screenshot](./screenshot.png)

The `toEqual` function strictly checks if the type is equal to the expected type. If you want to check if the type is assignable to the expected type, you can use the `toExtend` function:

```typescript
expect<Append<'foo', 'bar'>>().toExtend<string>();
```

## Assertions

### `expect<T>(x?: T).toThrow()`

Expect a pre emitted diagnostic between the start and end of the given type.

### `expect<T>(x?: T).toEqual<U>(y?: U)`

Expect the type to be equal to the given type.

### `expect<T>(x?: T).toBeAny()`

Expect the type to be `any`.

### `expect<T>(x?: T).toBeNever()`

Expect the type to be `never`.

### `expect<T>(x?: T).toBeNull()`

Expect the type to be `null`.

### `expect<T>(x?: T).toBeUndefined()`

Expect the type to be `undefined`.

### `expect<T>(x?: T).toBeNullish()`

Expect the type to be `null`, `undefined` or `null | undefined`.

### `expect<T>(x?: T).toBeBoolean()`

Expect the type to be `true`, `false` or `boolean`.

### `expect<T>(x?: T).toBeTrue()`

Expect the type to be `true`.

### `expect<T>(x?: T).toBeFalse()`

Expect the type to be `false`.

### `expect<T>(x?: T).toExtend<U>(y?: U)`

Expect the type to extend the given type.

### `expect<T>(x?: T).toStrictExtend<U>(y?: U)`

Expect the type to strictly extend the given type (i.e. both types should not be `never` or `any`).

### `expect<T>(x?: T).toCover<U>(y?: U)`

Expect the type to cover the given type (i.e. the given type should extend the type).

### `expect<T>(x?: T).toStrictCover<U>(y?: U)`

Expect the type to strictly cover the given type (i.e. both types should not be `never` or `any`).

## API

You can invoke the `typroof` CLI directly, or use the `typroof` function in your code.

```typescript
import typroof, { formatGroupResult, formatSummary } from 'typroof';

const startedAt = new Date();
const results = typroof();
const finishedAt = new Date();

for (const result of results) {
  console.log(formatGroupResult(result.rootGroupResult));
  console.log();
}
console.log(
  formatSummary({ groups: results.map((r) => r.rootGroupResult), startedAt, finishedAt }),
);
```

## Custom Matchers

You can create custom matchers by using the `registerMatcher` function.

For example, you can create a `toExtendOneOfTwo` matcher to check if the type extends one of the two given types:

```typescript
import chalk from 'chalk';
import { registerMatcher } from 'typroof';

const toExtendOneOfTwo = 'toExtendOneOfTwo';

type ExtendsOneOfTwo<T, U, V> = T extends U ? true : T extends V ? true : false;
type NotExtendsOneOfTwo<T, U, V> = T extends U ? false : T extends V ? false : true;

// Register a matcher at type level.
declare module 'typroof' {
  interface Expect<T> {
    // This mixes `toExtendOneOfTwo` into `expect`, i.e. `expect(...).toExtendOneOfTwo()`.
    toExtendOneOfTwo: <U, V>() => ExtendsOneOfTwo<T, U, V>;
    //                              ^ You can use a specific type as the return type,
    //                                which can be accessed in the matcher function.
  }

  // If you want to mix `toExtendOneOfTwo` into `expect.not`, you can do this:
  interface ExpectNot<T> {
    toExtendOneOfTwo: <U, V>() => NotExtendsOneOfTwo<T, U, V>;
  }
}

// Register the matcher function at runtime.
registerMatcher(toExtendOneOfTwo, (actual, types, returnType, { not }) => {
  // Check whether `actual.type` extends `types[0]` or `types[1]` by the return type of the matcher function,
  // i.e. the `ExtendsOneOfTwo<T, U, V>` or `NotExtendsOneOfTwo<T, U, V>`.
  if (returnType.isLiteral() && returnType.getText() === 'true') return;

  const actualText = chalk.bold(actual.text);
  const expectedType = `one of ${chalk.bold(types.map((t) => t.getText()).join(', '))}`;

  throw `Expect ${actualText} ${not ? 'not ' : ''}to extend ${expectedType}, but `${not ? 'did' : 'did not'}`.`;
});
```

Typroof uses [ts-morph](https://github.com/dsherret/ts-morph) to analyze the type definitions, and all relevant AST nodes are exposed to the matcher function, so you can implement almost any kind of matcher you want.
