import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JsonApiConnectorService } from '@Services/json-api-connector.service';
import { of, take, throwError } from 'rxjs';

@Injectable()
class TestResource extends JsonApiConnectorService<any> {
  constructor() {
    super();
  }
}

describe('Service: JsonApiConnectorService', () => {
  let service: JsonApiConnectorService<any>;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        TestResource,
      ],
    });

    service = TestBed.inject(TestResource);
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('create<?>(string, DeepPartial<?>): Observable<?>', () => {
    it('should send a post request and return the data', (done) => {
      spyOn(http, 'post').and.returnValue(of({
        data: {
          id: '123',
        }
      }));

      service.create('', { name: 'test-name' }).pipe(take(1)).subscribe((result) => {
        expect(http.post).toHaveBeenCalledWith('/api/v1', { name: 'test-name' });
        expect(result).toEqual({ id: '123' });

        done();
      });
    });
  });

  describe('createAll<?>(string, ...DeepPartial<?>[]): Observable<?[]>', () => {
    it('should send multiple post requests and return the data', (done) => {
      const httpPostSpy = spyOn(http, 'post').and.returnValues(
        of({
          data: {
            id: '123',
          }
        }),
        of({
          data: {
            id: '124',
          }
        }),
      );

      service.createAll('test', { name: 'test-1' }, { name: 'test-2' })
        .pipe(take(1))
        .subscribe((result) => {
          expect(httpPostSpy).toHaveBeenCalledTimes(2);
          expect(httpPostSpy.calls.argsFor(0)).toEqual([
            '/api/v1/test', { name: 'test-1' }
          ]);
          expect(httpPostSpy.calls.argsFor(1)).toEqual([
            '/api/v1/test', { name: 'test-2' }
          ]);
          expect(result).toEqual([{ id: '123' }, { id: '124' }]);

          done();
        });
    });
  });

  describe('readAll<?>(string?, JsonApiQueries?, <RequestIds | string>?): Observable<?[]>', () => {
    it('should read all data found regarding the queries', (done) => {
      spyOn(http, 'get').and.returnValue(of({
        data: [
          {
            id: '24',
            name: 'test',
            email: null,
            relation: {
              id: '23',
            },
          },
        ],
      }));

      service.readAll(undefined, {
        includes: ['relation'],
        sparseFieldsets: {
          relation: ['id'],
        },
        filters: {
          name: 'test',
          email: null,
        },
      }).pipe(take(1)).subscribe((result) => {
        expect(http.get).toHaveBeenCalledWith('/api/v1?include=relation&fields[relation]=id&filter[name]=test&filter[email]=NULL');
        expect(result).toEqual([
          {
            id: '24',
            name: 'test',
            email: null,
            relation: {
              id: '23',
            },
          },
        ]);

        done();
      });
    });

    it('should read all data found regarding the queries from a subroute', (done) => {
      spyOn(http, 'get').and.returnValue(of({
        data: [
          {
            id: '24',
            name: 'test',
            email: null,
            relation: {
              id: '23',
            },
          },
        ],
      }));

      service.readAll('test', {
        includes: ['relation'],
        sparseFieldsets: {
          relation: ['id'],
        },
        filters: {
          name: 'test',
          email: null,
        },
      }).pipe(take(1)).subscribe((result) => {
        expect(http.get).toHaveBeenCalledWith('/api/v1/test?include=relation&fields[relation]=id&filter[name]=test&filter[email]=NULL');
        expect(result).toEqual([
          {
            id: '24',
            name: 'test',
            email: null,
            relation: {
              id: '23',
            },
          },
        ]);

        done();
      });
    });
  });

  describe('read<?>(ReadParameters?): Observable<?>', () => {
    it('should read a specific resource', (done) => {
      spyOn(http, 'get').and.returnValue(of({
        data: {
          id: '12',
          name: 'test',
        },
      }));

      service.read({
        route: ':id',
        ids: '12',
        query: {},
      }).pipe(take(1)).subscribe((result) => {
        expect(http.get).toHaveBeenCalledWith('/api/v1/12');
        expect(result).toEqual({
          id: '12',
          name: 'test',
        });

        done();
      });
    });

    it('should read a specific resource by multiple ids', (done) => {
      spyOn(http, 'get').and.returnValue(of({
        data: {
          id: '12',
          relationId: '21',
          name: 'test',
        },
      }));

      service.read({
        route: ':idA/test/:idB',
        ids: {
          idA: '12',
          idB: '21',
        },
        query: {},
      }).pipe(take(1)).subscribe((result) => {
        expect(http.get).toHaveBeenCalledWith('/api/v1/12/test/21');
        expect(result).toEqual({
          id: '12',
          relationId: '21',
          name: 'test',
        });

        done();
      });
    });

    it('should throw a not found exception, since the returned data was null', (done) => {
      spyOn(http, 'get').and.returnValue(of({
        data: null,
      }));

      service.read({
        route: ':id',
        ids: '12',
      }).pipe(take(1)).subscribe({
        error: (exception) => {
          expect(http.get).toHaveBeenCalledWith('/api/v1/12');
          expect(exception.code).toEqual('HSEL-404-001');

          done();
        },
      });
    });
  });

  describe('update(string, string | RequestIds, DeepPartial<?>): Observable<boolean>', () => {
    it("should throw an error because the route expected to contain the pattern ':id'", () => {
      spyOn(http, 'patch');

      expect(() => service.update('test', '12', {})).toThrowError(
        'The provided value for ids was of the type "string", so it was expected that the ' +
        'route includes the pattern ":id", but it does not (the route: test).'
      );
      expect(http.patch).not.toHaveBeenCalled();
    });

    it('should return the boolean flag indicating if the update was successful', (done) => {
      spyOn(http, 'patch').and.returnValue(of({
        data: {
          success: true,
        },
      }));

      service.update(':id', '123', { name: 'test' }).pipe(take(1)).subscribe((success) => {
        expect(http.patch).toHaveBeenCalledWith('/api/v1/123', { name: 'test' });
        expect(success).toBeTruthy();

        done();
      });
    });
  });

  describe('delete(string?, <RequestIds | string>?): Observable<boolean>', () => {
    it('should return the boolean flag indicating if the deletion was successful', (done) => {
      spyOn(http, 'delete').and.returnValue(of({
        data: {
          success: true,
        },
      }));

      service.delete(':id', '123').pipe(take(1)).subscribe((success) => {
        expect(http.delete).toHaveBeenCalledWith('/api/v1/123');
        expect(success).toBeTruthy();

        done();
      });
    });

    it('should throw an error because the deletion failed', (done) => {
      spyOn(http, 'delete').and.returnValue(throwError(() => new Error('An error occured')));

      service.delete(':id', '123').pipe(take(1)).subscribe({
        error: (exception) => {
          expect(http.delete).toHaveBeenCalledWith('/api/v1/123');
          expect(exception.message).toEqual('An error occured');

          done();
        },
      });
    });
  });
});
