import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable, of, take } from 'rxjs';

import { User } from '@Models/user';
import { profileResolver } from '@Resolvers/profile.resolver';
import { ProfileService } from '@Services/profile.service';
import { Nullable } from '@Types';

describe('Resolver: profileResolver', () => {
  const executeResolver: ResolveFn<Observable<Nullable<User>>> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => profileResolver(...resolverParameters));
  let profile: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService, provideHttpClient()],
    });

    profile = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should read the users profile', (done) => {
    spyOn(profile, 'read').and.returnValue(of({
      id: '1',
    }));

    const observable$ = executeResolver({} as any, {} as any) as Observable<User>;

    observable$.pipe(take(1)).subscribe((user) => {
      expect(profile.read).toHaveBeenCalled();
      expect(user).toEqual({
        id: '1',
      } as any);

      done();
    });
  });
});
