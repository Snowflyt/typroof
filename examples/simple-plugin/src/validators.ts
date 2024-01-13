type IsFoo<T> = T extends 'foo' ? true : false;

declare module 'typroof' {
  interface Validator<T> {
    beFoo: IsFoo<T>;
  }
}

export {};
