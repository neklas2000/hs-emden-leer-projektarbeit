import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

import { DateTime } from 'luxon';
import { of, throwError } from 'rxjs';

import {
  InviteProjectMemberComponent,
} from '@Components/dialog/invite-project-member/invite-project-member.component';
import { NewProjectComponent } from '@Components/user/new-project/new-project.component';
import { ProjectRole } from '@Models/project-member';
import { AuthenticationService } from '@Services/authentication.service';
import { DateService } from '@Services/date.service';
import { DialogService } from '@Services/dialog.service';
import { ProjectService } from '@Services/project.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: NewProjectComponent', () => {
  let component: NewProjectComponent;
  let fixture: ComponentFixture<NewProjectComponent>;
  let dialog: DialogService;
  let snackbar: SnackbarService;
  let projects: ProjectService;
  let router: Router;
  let historyBackSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    historyBackSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        DateService,
        DialogService,
        SnackbarService,
        ProjectService,
        AuthenticationService,
        provideHttpClient(),
        provideRouter([]),
        Router,
        {
          provide: WindowProviderService,
          useValue: {
            getWindow: () => ({
              history: {
                back: historyBackSpy,
              },
              sessionStorage: {
                getItem: () => '123',
              },
            }),
          },
        },
        provideLuxonDateAdapter(),
        provideAnimations(),
      ],
      imports: [NewProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewProjectComponent);
    dialog = TestBed.inject(DialogService);
    snackbar = TestBed.inject(SnackbarService);
    projects = TestBed.inject(ProjectService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit(): void', () => {
    it('should update the value and validity of the endDate control, since the interval value changed', () => {
      component.form.controls['endDate'].markAsDirty();
      spyOn(component.form.controls['endDate'], 'updateValueAndValidity');

      component.form.patchValue({ interval: 7 });

      expect(component.form.controls['endDate'].updateValueAndValidity).toHaveBeenCalled();
    });

    it('should update the value and validity of the endDate control, since the startDate value changed', () => {
      component.form.controls['endDate'].markAsDirty();
      spyOn(component.form.controls['endDate'], 'updateValueAndValidity');

      component.form.patchValue({ startDate: DateTime.fromSQL('2024-01-01') });

      expect(component.form.controls['endDate'].updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('boundFilterEndDate(DateTime | null): boolean', () => {
    it('should return false because null was given', () => {
      expect(component.boundFilterEndDate(null)).toBeFalsy();
    });

    it('should return false, since the given date is before the start date', () => {
      component.form.patchValue({ startDate: null });
      expect(component.boundFilterEndDate(DateTime.fromSQL('2023-12-25'))).toBeFalsy();
    });

    it('should return true, since the given date is within the interval', () => {
      component.form.patchValue({
        interval: 7,
        startDate: DateTime.fromSQL('2024-01-01'),
      });

      expect(component.boundFilterEndDate(DateTime.fromSQL('2024-01-15'))).toBeTruthy();
    });

    it('should return true, since the given date is within the interval (interval is set to 1)', () => {
      component.form.patchValue({
        interval: null,
        startDate: DateTime.fromSQL('2024-01-01'),
      });

      expect(component.boundFilterEndDate(DateTime.fromSQL('2024-01-15'))).toBeTruthy();
    });
  });

  describe('addMilestone(): void', () => {
    it('should open the dialog and cancel the action', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showInfo');

      component.addMilestone();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(component.milestones.length).toBe(0);
    });

    it('should open the dialog and add the milestone temporarily', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ name: 'Milestone A' }) } as any);
      spyOn(snackbar, 'showInfo');

      component.addMilestone();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith('Meilenstein temporär hinzugefügt');
      expect(component.milestones.length).toBe(1);
    });
  });

  describe('deleteMilestone(number): void', () => {
    it('should delete the second milestone, but keep the others', () => {
      const milestones = [{ id: '1' }, { id: '2' }, { id: '3' }] as any[];
      component.milestones = [...milestones];

      component.deleteMilestone(1);

      expect(component.milestones).toContain(milestones[0]);
      expect(component.milestones).not.toContain(milestones[1]);
      expect(component.milestones).toContain(milestones[2]);
    });
  });

  describe('inviteStudent(): void', () => {
    it('should open the invitation dialog and cancel it', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showWarning');

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(snackbar.showWarning).not.toHaveBeenCalled();
      expect(component.students.length).toBe(0);
      expect(component.companions.length).toBe(0);
    });

    it('should open the invitation dialog and return the user, who is already the owner', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ user: { id: '123' } }) } as any);
      spyOn(snackbar, 'showWarning');

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith('Sie können sich nicht selber einladen');
      expect(component.students.length).toBe(0);
      expect(component.companions.length).toBe(0);
    });

    it('should open the invitation dialog and return an user as a companion', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '12' },
        role: ProjectRole.Viewer,
      })} as any);
      spyOn(snackbar, 'showWarning');

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(snackbar.showWarning).not.toHaveBeenCalled();
      expect(component.students.length).toBe(0);
      expect(component.companions.length).toBe(1);
      expect(component.companions).toContain({
        user: { id: '12' },
        role: ProjectRole.Viewer,
      } as any);
    });

    it('should open the invitation dialog and return an user as a student', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '12' },
        role: ProjectRole.Contributor,
      })} as any);
      spyOn(snackbar, 'showWarning');

      component.inviteStudent();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Contributor,
        },
      });
      expect(snackbar.showWarning).not.toHaveBeenCalled();
      expect(component.students.length).toBe(1);
      expect(component.companions.length).toBe(0);
      expect(component.students).toContain({
        user: { id: '12' },
        role: ProjectRole.Contributor,
      } as any);
    });
  });

  describe('inviteCompanion(): void', () => {
    it('should open the invitation dialog and cancel it', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showWarning');

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(snackbar.showWarning).not.toHaveBeenCalled();
      expect(component.students.length).toBe(0);
      expect(component.companions.length).toBe(0);
    });

    it('should open the invitation dialog and return the user, who is already the owner', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ user: { id: '123' } }) } as any);
      spyOn(snackbar, 'showWarning');

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith('Sie können sich nicht selber einladen');
      expect(component.students.length).toBe(0);
      expect(component.companions.length).toBe(0);
    });

    it('should open the invitation dialog and return an user as a companion', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '12' },
        role: ProjectRole.Viewer,
      })} as any);
      spyOn(snackbar, 'showWarning');

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(snackbar.showWarning).not.toHaveBeenCalled();
      expect(component.students.length).toBe(0);
      expect(component.companions.length).toBe(1);
      expect(component.companions).toContain({
        user: { id: '12' },
        role: ProjectRole.Viewer,
      } as any);
    });

    it('should open the invitation dialog and return an user as a student', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({
        user: { id: '12' },
        role: ProjectRole.Contributor,
      })} as any);
      spyOn(snackbar, 'showWarning');

      component.inviteCompanion();

      expect(dialog.open).toHaveBeenCalledWith(InviteProjectMemberComponent, {
        data: {
          role: ProjectRole.Viewer,
        },
      });
      expect(snackbar.showWarning).not.toHaveBeenCalled();
      expect(component.students.length).toBe(1);
      expect(component.companions.length).toBe(0);
      expect(component.students).toContain({
        user: { id: '12' },
        role: ProjectRole.Contributor,
      } as any);
    });
  });

  describe('moveToCompanions(number): void', () => {
    it('should move the second student to the companions', () => {
      const students = [
        { id: '1', role: ProjectRole.Contributor },
        { id: '2', role: ProjectRole.Contributor },
        { id: '3', role: ProjectRole.Contributor },
      ];

      component.students = [...students] as any[];
      component.companions = [];

      component.moveToCompanions(1);

      expect(component.students).toContain(students[0] as any);
      expect(component.students).not.toContain(students[1] as any);
      expect(component.students).toContain(students[2] as any);
      expect(component.companions).toContain({
        ...students[1],
        role: ProjectRole.Viewer,
      } as any);
    });
  });

  describe('moveToStudents(number): void', () => {
    it('should move the second companion to the students', () => {
      const companions = [
        { id: '1', role: ProjectRole.Viewer },
        { id: '2', role: ProjectRole.Viewer },
        { id: '3', role: ProjectRole.Viewer },
      ];

      component.companions = [...companions] as any[];
      component.students = [];

      component.moveToStudents(1);

      expect(component.companions).toContain(companions[0] as any);
      expect(component.companions).not.toContain(companions[1] as any);
      expect(component.companions).toContain(companions[2] as any);
      expect(component.students).toContain({
        ...companions[1],
        role: ProjectRole.Contributor,
      } as any);
    });
  });

  describe('removeStudent(number): void', () => {
    it('should only remove the second student', () => {
      const students = [{ id: '1' }, { id: '2' }, { id: '3' }];

      component.students = [...students] as any[];

      component.removeStudent(1);

      expect(component.students).toContain(students[0] as any);
      expect(component.students).not.toContain(students[1] as any);
      expect(component.students).toContain(students[2] as any);
    });
  });

  describe('removeCompanion(number): void', () => {
    it('should only remove the second companion', () => {
      const companions = [{ id: '1' }, { id: '2' }, { id: '3' }];

      component.companions = [...companions] as any[];

      component.removeCompanion(1);

      expect(component.companions).toContain(companions[0] as any);
      expect(component.companions).not.toContain(companions[1] as any);
      expect(component.companions).toContain(companions[2] as any);
    });
  });

  describe('onCancelClick(): void', () => {
    it('should go one page in the windows history back', () => {
      component.onCancelClick();

      expect(historyBackSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmitClick(): void', () => {
    it('should fail to create the new project, due to an exception', () => {
      const exception = new HttpException({ error: { code: 'HSEL-400-081' }});
      spyOn(projects, 'create').and.returnValue(throwError(() => exception));
      spyOn(router, 'navigateByUrl');
      spyOn(snackbar, 'showException');
      component.form.patchValue({
        name: 'New Test',
        interval: 7,
        startDate: DateTime.fromSQL('2024-02-01'),
        endDate: DateTime.fromSQL('2024-02-22'),
        type: 'Some Project',
      });

      component.onSubmitClick();

      expect(projects.create).toHaveBeenCalledWith('', {
        name: 'New Test',
        reportInterval: 7,
        officialStart: '2024-02-01',
        officialEnd: '2024-02-22',
        type: 'Some Project',
      });
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should successfully create the new project', () => {
      spyOn(projects, 'create').and.returnValue(of({
        id: '420',
      }));
      spyOn(router, 'navigateByUrl');
      spyOn(snackbar, 'showInfo');
      component.form.patchValue({
        name: 'New Test',
        interval: 7,
        startDate: DateTime.fromSQL('2024-02-01'),
        endDate: null,
        type: null,
      });
      component.milestones = [{} as any];
      component.students = [{} as any];

      component.onSubmitClick();

      expect(projects.create).toHaveBeenCalledWith('', {
        name: 'New Test',
        reportInterval: 7,
        officialStart: '2024-02-01',
        officialEnd: null,
        type: null,
        milestones: [{}],
        members: [{}],
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/projects/420');
    });
  });
});
