type Constructor<T = {}, Arguments extends unknown[] = any[]> = new (...args: Arguments) => T;

type ArrayEntry<T> = T extends Array<infer U> ? U : never;

type TupleToUnion<T extends unknown[]> = T[number];

type UnionToIntersection<T> = (T extends unknown ? (k: T) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Combines all the API classes from a module which derive from the provided base class.
 */
export function autoMix<T, Base extends Constructor>(
  apiModule: { [ModuleEntry: string]: T },
  baseApi: Base
) {
  return mixApis(
    Object.values(apiModule).filter<Extract<T, Base>>(derivesFromBase(baseApi)),
    baseApi
  );
}

/**
 * Combines a list of API classes with the provided base class.
 */
export function mixApis<T extends Constructor[], Base extends Constructor>(
  mixins: T,
  baseApi: Base
): Constructor<UnionToIntersection<InstanceType<TupleToUnion<T>>>, ConstructorParameters<Base>> {
  const mixed = class extends baseApi {};

  applyMixins(mixed, mixins);

  return mixed;
}

function applyMixins<T extends Constructor[]>(
  derivedCtor: any,
  constructors: T
): asserts derivedCtor is Constructor<UnionToIntersection<InstanceType<ArrayEntry<T>>>> {
  for (const baseCtor of constructors)
    for (const name of Object.getOwnPropertyNames(baseCtor.prototype))
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      );
}

const derivesFromBase =
  <T extends Constructor>(baseClass: T) =>
  <U>(obj: U): obj is Extract<U, T> =>
    Object.prototype.isPrototypeOf.call(Object.prototype, obj as any) &&
    Object.prototype.isPrototypeOf.call(baseClass.prototype, (obj as any).prototype);
