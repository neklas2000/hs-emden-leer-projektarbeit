import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { JsonApiDatastore } from './json-api-datastore.service';

describe('Service: JsonApiDatastore', () => {
  let service: JsonApiDatastore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(JsonApiDatastore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
