import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable } from 'rxjs';

import { Project } from '@Models/project';
import { projectEditResolver } from '@Resolvers/project-edit.resolver';
import { ProjectService } from '@Services/project.service';
import { Nullable } from '@Types';

describe('Resolver: projectEditResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<Nullable<Project>>>> =
    (...resolverParameters) => TestBed.runInInjectionContext(
      () => projectEditResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService],
    });
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });
});
