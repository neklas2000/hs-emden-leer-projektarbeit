import { TestBed } from '@angular/core/testing';

import { SessionStorageService } from '@Services/session-storage.service';
import { WindowProviderService } from '@Services/window-provider.service';

describe('Service: SessionStorageService', () => {
  let service: SessionStorageService;
  let sessionStorageClearSpy = jasmine.createSpy('windowSessionStorageClear');
  let sessionStorageSetItemSpy = jasmine.createSpy('windowSessionStorageSetItem');
  let sessionStorageGetItemSpy = jasmine.createSpy('windowSessionStorageGetItem');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: WindowProviderService,
        useValue: {
          getWindow: () => ({
            sessionStorage: {
              clear: sessionStorageClearSpy,
              setItem: sessionStorageSetItemSpy,
              getItem: sessionStorageGetItemSpy,
            },
          }),
        },
      }]
    });

    service = TestBed.inject(SessionStorageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('clear(): void', () => {
    it("should clear the window's setting storage", () => {
      service.clear();

      expect(sessionStorageClearSpy).toHaveBeenCalled();
    });
  });

  describe('setUser(string): void', () => {
    it("should set the user in the window's setting storage", () => {
      service.setUser('123');

      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('auth-user', '123');
    });
  });

  describe('getUser(): Nullable<string>', () => {
    it("should get the user from the window's setting storage", () => {
      sessionStorageGetItemSpy.and.returnValue('123');

      const user = service.getUser();

      expect(sessionStorageGetItemSpy).toHaveBeenCalledWith('auth-user');
      expect(user).toEqual('123');
    });
  });

  describe('setAccessToken(string): void', () => {
    it("should set the access token in the window's setting storage", () => {
      service.setAccessToken('access-token');

      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('auth-access-token', 'access-token');
    });
  });

  describe('getAccessToken(): Nullable<string>', () => {
    it("should set the access token in the window's setting storage", () => {
      sessionStorageGetItemSpy.and.returnValue('access-token');

      const result = service.getAccessToken();

      expect(sessionStorageGetItemSpy).toHaveBeenCalledWith('auth-access-token');
      expect(result).toEqual('access-token');
    });
  });

  describe('setRefreshToken(string): void', () => {
    it("should set the refresh token in the window's setting storage", () => {
      service.setRefreshToken('refresh-token');

      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('auth-refresh-token', 'refresh-token');
    });
  });

  describe('getRefreshToken(): Nullable<string>', () => {
    it("should set the access token in the window's setting storage", () => {
      sessionStorageGetItemSpy.and.returnValue('refresh-token');

      const result = service.getRefreshToken();

      expect(sessionStorageGetItemSpy).toHaveBeenCalledWith('auth-refresh-token');
      expect(result).toEqual('refresh-token');
    });
  });
});
