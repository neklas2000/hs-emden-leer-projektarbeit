import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, take } from 'rxjs';
import { Nullable } from '../types/nullable';
import { User } from '../models/user';
import { JsonApiDatastore } from './json-api-datastore.service';
import * as crypto from 'crypto-js';
import { HttpException } from '../types/http-exception';

type LoginResponse = {
  access_token: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user$!: Observable<Nullable<User>>;

  private user: BehaviorSubject<Nullable<User>> = new BehaviorSubject<Nullable<User>>(null);
  private accessToken: Nullable<string> = null;

  constructor(
    private readonly jsonApiDatastore: JsonApiDatastore,
  ) {
    this.user$ = this.user.asObservable();
  }

  login(email: string, password: string): Observable<boolean | HttpException> {
    const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);

    return this.jsonApiDatastore.POST<LoginResponse>(
      'auth/login',
      {
        email,
        password: hashedPassword,
      }
    ).pipe(
      take(1),
      map((response) => {
        this.accessToken = response.access_token;

        return true;
      }),
      catchError((err, caught) => {
        return of(new HttpException(err));
      })
    );
  }

  logout(): void {
    this.accessToken = null;
    this.user.next(null);
  }

  getAccessToken(): Nullable<string> {
    return this.accessToken;
  }
}
