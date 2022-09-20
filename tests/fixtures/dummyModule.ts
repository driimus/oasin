export class Base {
  id: number;
}

export class ApiOne extends Base {
  methodOne() {
    return 'methodOne';
  }
}

export class ApiTwo extends Base {
  methodTwo() {
    return 'methodTwo';
  }
}

export class ApiThree extends Base {
  methodThree() {
    return 'methodThree';
  }
}

export class ApiUnrelated {
  unrelatedMethod() {
    return 'unrelatedMethod';
  }
}

export const something = 123;
