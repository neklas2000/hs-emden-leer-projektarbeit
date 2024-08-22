import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { UserService } from '@Services/user.service';

describe('Service: UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('search(string, JsonApiQueries?): Observable<User[]>', () => {
    it('should search all users by their firstname', (done) => {
      const expectedUsers = [
        {
          id: '1',
        },
        {
          id: '2',
        },
        {
          id: '3',
        },
      ];

      const httpClientPostSpy = spyOn(service['httpClient'], 'post').and.returnValue(of({
        data: expectedUsers
      }));

      service.search('Max').subscribe((users) => {
        expect(users).toEqual(expectedUsers as any);
        expect(httpClientPostSpy).toHaveBeenCalledWith('/api/v1/users/search', {
          searchTerm: 'Max',
        });

        done();
      });
    });
  });
});
