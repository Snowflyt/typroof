<h1 align="center">Typroof</h1>

TypeScript **type testing** with a fast **CLI** tool and a smooth **WYSIWYG editor experience**.

[![downloads](https://img.shields.io/npm/dm/typroof.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/typroof)
[![version](https://img.shields.io/npm/v/typroof.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/typroof)
[![test](https://img.shields.io/github/actions/workflow/status/Snowflyt/typroof/ci.yml?label=test&style=flat&colorA=000000&colorB=000000)](https://github.com/Snowflyt/typroof/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/typroof.svg?style=flat&colorA=000000&colorB=000000)](https://github.com/Snowflyt/typroof)

https://github.com/user-attachments/assets/53aa8f97-c580-428e-89b2-2d07d1c5680d

## Installation

```shell
npm install --save-dev typroof
```

## Quickstart

### Define your types

Assume that you write a `string-utils.ts` file with the following type definitions:

```typescript
export type Append<S extends string, Ext extends string> = `${S}${Ext}`;
export type Prepend<S extends string, Start extends string> = `${Start}${S}`;

export const append = <S extends string, Ext extends string>(s: S, ext: Ext): Append<S, Ext> =>
  `${s}${ext}`;
```

### Add a type test

Create a `string-utils.proof.ts` file in the same directory to test them:

```typescript
import { describe, equal, error, expect, extend, it, test } from 'typroof';
import { append } from './string-utils';
import type { Append, Prepend } from './string-utils';

test('Append', () => {
  expect<Append<'foo', 'bar'>>().to(equal<'foo'>);
  expect<Append<'foo', 'bar'>>().to(extend<string>);
  expect<Append<'foo', 'bar'>>().not.to(extend<number>);
  expect(append('foo', 'bar')).to(equal('foobar' as const));
});
```

Oops! Seems we have made a mistake, and TypeScript language server is already showing you the error message in your editor:

```typescript
expect<Append<'foo', 'bar'>>().to(equal<'foo'>);
//                                ~~~~~~~~~~~~
//            Argument of type '...' is not assignable to parameter
//         of type '"Expect `'foobar'` to equal `'foo'`, but does not"'
```

This is the **WYSIWYG editor experience** Typroof provides—instant feedback right in your editor.

Let’s ignore this error for now and see what happens when we run the tests.

### Run the CLI

Run `typroof` to test your type definitions:

```shell
npx typroof
```

You’ll see the error clearly reported:

```shell
❯ src/string-utils.proof.ts (1)
  × Append
    ❯ src/string-utils.proof.ts:6:37
      Expect Append<'foo', 'bar'> to equal "foo", but got "foobar".

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  17:50:11
   Duration  2ms
```

Let’s fix the error in the test file:

```diff
- expect<Append<'foo', 'bar'>>().to(equal<'foo'>);
+ expect<Append<'foo', 'bar'>>().to(equal<'foobar'>);
```

Success! You’ve written and verified your first type test with Typroof. 🎉

```shell
✓ src/string-utils.proof.ts (1)
  ✓ Append

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:51:26
   Duration  2ms
```

> [!NOTE]
>
> By default, Typroof does not perform type checking on test files. This allows matchers like `.to(error)` to work properly without requiring manual `@ts-expect-error` comments. If you want to enable type checking on your test files, you can use the `--check` option when running Typroof:
>
> ```shell
> npx typroof --check
> ```

## Usage

After getting started with Typroof, let’s explore its core concepts and patterns in more depth.

### API Overview

Typroof provides a familiar testing API that resembles Jest:

- **`test`/`it`**: Create individual test cases
- **`describe`**: Group related tests together
- **`expect`**: Create an assertion on a type or value
- **`.to(matcher)`**: Apply a matcher to validate the assertion
- **`.not.to(matcher)`**: Negate a matcher expectation

### Assertion Patterns

Typroof offers flexible ways to write assertions:

```typescript
// Testing a type directly (most common for type utilities)
expect<MyType<Input>>().to(equal<Expected>);

// Testing a value’s type (useful for functions)
expect(myFunction('input')).to(equal<ExpectedReturnType>);

// Negating an assertion
expect<MyType>().not.to(beAny);

// Testing for errors
// @ts-expect-error
expect<InvalidType>().to(error);
```

### Matcher Flexibility

Matchers can receive expected types in two ways:

```typescript
// As a type parameter (preferred for testing generic types)
expect<MyType<'input'>>().to(equal<'expected'>);

// As a value parameter (useful for function return types)
const result = computeSomething();
const expected = computeSomethingElse();
expect(result).to(equal(expected));
```

### Composing Tests

```typescript
describe('StringUtils', () => {
  describe('Append', () => {
    it('concatenates two strings', () => {
      expect<Append<'hello', ' world'>>().to(equal<'hello world'>);
    });

    it('returns a string type', () => {
      expect<Append<'a', 'b'>>().to(extend<string>);
    });
  });

  describe('Split', () => {
    it('splits a string into tuple', () => {
      expect<Split<'a-b-c', '-'>>().to(equal<['a', 'b', 'c']>);
    });
  });
});
```

### Testing For Type Errors

Test that invalid types correctly produce errors:

```typescript
describe('NumericUtilities', () => {
  it('rejects non-numeric inputs', () => {
    // @ts-expect-error - string is not assignable to number
    expect<Add<'not-a-number', 5>>().to(error);
  });
});
```

### Running Tests

Run tests with the Typroof CLI:

```shell
npx typroof [optional path]
```

By default, Typroof will find all `.proof.ts` files or files in `proof/` directories and analyze them. To customize which files to test, you can create a `typroof.config.ts` file in the root directory of your project. See [Configuration](#configuration) for more information.

## Matchers

Matchers are the core of Typroof’s assertion system. They let you validate type relationships and characteristics in your tests.

### Matcher Basics

Each matcher can be used with the `expect().to()` or `expect().not.to()` syntax:

```typescript
// Basic matcher usage
expect<MyType>().to(matcherName<OptionalTypeArg>);

// Negated matcher usage
expect<MyType>().not.to(matcherName<OptionalTypeArg>);
```

### Built-in Matchers

Typroof provides two categories of matchers for different testing needs:

#### Equality and Basic Type Matchers

| Matcher            | Description                                            | Example                                                    |
| ------------------ | ------------------------------------------------------ | ---------------------------------------------------------- |
| `equal<T>`         | Checks for exact type equality                         | `expect<'hello'>().to(equal<'hello'>)`                     |
| `error`            | Verifies a type produces a compilation error           | `expect<ConcatString<'foo', 42>>().to(error)`              |
| `beAny`            | Checks if a type is `any`                              | `expect<any>().to(beAny)`                                  |
| `beNever`          | Checks if a type is `never`                            | `expect<never>().to(beNever)`                              |
| `beNull`           | Checks if a type is `null`                             | `expect<null>().to(beNull)`                                |
| `beUndefined`      | Checks if a type is `undefined`                        | `expect<undefined>().to(beUndefined)`                      |
| `beNullish`        | Checks if a type is `null`, `undefined` or their union | <code>expect<null &#124; undefined>().to(beNullish)</code> |
| `beTrue`/`beFalse` | Checks if a type is `true`/`false`                     | `expect<true>().to(beTrue)`                                |
| `matchBoolean`     | Checks if a type is `true`, `false` or `boolean`       | `expect<boolean>().to(matchBoolean)`                       |

#### Type Relationship Matchers

| Matcher           | Description                                   | Example                                     |
| ----------------- | --------------------------------------------- | ------------------------------------------- |
| `extend<T>`       | Checks if a type is assignable to another     | `expect<'hello'>().to(extend<string>)`      |
| `strictExtend<T>` | Like `extend` but stricter with `any`/`never` | `expect<string>().to(strictExtend<string>)` |
| `cover<T>`        | Checks if a type is a supertype of another    | `expect<string>().to(cover<'hello'>)`       |
| `strictCover<T>`  | Like `cover` but stricter with `any`/`never`  | `expect<string>().to(strictCover<'hello'>)` |

### Matcher Examples

Testing type utilities:

```typescript
// Testing a string template utility
type Prefix<T extends string, P extends string> = `${P}${T}`;

test('Prefix type', () => {
  expect<Prefix<'World', 'Hello '>>().to(equal<'Hello World'>);
  expect<Prefix<'file', 'index.'>>().to(extend<string>);
  expect<Prefix<'foo', 'bar'>>().not.to(equal<'foobar'>);
});
```

Testing for compilation errors:

```typescript
// Testing constraint violations
test('NumericId constraints', () => {
  type NumericId<T extends number> = T;

  expect<NumericId<42>>().to(extend<number>);

  // @ts-expect-error - String not assignable to number
  expect<NumericId<'42'>>().to(error);
});
```

### Understanding Special Types

TypeScript’s `any` and `never` types have special behavior in type relationships:

- `any` is both a subtype and supertype of all types.
- `never` is a subtype of all types but has no subtypes.

This can lead to unexpected results in type tests:

```typescript
// Regular extend allows any to be assigned to anything
expect<any>().to(extend<string>); // passes

// strictExtend prevents this
expect<any>().not.to(strictExtend<string>); // passes
```

For more predictable behavior with these types, use `strictExtend` and `strictCover` when testing type relationships involving `any` or `never`.

## Configuration

Typroof can be customized through a configuration file to control which files are tested and how tests are run.

### Configuration File

Create a `typroof.config.ts` file in your project root:

```typescript
import { defineConfig } from 'typroof/config';

export default defineConfig({
  testFiles: '**/*.types.test.ts',
});
```

You can use either `.ts`, `.mts`, `.cts`, `.js`, `.mjs` or `.cjs` as the extension of the config file. The priority is `.ts` > `.mts` > `.cts` > `.js` > `.mjs` > `.cjs`.

### Available Options

| Option             | Type                                | Default                                          | Description                                                                         |
| ------------------ | ----------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `tsConfigFilePath` | `string`                            | `'./tsconfig.json'`                              | Path to the TypeScript configuration file                                           |
| `testFiles`        | <code>string &#124; string[]</code> | `['**/*.proof.{ts,tsx}', 'proof/**/*.{ts,tsx}']` | Glob pattern(s) for test files                                                      |
| `check`            | `boolean`                           | `false`                                          | Enable type checking on test files                                                  |
| `checkFiles`       | <code>string &#124; string[]</code> | Same as `testFiles`                              | Glob pattern(s) for files to check. This option is only used when `check` is `true` |
| `compilerOptions`  | `ts.CompilerOptions`                | `{}`                                             | Additional TypeScript compiler options to override those in tsconfig.json           |
| `plugins`          | `Plugin[]`                          | `[]`                                             | Typroof plugins that extend functionality                                           |

### Import Notice

When creating your configuration file, import from the specific subpath:

```typescript
// ✅ Correct import
import { defineConfig } from 'typroof/config';
```

### CLI Usage

You can run Typroof from the command line:

```shell
# Run in current directory
npx typroof

# Run in specific directory
npx typroof /path/to/project

# Specify test files
npx typroof --files "src/**/*.proof.ts"

# Use custom config file
npx typroof --config ./typroof.config.ts

# Use custom tsconfig.json and enable type checking
npx typroof --check --project ./tsconfig.test.json

# Get help
npx typroof --help
```

Available options:

- `--files, -f`: Glob pattern(s) for test files.
- `--config, -c`: Path to config file.
- `--project, -p`: Path to tsconfig.json file.
- `--check`: Enable type checking on test files.
- `--check-files`: Glob pattern(s) for files to check. This option is only used when `--check` is enabled.
- `--help`: Show help information.
- `--version`: Show version information.

## Programmatic Usage

You can use Typroof programmatically within your own Node.js scripts or tools:

```typescript
import typroof, { formatGroupResult, formatSummary } from 'typroof';

// Run Typroof with default options
const startedAt = new Date();
const results = await typroof();
const finishedAt = new Date();

// Display results
for (const result of results) {
  console.log(formatGroupResult(result.rootGroupResult));
  console.log();
}

// Print summary
console.log(
  formatSummary({ groups: results.map((r) => r.rootGroupResult), startedAt, finishedAt }),
);
```

### API Options

The `typroof()` function accepts the same options available in the configuration file, plus an additional `cwd` option:

```typescript
// Run with custom options
const results = await typroof({
  // Standard config options
  testFiles: ['src/**/*.proof.ts'],
  compilerOptions: { strictNullChecks: true },
  plugins: [],
  // Additional API-only option
  cwd: '/path/to/project', // Custom working directory
});
```

The `cwd` option sets the base directory for:

- Finding the default `tsconfig.json` file (`${cwd}/tsconfig.json`).
- Resolving relative paths in your configuration.

If not provided, `cwd` defaults to `process.cwd()`.

## Plugin API & How It Works

Typroof supports plugins to extend its functionality with custom matchers. The plugin system allows you to:

- Create custom type matchers.
- Share matchers as reusable packages.
- Extend Typroof’s core functionality.

### Creating a Custom Matcher

A matcher in Typroof consists of two parts:

1. **Type validator**: A type-level function that checks relationships at compile time.
2. **Analyzer**: A runtime function that further analyzes types using the TypeScript compiler API, and reports errors in CLI.

Note that many built-in matchers in Typroof are type-level only matchers whose analyzers are only used to report errors, e.g., `equal`, `extend`, `beNever`, etc. While some matchers require runtime analysis in its analyzer, e.g., `error`, which checks if a type emits an error with TypeScript compiler API.

Here’s a simple custom matcher example (a type-level only matcher):

```typescript
import { match } from 'typroof/plugin';
import type { Actual, Expected, Validator } from 'typroof/plugin';

// 1. Create and export the matcher
export const startsWith = <U extends string>(prefix?: U) => match<'startsWith', U>();

// 2. Define the validator type
declare module 'typroof/plugin' {
  interface ValidatorRegistry {
    startsWith: StartsWithValidator;
  }
}
type Cast<T, U> = T extends U ? T : U;
// Use a type-level function (i.e. HKT) to define a type-level validator
interface StartsWithValidator extends Validator {
  // Return `true` or `false` to indicate whether the assertion passed or not
  return: Actual<this> extends `${Cast<Expected<this>, string>}${string}` ? true : false;
}

// 3. Create a plugin to register the analyzer
import type { Plugin } from 'typroof/plugin';

export const startsWith = (): Plugin => ({
  name: 'typroof-plugin-starts-with',
  analyzers: {
    // `actual` and `expected` are the types passed to the matcher (T and U).
    startsWith: (actual, expected, { not, typeChecker }) => {
      // NOTE: This analyzer is only called when the type-level validation fails
      // We use TypeScript compiler API to get the text of the type:
      const actualType = typeChecker.typeToString(actual.type);
      const expectedType = typeChecker.typeToString(expected);
      // Throw a string to report the error
      throw `Expected ${actual.text} ${not ? 'not ' : ''}to start with "${expectedType}", but got "${actualType}"`;
    },
  },
});

// 4. Use the plugin in your config
// typroof.config.ts
import { defineConfig } from 'typroof/config';

export default defineConfig({
  plugins: [startsWith()],
});
```

`Validator`s in Typroof are type-level functions (HKTs) compatible with the [hkt-core](https://github.com/Snowflyt/hkt-core) V1 standard, see [its documentation](https://github.com/Snowflyt/hkt-core) for more information.

### Deep Dive: Custom Error Messages for Validators

In the previous example, Typroof already automatically generates a compile-time error message if the assertion fails:

```typescript
expect<'foobar'>().to(startsWith<'bar'>);
//                    ~~~~~~~~~~~~~~~~~
//    Argument of type '...' is not assignable to parameter
//   of type "Validation failed: startsWith<'foobar', 'bar'>"
```

However, it’s not very readable, compared to Typroof’s built-in matchers:

```typescript
expect<Append<'foo', 'bar'>>().to(equal<'foo'>);
//                                ~~~~~~~~~~~~
//            Argument of type '...' is not assignable to parameter
//          of type "Expect `'foobar'` to equal `'foo'`, but does not"
```

The magic behind this is that the `equal` matcher’s validator returns a string type instead of a boolean type if the assertion fails, which is used as the error message.

Let’s rewrite the `startsWith` matcher to return a string type as the error message:

```typescript
import type { Actual, Expected, IsNegated, Stringify, Validator } from 'typroof/plugin';

declare module 'typroof/plugin' {
  interface ValidatorRegistry {
    startsWith: StartsWithValidator;
  }
}

interface StartsWithValidator extends Validator {
  // `IsNegated<this>` is `true` if `.not` is used, otherwise `false`.
  return: IsNegated<this> extends false ?
    // If `.not` is not used
    Actual<this> extends `${Cast<Expected<this>, string>}${string}` ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to start with \`${Stringify<Expected<this>>}\`, but does not`
  : // If `.not` is used
  Actual<this> extends `${Cast<Expected<this>, string>}${string}` ? false
  : `Expect the type not to start with \`${Stringify<Expected<this>>}\`, but does`;
}
```

The exported `Stringify` utility type is used to convert a type to a literal string type, which is used as the error message. The implementation of `Stringify` is quite complex, and it is recommended to use it instead of implementing your own.

> [!TIP]
>
> `Stringify` supports custom serializers. Say you have a custom type `interface Response<T> { code: number; data: T }`. Instead of receiving `"{ code: number; data: string }"` as the result of `Stringify<Response<string>>`, you might prefer the more concise `"Response<string>"`. You can achieve this by adding a custom serializer to `Stringify` via the [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) syntax:
>
> ```typescript
> import type { Serializer, Stringify, Type } from 'typroof/plugin';
>
> declare module 'typroof/plugin' {
>   interface StringifySerializerRegistry {
>     Response: { if: ['extends', Response<unknown>]; serializer: ResponseSerializer };
>   }
> }
> interface ResponseSerializer extends Serializer<Response<unknown>> {
>   return: `Response<${Type<this>['data']}>`;
> }
>
> type TestResult = Stringify<Response<string>>;
> //   ^?: "Response<string>"
> ```
>
> Similar to `Validator`s, `Serializer`s are also type-level function but return a string type. The `Type<this>` utility type is used to get the type passed to the current serializer. Except for the `serializer` property, you also have to add a `if` property as a predicate to determine whether the serializer should be used. Valid forms of the `if` property are:
>
> - `['extends', T]`: The type must extend `T`.
> - `['equals', T]`: The type must be exactly equal to `T`.
> - A custom type-level function (HKT) that returns a boolean type. See the documentation of [hkt-core](https://github.com/Snowflyt/hkt-core) for more information.
>
> Custom serializers also boost `Stringify` utility’s speed in computing results, which can prevent Typroof from slowing down or crashing when handling complex types.

### Deep Dive: Advanced Example - `error` Matcher

Up to now, we have seen how to create a type-level only matcher. But what if we want to create a matcher that requires runtime analysis?

`error` matcher checks if a type emits an error with TypeScript compiler API. It is a good example to show how to create a matcher that requires runtime analysis.

Let’s take a look at how `error` is implemented:

```typescript
import { match } from 'typroof/plugin';

import type { ToAnalyze } from 'typroof/plugin';

export const error = match<'error'>();

declare module 'typroof/plugin' {
  interface ValidatorRegistry {
    error: ErrorValidator;
  }
}
interface ErrorValidator {
  return: ToAnalyze<never>;
}

export const errorPlugin = (): Plugin => ({
  name: 'typroof-plugin-error',
  analyzers: {
    error: (actual, _expected, { diagnostics, not, sourceFile, statement }) => {
      // Check if a diagnostic error exists for this node
      const diagnostic = diagnostics.find((diagnostic) => {
        const start = diagnostic.start;
        if (start === undefined) return false;

        const length = diagnostic.length;
        if (length === undefined) return false;

        const end = start + length;
        const nodeStart = actual.node.getStart(sourceFile);
        const nodeEnd = actual.node.getEnd();

        return start >= nodeStart && end <= nodeEnd;
      });

      // Find @ts-expect-error comments that apply to this expression
      const findTSExpectError = () => {
        const sourceText = sourceFile.text;

        // 1. Check for leading comments directly before the statement
        const leadingComments =
          ts.getLeadingCommentRanges(sourceText, statement.getFullStart()) || [];

        // 2. Find any internal comments within the statement’s full text range
        // This helps with multi-line expressions that have inline comments
        const statementStart = statement.getFullStart();
        const statementEnd = statement.getEnd();
        const statementText = sourceText.substring(statementStart, statementEnd);

        // Track all potential comment positions
        const commentPositions: { start: number; end: number }[] = [
          ...leadingComments.map((c) => ({ start: c.pos, end: c.end })),
        ];

        // Scan the statement for possible comment starts
        let pos = 0;
        while (pos < statementText.length) {
          // Look for // comments
          if (statementText.substring(pos, pos + 2) === '//') {
            const startPos = statementStart + pos;
            let endPos = statementText.indexOf('\n', pos);
            if (endPos === -1) endPos = statementText.length;
            commentPositions.push({
              start: startPos,
              end: statementStart + endPos,
            });
            pos = endPos + 1;
            continue;
          }

          // Look for /* */ comments
          if (statementText.substring(pos, pos + 2) === '/*') {
            const startPos = statementStart + pos;
            const endPos = statementText.indexOf('*/', pos);
            if (endPos !== -1) {
              commentPositions.push({
                start: startPos,
                end: statementStart + endPos + 2,
              });
              pos = endPos + 2;
              continue;
            }
          }

          pos++;
        }

        // Check all comment positions for @ts-expect-error
        for (const { end, start } of commentPositions) {
          const commentText = sourceText.substring(start, end);
          if (commentText.includes('@ts-expect-error')) {
            // Ensure this @ts-expect-error is not already used by checking
            // if there’s a diagnostic that starts at this exact position
            const isUnused = !diagnostics.some(
              (d) => d.start === start && d.code === 2578, // TypeScript’s code for @ts-expect-error
            );
            if (isUnused) return true;
          }
        }

        return false;
      };

      // Check if error is triggered either by diagnostic or @ts-expect-error
      const triggeredError = !!diagnostic || findTSExpectError();

      if (not ? triggeredError : !triggeredError) {
        const actualText = bold(actual.text);
        throw (
          `Expect ${actualText} ${not ? 'not ' : ''}to trigger error, ` +
          `but ${not ? 'did' : 'did not'}.`
        );
      }
    },
  },
});
```

The `error` matcher returns `ToAnalyze<never>` as the return type of its validator, which means it requires runtime analysis. In the `error` example, the type-level validation step is omitted, so we simply pass `ToAnalyze<never>`. However, if you want to create a matcher that requires both type-level validation and runtime analysis, you can return `ToAnalyze<ValidatorReturnType>` as the return type of your validator—the validation result type can be accessed via `validationResult` in the 3rd argument of the analyzer.

You can still return booleans or strings as the return type of your validator in combination with `ToAnalyze<ValidatorReturnType>`, where the boolean or string indicates an early exit of the type-level validation step, and `validationResult` will be `undefined` in the analyzer if `false` or string is returned from the validator.

### Publishing a Plugin

If you want to publish your plugin as a library, it is recommended to export the factory function to create the plugin object as the default export, and export the matchers as named exports:

```typescript
// In your `index.ts`
import { match } from 'typroof/plugin';

import type { Plugin } from 'typroof/plugin';

declare module 'typroof/plugin' {
  interface ValidatorRegistry {
    beFoo: /* ... */;
  }
}

const foo = (): Plugin => ({
  /* ... */
});
export default foo;

/**
 * [Matcher] Expect the type to be `"foo"`.
 */
export const beFoo = match<'beFoo'>();
```

Then your users can use your plugin like this:

```typescript
// In their `typroof.config.ts`
import foo from 'typroof-plugin-example';

export default defineConfig({
  plugins: [foo()],
});

// And somewhere in their test files
import { beFoo } from 'typroof-plugin-example';

test('foo', () => {
  expect<'foo'>().to(beFoo);
});
```

You can try a live demo of creating a plugin [here](https://githubbox.com/Snowflyt/typroof/tree/main/examples/simple-plugin).
