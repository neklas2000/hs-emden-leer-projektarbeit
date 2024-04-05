import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';

@Injectable()
class TestResource extends JsonApiConnectorService {
  constructor() {
    super();
  }
}

describe('Service: JsonApiConnectorService', () => {
  let service: JsonApiConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        TestResource,
      ],
    });
    service = TestBed.inject(TestResource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
