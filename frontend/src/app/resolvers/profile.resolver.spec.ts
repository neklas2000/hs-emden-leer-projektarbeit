import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { profileResolver } from './profile.resolver';
import { Nullable } from '@Types';
import { User } from '@Models/user';
import { ProfileService } from '@Services/profile.service';

describe('profileResolver', () => {
  const executeResolver: ResolveFn<Observable<Nullable<User>>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => profileResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
