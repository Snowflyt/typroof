import type { Actual, IsNegated, Stringify, Validator } from 'typroof/plugin';

type IsFoo<T> = T extends 'foo' ? true : false;

declare module 'typroof/plugin' {
  interface ValidatorRegistry {
    beFoo: BeFooValidator;
  }
}
interface BeFooValidator extends Validator {
  // Define the return type of your validator
  return: IsNegated<this> extends false ?
    IsFoo<Actual<this>> extends true ?
      true
    : `Expect \`${Stringify<Actual<this>>}\` to be \`'foo'\`, but does not`
  : IsFoo<Actual<this>> extends true ? `Expect the type not to be \`'foo'\`, but does`
  : false;
}

export {};
