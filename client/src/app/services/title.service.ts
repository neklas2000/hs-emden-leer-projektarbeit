import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

type TitleData = {
  title: string;
  subtitle: string | null;
};
type TitleDataInput = Pick<TitleData, 'title'> & Partial<Pick<TitleData, 'subtitle'>>;

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private readonly titleSubject = new BehaviorSubject<TitleData | null>(null);
  title$ = this.titleSubject.asObservable();

  constructor() { }

  update(titleData: TitleDataInput | null): void {
    if (!titleData) {
      this.titleSubject.next(null);
    } else {
      this.titleSubject.next({
        title: titleData.title,
        subtitle: titleData?.subtitle ?? null,
      });
    }
  }

  reset(): void {
    this.titleSubject.next(null);
  }
}
