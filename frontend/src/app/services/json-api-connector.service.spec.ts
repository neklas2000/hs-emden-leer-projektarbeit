import { TestBed } from '@angular/core/testing';

import { JsonApiConnectorService } from './json-api-connector.service';

describe('JsonApiConnectorService', () => {
  let service: JsonApiConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonApiConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
