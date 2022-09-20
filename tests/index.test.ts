import { autoMix, mixApis } from '../src';
import 'jest-extended';
import { FancySet } from 'fancy-set';

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

describe('mixApis', () => {
  it('should return a combined prototype', () => {
    const Mixed = mixApis([A, B], Base);

    expect(new Mixed().methodA()).toStrictEqual(new A().methodA());
    expect(new Mixed().methodB()).toStrictEqual(new B().methodB());
  });

  it('should not mutate inputs', () => {
    mixApis([A, B], Base);

    expect(A.prototype).not.toHaveProperty('methodB');
    expect(B.prototype).not.toHaveProperty('methodA');
  });
});

describe('autoMix', () => {
  it('should combine every class derived from the expected base', async () => {
    const DummyModule = await import('./fixtures');

    const Mixed = autoMix(DummyModule, DummyModule.Base);

    const mixedPropertyNames = new FancySet(
      Object.getOwnPropertyNames(Mixed.prototype)
    );
    const unexpectedPropertyNames = new FancySet(
      Object.getOwnPropertyNames(DummyModule.ApiUnrelated.prototype)
    );

    const expectedPropertyNames = new FancySet(
      [
        Object.getOwnPropertyNames(DummyModule.ApiOne.prototype),
        Object.getOwnPropertyNames(DummyModule.ApiTwo.prototype),
        Object.getOwnPropertyNames(DummyModule.ApiThree.prototype),
      ].flat()
    );

    expect([
      ...mixedPropertyNames.intersection(unexpectedPropertyNames),
    ]).toStrictEqual(['constructor']);
    expect([...mixedPropertyNames]).toIncludeSameMembers([
      ...expectedPropertyNames,
    ]);
  });
});
