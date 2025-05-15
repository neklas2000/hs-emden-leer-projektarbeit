import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private readonly titleSubject = new BehaviorSubject<string | null>(null);
  title$ = this.titleSubject.asObservable();

  constructor() { }

  update(title: string | null): void {
    this.titleSubject.next(title);
  }

  reset(): void {
    this.titleSubject.next(null);
  }
}
