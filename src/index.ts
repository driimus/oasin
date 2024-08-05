type Constructor<T = object, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

type ArrayEntry<T> = T extends Array<infer U> ? U : never;

type TupleToUnion<T extends unknown[]> = T[number];

type UnionToIntersection<T> = (T extends unknown ? (k: T) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

/**
 * Combines all the API classes from a module which derive from the provided base class.
 */
export function mixModuleApis<T, Base extends Constructor>(
  apiModule: { [ModuleEntry: string]: T },
  baseApi: Base,
) {
  return combineMixins(
    Object.values(apiModule).filter<Extract<T, Base>>(derivesFromBase(baseApi)),
    baseApi,
  );
}

export function combineMixins<T extends Constructor[], Base extends Constructor>(
  mixins: T,
  baseCtor: Base,
): Constructor<UnionToIntersection<InstanceType<TupleToUnion<T>>>, ConstructorParameters<Base>> {
  const mixed = class extends baseCtor {};

  applyMixins(mixed, mixins);

  return mixed;
}

function applyMixins<T extends Constructor[]>(
  derivedCtor: Constructor<any>,
  constructors: T,
): asserts derivedCtor is Constructor<UnionToIntersection<InstanceType<ArrayEntry<T>>>> {
  for (const baseCtor of constructors)
    for (const name of Object.getOwnPropertyNames(baseCtor.prototype))
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- `name` is guaranteed to be a property
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!,
      );
}

const derivesFromBase =
  <T extends Constructor>(baseClass: T) =>
  <U>(object: U): object is Extract<U, T> =>
    isObjectCtor(object) &&
    Object.prototype.isPrototypeOf.call(baseClass.prototype, object.prototype);

const isObjectCtor = (object: unknown): object is ObjectConstructor =>
  typeof object === 'function' && Object.prototype.isPrototypeOf.call(Object.prototype, object);
