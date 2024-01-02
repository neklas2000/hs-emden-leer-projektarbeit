import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Nullable } from '../types/nullable';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  private logo: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);
  logo$!: Observable<Nullable<string>>;

  constructor() {
    this.logo$ = this.logo.asObservable();
  }

  storeLogo(newLogo: string): void {
    this.logo.next(newLogo);
  }
}
