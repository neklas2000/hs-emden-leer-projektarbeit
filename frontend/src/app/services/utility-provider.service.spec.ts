import { TestBed } from '@angular/core/testing';

import { blobToDataURL } from 'blob-util';

import { UtilityProviderService } from '@Services/utility-provider.service';
import { take } from 'rxjs';

describe('Service: UtilityProviderService', () => {
  let service: UtilityProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityProviderService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get blobToDataURL()', () => {
    it('should return the function from the library', () => {
      expect(service.blobToDataURL).toBe(blobToDataURL);
    });
  });

  describe('get toBase64(): (Blob) => Observable<string>', () => {
    it('should successfully create a base64 encoded string', (done) => {
      const blobToDataURLSpy = jasmine.createSpy().and.resolveTo('base64 encoded string');
      spyOnProperty(service, 'blobToDataURL', 'get').and.returnValue(blobToDataURLSpy);

      service.toBase64(new Blob()).pipe(take(1)).subscribe((result) => {
        expect(blobToDataURLSpy).toHaveBeenCalled();
        expect(result).toEqual('base64 encoded string');

        done();
      });
    });

    it('should throw an error while creating a base64 encoded string', (done) => {
      const blobToDataURLSpy = jasmine.createSpy().and.rejectWith(
        'An error occurred, while creating a base64 encoded string',
      );
      spyOnProperty(service, 'blobToDataURL', 'get').and.returnValue(blobToDataURLSpy);

      service.toBase64(new Blob()).pipe(take(1)).subscribe({
        error: (err) => {
          expect(blobToDataURLSpy).toHaveBeenCalled();
          expect(err).toEqual('An error occurred, while creating a base64 encoded string');

          done();
        },
      });
    });
  });
});
