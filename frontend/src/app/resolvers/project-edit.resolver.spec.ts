import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { projectEditResolver } from './project-edit.resolver';
import { Nullable } from '@Types';

describe('Resolver: projectEditResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Project>>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => projectEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
