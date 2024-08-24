import { provideHttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import {
  InviteProjectMemberComponent,
} from '@Components/dialog/invite-project-member/invite-project-member.component';
import {
  MilestoneTrendAnalysisChartComponent,
} from '@Components/milestone-trend-analysis-chart/milestone-trend-analysis-chart.component';
import {
  ProjectDetailsComponent,
} from '@Components/user/project-details/project-details.component';
import { ProjectRole } from '@Models/project-member';
import { ProjectMilestone } from '@Models/project-milestone';
import { AuthenticationService } from '@Services/authentication.service';
import { DialogService } from '@Services/dialog.service';
import { ProjectService } from '@Services/project.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';

describe('Component: ProjectDetailsComponent', () => {
  let component: ProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectDetailsComponent>;
  let dialog: DialogService;
  let snackbar: SnackbarService;
  let projectMembers: ProjectMemberService;
  let projectMilestones: ProjectMilestoneService;
  let projects: ProjectService;
  let router: Router;

  @Component({
    selector: 'hsel-milestone-trend-analysis-chart',
    template: '',
    standalone: true,
  })
  class MilestoneTrendAnalysisChartComponentStub {
    @Input() startDate!: string;
    @Input() endDate: Nullable<string> = null;
    @Input() interval: number = 7;
    @Input() milestones: ProjectMilestone[] = [];
    @Input() reportDates: string[] = [];

    refresh() {
      return;
    }
  }

  beforeEach(async () => {
    TestBed.overrideComponent(ProjectDetailsComponent, {
      add: {
        imports: [MilestoneTrendAnalysisChartComponentStub],
      },
      remove: {
        imports: [MilestoneTrendAnalysisChartComponent],
      },
    })
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              project: {
                id: '12',
                name: 'Test',
                type: null,
                officialStart: '2024-01-01',
                officialEnd: null,
                reportInterval: 7,
                owner: {
                  id: '1',
                  email: 'max.mustermann@gmx.de',
                  phoneNumber: null,
                  academicTitle: null,
                  firstName: 'Max',
                  lastName: 'Mustermann',
                },
                members: [{
                  id: '2',
                  role: ProjectRole.Contributor,
                  user: {
                    id: '21',
                  },
                }, {
                  id: '6',
                  role: ProjectRole.Viewer,
                  user: {
                    id: '28',
                  },
                }],
                reports: [{
                  id: '123',
                  sequenceNumber: 1,
                  reportDate: '2024-01-01',
                  deliverables: 'These are our fantastic deliverables',
                  hazards: 'These are our hazards',
                  objectives: 'These are our objectives for the next week',
                  other: null,
                }, {
                  id: '128',
                  sequenceNumber: 2,
                  reportDate: '2024-01-08',
                  deliverables: 'These are some more fantastic deliverables',
                  hazards: 'These are some more hazards',
                  objectives: 'These are some more objectives for the next week',
                  other: null,
                }],
                milestones: [{
                  id: '264',
                }, {
                  id: '265',
                }, {
                  id: '266',
                }],
              },
            }),
          },
        },
        DialogService,
        ProjectMilestoneService,
        ProjectMemberService,
        SnackbarService,
        AuthenticationService,
        ProjectService,
        provideHttpClient(),
        Router,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsComponent);
    dialog = TestBed.inject(DialogService);
    snackbar = TestBed.inject(SnackbarService);
    projectMembers = TestBed.inject(ProjectMemberService);
    projectMilestones = TestBed.inject(ProjectMilestoneService);
    projects = TestBed.inject(ProjectService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inviteStudent(): void', () => {
    it('should open the invitation dialog and cancel it', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'create');

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(projectMembers.create).not.toHaveBeenCalled();
    });

    it('should open the invitation dialog and return the user, who is already the owner', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ user: { id: '1' } }) } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(projectMembers, 'create');

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith('Sie können sich nicht selber einladen');
      expect(projectMembers.create).not.toHaveBeenCalled();
    });

    it('should open the invitation dialog and return an user, but should throw an exception while creating the project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '420' },
        role: ProjectRole.Viewer,
      })} as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-091' }});
      spyOn(projectMembers, 'create').and.returnValue(throwError(() => exception));

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(projectMembers.create).toHaveBeenCalledWith('', {
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      } as any);
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should open the invitation dialog and return an user as a companion', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '420' },
        role: ProjectRole.Viewer,
      })} as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'create').and.returnValue(of({
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      }));

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(projectMembers.create).toHaveBeenCalledWith('', {
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith('Mitglied erfolgreich hinzugefügt');
      expect(component.viewers.length).toBe(2);
      expect(component.contributors.length).toBe(1);
      expect(component.viewers).toContain({
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      } as any);
    });

    it('should open the invitation dialog and return an user as a student', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '420' },
        role: ProjectRole.Contributor,
      })} as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'create').and.returnValue(of({
        user: { id: '420' },
        role: ProjectRole.Contributor,
        project: { id: '12' },
      }));

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(projectMembers.create).toHaveBeenCalledWith('', {
        user: { id: '420' },
        role: ProjectRole.Contributor,
        project: { id: '12' },
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith('Mitglied erfolgreich hinzugefügt');
      expect(component.viewers.length).toBe(1);
      expect(component.contributors.length).toBe(2);
      expect(component.contributors).toContain({
        user: { id: '420' },
        role: ProjectRole.Contributor,
        project: { id: '12' },
      } as any);
    });
  });

  describe('inviteCompanion(): void', () => {
    it('should open the invitation dialog and cancel it', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'create');

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(projectMembers.create).not.toHaveBeenCalled();
    });

    it('should open the invitation dialog and return the user, who is already the owner', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ user: { id: '1' } }) } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(projectMembers, 'create');

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith('Sie können sich nicht selber einladen');
      expect(projectMembers.create).not.toHaveBeenCalled();
    });

    it('should open the invitation dialog and return an user, but should throw an exception while creating the project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '420' },
        role: ProjectRole.Viewer,
      })} as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-094' }});
      spyOn(projectMembers, 'create').and.returnValue(throwError(() => exception));

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(projectMembers.create).toHaveBeenCalledWith('', {
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      } as any);
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should open the invitation dialog and return an user as a companion', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '420' },
        role: ProjectRole.Viewer,
      })} as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'create').and.returnValue(of({
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      }));

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(projectMembers.create).toHaveBeenCalledWith('', {
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith('Mitglied erfolgreich hinzugefügt');
      expect(component.viewers.length).toBe(2);
      expect(component.contributors.length).toBe(1);
      expect(component.viewers).toContain({
        user: { id: '420' },
        role: ProjectRole.Viewer,
        project: { id: '12' },
      } as any);
    });

    it('should open the invitation dialog and return an user as a student', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '420' },
        role: ProjectRole.Contributor,
      })} as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'create').and.returnValue(of({
        user: { id: '420' },
        role: ProjectRole.Contributor,
        project: { id: '12' },
      }));

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(projectMembers.create).toHaveBeenCalledWith('', {
        user: { id: '420' },
        role: ProjectRole.Contributor,
        project: { id: '12' },
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith('Mitglied erfolgreich hinzugefügt');
      expect(component.viewers.length).toBe(1);
      expect(component.contributors.length).toBe(2);
      expect(component.contributors).toContain({
        user: { id: '420' },
        role: ProjectRole.Contributor,
        project: { id: '12' },
      } as any);
    });
  });

  describe('onNewMilestoneClick(): void', () => {
    it('should open a dialog and cancel it', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMilestones, 'create');

      component.onNewMilestoneClick();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(projectMilestones.create).not.toHaveBeenCalled();
    });

    it('should open a dialog and return a milestone, but creating the milestone fails due to an exception', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of({
          name: 'New Milestone',
        }),
      } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-102' }});
      spyOn(projectMilestones, 'create').and.returnValue(throwError(() => exception));

      component.onNewMilestoneClick();

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.create).toHaveBeenCalledWith('', {
        name: 'New Milestone',
        project: {
          id: '12',
        },
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should open a dialog and return a milestone, and create it successfully', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of({
          name: 'New Milestone',
        }),
      } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMilestones, 'create').and.returnValue(of({
        id: '265247',
        name: 'New Milestone',
        project: {
          id: '12',
        },
      }));

      component.onNewMilestoneClick();

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.create).toHaveBeenCalledWith('', {
        name: 'New Milestone',
        project: {
          id: '12',
        },
      });
      expect(component.project.milestones).toContain({
        id: '265247',
        name: 'New Milestone',
        project: {
          id: '12',
        },
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith('Meilenstein erfolgreich hinzugefügt');
    });
  });

  describe('getNextSequenceNumber(): number', () => {
    it('should return the next sequence number, based on the given reports', () => {
      expect(component.getNextSequenceNumber()).toBe(3);
    });

    it('should return the next sequence number, if there were no reports given', () => {
      component.project.reports = [];

      expect(component.getNextSequenceNumber()).toBe(1);
    });
  });

  describe('deleteMilestone(number): void', () => {
    it('should not confirm the deletion operation of a milestone', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMilestones, 'delete');

      component.deleteMilestone(0);

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(projectMilestones.delete).not.toHaveBeenCalled();
    });

    it('should confirm the deletion of a milestone and successfully delete it permanently', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMilestones, 'delete').and.returnValue(of(true));

      component.deleteMilestone(1);

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.delete).toHaveBeenCalledWith(':id', '265');
      expect(component.project.milestones).toContain({
        id: '264',
      } as any);
      expect(component.project.milestones).not.toContain({
        id: '265',
      } as any);
      expect(component.project.milestones).toContain({
        id: '266',
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
    });

    it('should confirm the deletion of a milestone and fail to confirm the successful deletion of it', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(projectMilestones, 'delete').and.returnValue(of(false));

      component.deleteMilestone(1);

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.delete).toHaveBeenCalledWith(':id', '265');
      expect(component.project.milestones).toContain({
        id: '264',
      } as any);
      expect(component.project.milestones).toContain({
        id: '265',
      } as any);
      expect(component.project.milestones).toContain({
        id: '266',
      } as any);
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION,
      );
    });

    it('should confirm the deletion of a milestone and fail to delete it, due to an exception', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-121' }});
      spyOn(projectMilestones, 'delete').and.returnValue(throwError(() => exception));

      component.deleteMilestone(1);

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.delete).toHaveBeenCalledWith(':id', '265');
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED,
        exception,
      );
    });
  });

  describe('moveToCompanions(string): void', () => {
    it('should successfully save the changes to the project members role', () => {
      spyOn(projectMembers, 'update').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');

      component.moveToCompanions('2');

      expect(projectMembers.update).toHaveBeenCalledWith(':id', '2', {
        id: '2',
        role: ProjectRole.Viewer,
        user: {
          id: '21',
        },
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith('Erfolgreich zu einen Betreuer umgewandelt');
      expect(component.contributors).not.toContain({
        id: '2',
        role: ProjectRole.Contributor,
        user: {
          id: '21',
        },
      } as any);
      expect(component.viewers).toContain({
        id: '2',
        role: ProjectRole.Viewer,
        user: {
          id: '21',
        },
      } as any);
    });

    it('should fail to confirm the successful save of the changes to the project members role', () => {
      spyOn(projectMembers, 'update').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');

      component.moveToCompanions('2');

      expect(projectMembers.update).toHaveBeenCalledWith(':id', '2', {
        id: '2',
        role: ProjectRole.Viewer,
        user: {
          id: '21',
        },
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION,
      );
      expect(component.contributors).toContain({
        id: '2',
        role: ProjectRole.Contributor,
        user: {
          id: '21',
        },
      } as any);
      expect(component.viewers).not.toContain({
        id: '2',
        role: ProjectRole.Viewer,
        user: {
          id: '21',
        },
      } as any);
    });

    it('should fail to save the changes to the project members role, due to an exception', () => {
      const exception = new HttpException({ error: { code: 'HSEL-400-242' }});
      spyOn(projectMembers, 'update').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');

      component.moveToCompanions('2');

      expect(projectMembers.update).toHaveBeenCalledWith(':id', '2', {
        id: '2',
        role: ProjectRole.Viewer,
        user: {
          id: '21',
        },
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });
  });

  describe('moveToStudents(string): void', () => {
    it('should successfully save the changes to the project members role', () => {
      spyOn(projectMembers, 'update').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');

      component.moveToStudents('6');

      expect(projectMembers.update).toHaveBeenCalledWith(':id', '6', {
        id: '6',
        role: ProjectRole.Contributor,
        user: {
          id: '28',
        },
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith('Erfolgreich zu einen Studierenden umgewandelt');
      expect(component.contributors).toContain({
        id: '6',
        role: ProjectRole.Contributor,
        user: {
          id: '28',
        },
      } as any);
      expect(component.viewers).not.toContain({
        id: '6',
        role: ProjectRole.Viewer,
        user: {
          id: '28',
        },
      } as any);
    });

    it('should fail to confirm the successful save of the changes to the project members role', () => {
      spyOn(projectMembers, 'update').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');

      component.moveToStudents('6');

      expect(projectMembers.update).toHaveBeenCalledWith(':id', '6', {
        id: '6',
        role: ProjectRole.Contributor,
        user: {
          id: '28',
        },
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION,
      );
      expect(component.contributors).not.toContain({
        id: '6',
        role: ProjectRole.Contributor,
        user: {
          id: '28',
        },
      } as any);
      expect(component.viewers).toContain({
        id: '6',
        role: ProjectRole.Viewer,
        user: {
          id: '28',
        },
      } as any);
    });

    it('should fail to save the changes to the project members role, due to an exception', () => {
      const exception = new HttpException({ error: { code: 'HSEL-400-241' }});
      spyOn(projectMembers, 'update').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');

      component.moveToStudents('6');

      expect(projectMembers.update).toHaveBeenCalledWith(':id', '6', {
        id: '6',
        role: ProjectRole.Contributor,
        user: {
          id: '28',
        },
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });
  });

  describe('removeStudent(string): void', () => {
    it('should cancel the deletion of the selected project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'delete');

      component.removeStudent('2');

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(projectMembers.delete).not.toHaveBeenCalled();
    });

    it('should fail to delete the selected project member, due to an exception', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-827' }});
      spyOn(projectMembers, 'delete').and.returnValue(throwError(() => exception));

      component.removeStudent('2');

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMembers.delete).toHaveBeenCalledWith(':id', '2');
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED,
        exception,
      );
    });

    it('should fail to confirm the deletion of the selected project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(projectMembers, 'delete').and.returnValue(of(false));

      component.removeStudent('2');

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMembers.delete).toHaveBeenCalledWith(':id', '2');
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION,
      );
    });

    it('should successfully delete the selected project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'delete').and.returnValue(of(true));

      component.removeStudent('2');

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMembers.delete).toHaveBeenCalledWith(':id', '2');
      expect(component.viewers).not.toContain({
        id: '2',
        role: ProjectRole.Contributor,
        user: {
          id: '21',
        },
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
    });
  });

  describe('removeCompanion(string): void', () => {
    it('should cancel the deletion of the selected project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'delete');

      component.removeCompanion('6');

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(projectMembers.delete).not.toHaveBeenCalled();
    });

    it('should fail to delete the selected project member, due to an exception', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-824' }});
      spyOn(projectMembers, 'delete').and.returnValue(throwError(() => exception));

      component.removeCompanion('6');

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMembers.delete).toHaveBeenCalledWith(':id', '6');
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED,
        exception,
      );
    });

    it('should fail to confirm the deletion of the selected project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(projectMembers, 'delete').and.returnValue(of(false));

      component.removeCompanion('6');

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMembers.delete).toHaveBeenCalledWith(':id', '6');
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION,
      );
    });

    it('should successfully delete the selected project member', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMembers, 'delete').and.returnValue(of(true));

      component.removeCompanion('6');

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMembers.delete).toHaveBeenCalledWith(':id', '6');
      expect(component.viewers).not.toContain({
        id: '6',
        role: ProjectRole.Viewer,
        user: {
          id: '28',
        },
      } as any);
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
    });
  });

  describe('deleteProject(): void', () => {
    it('should cancel the deletion of the current project', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projects, 'delete');

      component.deleteProject();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_CANCELED);
      expect(projects.delete).not.toHaveBeenCalled();
    });

    it('should fail to delete the current project, due to an exception', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-241' }});
      spyOn(projects, 'delete').and.returnValue(throwError(() => exception));

      component.deleteProject();

      expect(dialog.open).toHaveBeenCalled();
      expect(projects.delete).toHaveBeenCalledWith(':id', '12');
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED,
        exception,
      );
    });

    it('should fail to confirm the deletion of the current project', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(projects, 'delete').and.returnValue(of(false));

      component.deleteProject();

      expect(dialog.open).toHaveBeenCalled();
      expect(projects.delete).toHaveBeenCalledWith(':id', '12');
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION,
      );
    });

    it('should successfully delete the current project and redirect to the list of all projects', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projects, 'delete').and.returnValue(of(true));
      spyOn(router, 'navigateByUrl');

      component.deleteProject();

      expect(dialog.open).toHaveBeenCalled();
      expect(projects.delete).toHaveBeenCalledWith(':id', '12');
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/projects');
    });
  });
});
