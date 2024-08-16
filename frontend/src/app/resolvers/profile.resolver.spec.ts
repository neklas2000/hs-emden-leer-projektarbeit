import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { User } from '@Models/user';
import { profileResolver } from '@Resolvers/profile.resolver';
import { ProfileService } from '@Services/profile.service';
import { Nullable } from '@Types';

describe('Resolver: profileResolver', () => {
  const executeResolver: ResolveFn<Observable<Nullable<User>>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => profileResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService],
    });
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });
});
