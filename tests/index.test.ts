import 'jest-extended';

import { FancySet } from 'fancy-set';

import { combineMixins, mixModuleApis } from '../src';

class Base {}
class A extends Base {
  methodA() {
    return 'methodA';
  }
}
class B extends Base {
  methodB() {
    return 'methodB';
  }
}

describe('combineMixins', () => {
  it('should return a combined prototype', () => {
    const Mixed = combineMixins([A, B], Base);

    expect(new Mixed().methodA()).toStrictEqual(new A().methodA());
    expect(new Mixed().methodB()).toStrictEqual(new B().methodB());
  });

  it('should not mutate inputs', () => {
    combineMixins([A, B], Base);

    expect(A.prototype).not.toHaveProperty('methodB');
    expect(B.prototype).not.toHaveProperty('methodA');
  });
});

describe('mixModuleApis', () => {
  it('should combine every class derived from the expected base', async () => {
    const PetStoreAPIs = await import('./fixtures/petStoreClient');
    const { BaseAPI, PetApi, StoreApi, UserApi, BlobApiResponse } = PetStoreAPIs;

    const Mixed = mixModuleApis(PetStoreAPIs, BaseAPI);

    const mixedPropertyNames = new FancySet(Object.getOwnPropertyNames(Mixed.prototype));
    const unexpectedPropertyNames = new FancySet(
      Object.getOwnPropertyNames(BlobApiResponse.prototype)
    );

    const expectedPropertyNames = new FancySet(
      [
        Object.getOwnPropertyNames(PetApi.prototype),
        Object.getOwnPropertyNames(StoreApi.prototype),
        Object.getOwnPropertyNames(UserApi.prototype),
      ].flat()
    );

    expect([...mixedPropertyNames.intersection(unexpectedPropertyNames)]).toStrictEqual([
      'constructor',
    ]);
    expect([...mixedPropertyNames]).toIncludeSameMembers([...expectedPropertyNames]);
  });
});
