import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { layoutLogoResolver } from './layout-logo.resolver';

describe('layoutLogoResolver', () => {
  const executeResolver: ResolveFn<Observable<string>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => layoutLogoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
