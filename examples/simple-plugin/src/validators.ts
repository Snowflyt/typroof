import type { Stringify } from 'typroof';

type IsFoo<T> = T extends 'foo' ? true : false;

declare module 'typroof' {
  interface Validator<T, U, Not> {
    beFoo: Not extends false ?
      IsFoo<T> extends true ?
        true
      : `Expect \`${Stringify<T>}\` to be \`'foo'\`, but does not`
    : IsFoo<T> extends false ? false
    : `Expect the type not to be \`'foo'\`, but does`;
  }
}

export {};
