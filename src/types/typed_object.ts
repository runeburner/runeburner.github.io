export type Typed<T, V> = {
  __type: T;
} & V;
