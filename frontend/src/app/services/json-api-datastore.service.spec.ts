import { TestBed } from '@angular/core/testing';

import { JsonApiDatastore } from './json-api-datastore.service';

describe('JsonApiDatastore', () => {
  let service: JsonApiDatastore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonApiDatastore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
