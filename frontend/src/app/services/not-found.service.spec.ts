import { TestBed } from '@angular/core/testing';

import { NotFoundService } from '@Services/not-found.service';
import { take, toArray } from 'rxjs';

describe('Service: NotFoundService', () => {
  let service: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotFoundService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('emitNotFound(): void', () => {
    it('should emit the page not found signal', (done) => {
      service.pageNotFound$.pipe(take(2), toArray()).subscribe((pageNotFounds) => {
        expect(pageNotFounds.length).toBe(2);
        expect(pageNotFounds[0]).toBeFalsy();
        expect(pageNotFounds[1]).toBeTruthy();

        done();
      });

      service.emitNotFound();
    });
  })
});
