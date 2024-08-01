import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { projectDetailsResolver } from './project-details.resolver';
import { Project } from '@Models/project';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';

describe('Resolver: projectDetailsResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Nullable<Project>>>> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => projectDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
