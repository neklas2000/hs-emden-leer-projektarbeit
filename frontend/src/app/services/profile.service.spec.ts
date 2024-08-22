import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ProfileService } from '@Services/profile.service';
import { of, take } from 'rxjs';

describe('Service: ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(ProfileService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCredentials(Credentials): Observable<Nullable<User>>', () => {
    it('should send a request to verify the both credentials', (done) => {
      spyOn(service, 'read').and.returnValue(of(null));

      service.validateCredentials({
        userId: '1',
        email: 'max.mustermann@gmx.de',
        password: '1234',
      }).pipe(take(1)).subscribe((result) => {
        expect(service.read).toHaveBeenCalled();
        expect(result).toBeNull();

        done();
      });
    });

    it('should send a request to only verify the password', (done) => {
      spyOn(service, 'read').and.returnValue(of(null));

      service.validateCredentials({
        userId: '1',
        password: '1234',
      }).pipe(take(1)).subscribe((result) => {
        expect(service.read).toHaveBeenCalled();
        expect(result).toBeNull();

        done();
      });
    });
  });
});
