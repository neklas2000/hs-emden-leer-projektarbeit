import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotFoundService {
  pageNotFound$!: Observable<boolean>;
  private pageNotFoundSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.pageNotFound$ = this.pageNotFoundSubject.asObservable();
  }

  emitNotFound(): void {
    this.pageNotFoundSubject.next(true);
  }
}
