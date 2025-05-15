import { BehaviorSubject as BehaviorSubjectBase } from 'rxjs';

export class BehaviorSubject<T> extends BehaviorSubjectBase<T> {
  private readonly initialValue: T;

  constructor(initialValue: T) {
    super(initialValue);

    this.initialValue = initialValue;
  }

  reset(): void {
    this.next(this.initialValue);
  }
}
