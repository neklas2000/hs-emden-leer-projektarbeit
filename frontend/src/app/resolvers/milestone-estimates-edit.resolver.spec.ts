import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { Observable, of, take } from 'rxjs';

import { ProjectMilestone } from '@Models/project-milestone';
import { milestoneEstimatesEditResolver } from '@Resolvers/milestone-estimates-edit.resolver';
import { NotFoundService } from '@Services/not-found.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { Nullable } from '@Types';

describe('Resolver: milestoneEstimatesEditResolver', () => {
  const executeResolver: ResolveFn<Nullable<Observable<ProjectMilestone[]>>> =
    (...resolverParameters) => TestBed.runInInjectionContext(
      () => milestoneEstimatesEditResolver(...resolverParameters),
    );
  let projectMilestones: ProjectMilestoneService;
  let notFound: NotFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectMilestoneService, NotFoundService, provideHttpClient()],
    });

    projectMilestones = TestBed.inject(ProjectMilestoneService);
    notFound = TestBed.inject(NotFoundService);
  });

  it('should create', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should return null and emit page not found since the id is malformed', () => {
    spyOn(notFound, 'emitNotFound');
    spyOn(projectMilestones, 'readAll');

    const result = executeResolver({
      paramMap: {
        get: () => 'b16d42fe-60a6-WXYZ-84a3-313260320a1e',
      },
    } as any, {} as any);

    expect(notFound.emitNotFound).toHaveBeenCalled();
    expect(projectMilestones.readAll).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return an array of milestones', (done) => {
    spyOn(notFound, 'emitNotFound');
    spyOn(projectMilestones, 'readAll').and.returnValue(of([{
      id: '32',
    }]));

    const observable$ = executeResolver({
      paramMap: {
        get: () => 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
      },
    } as any, {} as any) as Observable<ProjectMilestone[]>;

    observable$.pipe(take(1)).subscribe((result) => {
      expect(notFound.emitNotFound).not.toHaveBeenCalled();
      expect(projectMilestones.readAll).toHaveBeenCalledWith('', {
        filters: {
          'project.id': 'b16d42fe-60a6-4cdc-84a3-313260320a1e',
        },
        includes: ['estimates'],
      });
      expect(result).toEqual([{
        id: '32',
      }] as any[]);

      done();
    });
  });
});
