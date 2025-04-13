import { Observable } from 'rxjs';

import { promiseToObervable } from './promise-to-obervable';

describe('Util: promiseToObervable', () => {
  it('should turn a promise into an observable', () => {
    const promise$ = Promise.resolve();

    const observable$ = promiseToObervable(promise$);

    expect(promise$).toBeInstanceOf(Promise);
    expect(observable$).toBeInstanceOf(Observable);
  });
});
