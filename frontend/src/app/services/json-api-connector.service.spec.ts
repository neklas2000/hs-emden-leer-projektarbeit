import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JsonApiConnectorService } from './json-api-connector.service';

@Injectable()
class TestResource extends JsonApiConnectorService<any> {
  constructor() {
    super();
  }
}

describe('Service: JsonApiConnectorService', () => {
  let service: JsonApiConnectorService<any>;

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

  // it('should parse relationship includes', () => {
  //   expect(parseJsonApiQuery({
  //     includes: ['relationA', 'relationB'],
  //   })).toEqual('?include=relationA,relationB');
  // });

  // it('should parse sparse fieldsets', () => {
  //   expect(parseJsonApiQuery({
  //     sparseFieldsets: {
  //       tableA: ['fieldA', 'fieldB'],
  //       tableB: ['fieldC', 'fieldD'],
  //     },
  //   })).toEqual('?fields[tableA]=fieldA,fieldB&fields[tableB]=fieldC,fieldD');
  // });

  // it('should parse filters', () => {
  //   expect(parseJsonApiQuery({
  //     filters: {
  //       fieldA: null,
  //       fieldB: 15,
  //     },
  //   })).toEqual('?filter[fieldA]=NULL&filter[fieldB]=15');
  // });

  // it('should combine all json api queries', () => {
  //   expect(parseJsonApiQuery({
  //     includes: ['relationA', 'relationB'],
  //     sparseFieldsets: {
  //       tableA: ['fieldA', 'fieldB'],
  //       tableB: ['fieldC', 'fieldD'],
  //     },
  //     filters: {
  //       fieldA: null,
  //       fieldB: 15,
  //     },
  //   })).toEqual('?include=relationA,relationB&fields[tableA]=fieldA,fieldB&fields[tableB]=fieldC,fieldD&filter[fieldA]=NULL&filter[fieldB]=15');
  // });
});
