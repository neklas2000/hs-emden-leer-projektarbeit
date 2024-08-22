import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of, take, throwError } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';
import { SessionStorageService } from '@Services/session-storage.service';

describe('Service: AuthenticationService', () => {
  let service: AuthenticationService;
  let session: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        SessionStorageService,
      ]
    });

    service = TestBed.inject(AuthenticationService);
    session = TestBed.inject(SessionStorageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('register(DeepPartial<User> & { password: string; email: string; }): Observable<true>', () => {
    it('should send a register request and set the resolved data within the session storage', (done) => {
      const createSpy = spyOn(service, 'create').and.returnValue(of({
        user: {
          id: '1',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }));

      service.register({
        password: 'secure password',
        email: 'max.mustermann@gmx.de',
      }).pipe(take(1)).subscribe((result) => {
        expect(createSpy).toHaveBeenCalledWith('register', {
          password: 'secure password',
          email: 'max.mustermann@gmx.de',
        });
        expect(result).toBeTruthy();

        done();
      });
    });
  });

  describe('login(string, string): Observable<true>', () => {
    it('should send a login request and set the resolved data within the session storage', (done) => {
      const createSpy = spyOn(service, 'create').and.returnValue(of({
        user: {
          id: '1',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }));

      service.login('max.mustermann@gmx.de', 'secure password')
        .pipe(take(1))
        .subscribe((result) => {
          expect(createSpy).toHaveBeenCalledWith('login', {
            password: 'secure password',
            email: 'max.mustermann@gmx.de',
          });
          expect(result).toBeTruthy();

          done();
        });
    });
  });

  describe('logout(): Observable<boolean>', () => {
    it('should send a logout request and clear the session storage since logging out was successful', (done) => {
      const createSpy = spyOn(service, 'create').and.returnValue(of({ success: true }));
      const sessionClearSpy = spyOn(session, 'clear');

      service.logout().pipe(take(1)).subscribe((result) => {
        expect(createSpy).toHaveBeenCalledWith('logout', {});
        expect(sessionClearSpy).toHaveBeenCalled();
        expect(result).toBeTruthy();

        done();
      });
    });

    it('should send a logout request and not clear the session storage since logging out was unsuccessful', (done) => {
      const createSpy = spyOn(service, 'create').and.returnValue(of({ success: false }));
      const sessionClearSpy = spyOn(session, 'clear');

      service.logout().pipe(take(1)).subscribe((result) => {
        expect(createSpy).toHaveBeenCalledWith('logout', {});
        expect(sessionClearSpy).not.toHaveBeenCalled();
        expect(result).toBeFalsy();

        done();
      });
    });
  });

  describe('getUser(): Nullable<string>', () => {
    it('should return null, since there is no user stored', () => {
      session.clear();

      expect(service.getUser()).toBeNull();
    });

    it('should return the id of the stored user', () => {
      session.setUser('123');

      expect(service.getUser()).toEqual('123');
    });
  });

  describe('getAccessToken(): Nullable<string>', () => {
    it('should return null, since there is no access token stored', () => {
      session.clear();

      expect(service.getAccessToken()).toBeNull();
    });

    it('should return the stored access token', () => {
      session.setAccessToken('access-token');

      expect(service.getAccessToken()).toEqual('access-token');
    });
  });

  describe('getRefreshToken(): Nullable<string>', () => {
    it('should return null, since there is no refresh token stored', () => {
      session.clear();

      expect(service.getRefreshToken()).toBeNull();
    });

    it('should return the stored refresh token', () => {
      session.setRefreshToken('refresh-token');

      expect(service.getRefreshToken()).toEqual('refresh-token');
    });
  });

  describe('refreshTokens(): Observable<string>', () => {
    it('should throw an error since there is no stored refresh token', (done) => {
      const createSpy = spyOn(service, 'create');
      session.clear();

      service.refreshTokens().pipe(take(1)).subscribe({
        error: (err: Error) => {
          expect(err.message).toMatch(/No refresh token available/);
          expect(createSpy).not.toHaveBeenCalled();

          done();
        },
      });
    });

    it('should send a refresh request and update the session storage', (done) => {
      const createSpy = spyOn(service, 'create').and.returnValue(of({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }));
      session.setRefreshToken('old-refresh-token');

      service.refreshTokens().pipe(take(1)).subscribe((accessToken) => {
        expect(createSpy).toHaveBeenCalledWith('refresh', {});
        expect(accessToken).toEqual('new-access-token');

        done();
      });
    });
  });

  describe('canRefreshTokensWithCookie(): Observable<boolean>', () => {
    it('should try to refresh the tokens with available cookies and succeed', (done) => {
      const createSpy = spyOn(service, 'create').and.returnValue(of({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: '123',
        },
      }));

      service.canRefreshTokensWithCookie().pipe(take(1)).subscribe((success) => {
        expect(createSpy).toHaveBeenCalledWith('refresh', {});
        expect(success).toBeTruthy();

        done();
      });
    });

    it('should try to refresh the tokens with available cookies and not succeed', (done) => {
      const createSpy = spyOn(service, 'create').and.returnValue(
        throwError(() => new Error('Could not refresh the tokens')),
      );

      service.canRefreshTokensWithCookie().pipe(take(1)).subscribe((success) => {
        expect(createSpy).toHaveBeenCalledWith('refresh', {});
        expect(success).toBeFalsy();

        done();
      });
    });
  });

  describe('isAuthenticated(): boolean', () => {
    it('should return true, since the user is authenticated', () => {
      session.setUser('123');

      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false, since the user is not authenticated', () => {
      session.clear();

      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('clear(): void', () => {
    it('should clear the session storage', () => {
      const sessionClearSpy = spyOn(session, 'clear');

      service.clear();

      expect(sessionClearSpy).toHaveBeenCalled();
    });
  });
});
