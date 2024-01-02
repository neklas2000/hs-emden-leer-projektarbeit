import { Injectable } from '@angular/core';

import * as crypto from 'crypto-js';
import { BehaviorSubject, Observable, map, take } from 'rxjs';

import { User } from '../models/user';
import { Nullable } from '../types/nullable';
import { JsonApiDatastore } from './json-api-datastore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Nullable<User>> = new BehaviorSubject<Nullable<User>>({
    id: '223ea86e-a68b-11ee-97c1-0242ac120002',
    matriculationNumber: 7022823,
    firstName: 'Neklas',
    lastName: 'Meyer',
    password: 'fhwer349rf3u4fh39f34',
    phoneNumber: null,
    email: 'neklas.meyer@stud.hs-emden-leer.de',
    projects: [],
  } as any as User);
  user$!: Observable<Nullable<User>>;

  constructor(private readonly jsonApiDatastore: JsonApiDatastore) {
    this.user$ = this.user.asObservable();
  }

  login(matriculationNumber: number, password: string): void {
    const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);
    console.log(matriculationNumber, password, hashedPassword);
    const user$ = this.exists(matriculationNumber);

    user$.pipe(take(1)).subscribe((user) => {
      if (user && user.password === hashedPassword) {
        this.user.next(user);
      } else if (!user) {
        console.error('Either no user or more users than expected were found!');
      } else {
        console.error('Wrong password!');
      }
    });
  }

  logout(): void {
    this.user.next(null);
  }

  exists(matriculationNumber: number): Observable<Nullable<User>> {
    return this.jsonApiDatastore.loadAll<User>(User, {
      filters: { matriculationNumber },
    }).pipe(take(1), map((value) => {
      if (value.length !== 1) return null;

      return value[0];
    }));
  }

  register(
    matriculationNumber: number,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: Nullable<string> = null,
  ): void {
    const user = new User();
    user.matriculationNumber = matriculationNumber;
    user.password = crypto.SHA256(password).toString(crypto.enc.Hex);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phoneNumber;

    const registeredUsers$ = this.jsonApiDatastore.add(User, user);

    registeredUsers$.pipe(take(1)).subscribe((users) => {
      this.user.next(users[0]);
    });
  }
}
