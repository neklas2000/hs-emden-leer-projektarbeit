import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';

import { of, throwError } from 'rxjs';

import {
  EditMilestoneEstimatesTabComponent
} from '@Components/edit-milestone-estimates-tab/edit-milestone-estimates-tab.component';
import { DateService } from '@Services/date.service';
import { DialogService } from '@Services/dialog.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: EditMilestoneEstimatesTabComponent', () => {
  let component: EditMilestoneEstimatesTabComponent;
  let fixture: ComponentFixture<EditMilestoneEstimatesTabComponent>;
  let dialog: DialogService;
  let milestoneEstimates: MilestoneEstimateService;
  let snackbar: SnackbarService;
  let projectMilestones: ProjectMilestoneService;
  let date: DateService;
  let windowHistoryBackSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    windowHistoryBackSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [EditMilestoneEstimatesTabComponent],
      providers: [
        FormBuilder,
        ProjectMilestoneService,
        MilestoneEstimateService,
        provideHttpClient(),
        DialogService,
        SnackbarService,
        DateService,
        provideAnimations(),
        provideLuxonDateAdapter(),
        {
          provide: WindowProviderService,
          useValue: {
            getWindow: () => ({
              history: {
                back: windowHistoryBackSpy,
              },
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMilestoneEstimatesTabComponent);
    dialog = TestBed.inject(DialogService);
    milestoneEstimates = TestBed.inject(MilestoneEstimateService);
    snackbar = TestBed.inject(SnackbarService);
    projectMilestones = TestBed.inject(ProjectMilestoneService);
    date = TestBed.inject(DateService);
    component = fixture.componentInstance;
    component.reportStart = '2024-01-01';
    component.reportEnd = '2024-01-29';
    component.reportInterval = 7;
    component.milestone = {
      id: '11',
      name: 'Milestone A',
      milestoneReached: true,
      project: {
        id: '111',
      },
      estimates: [{
        id: '1',
        reportDate: '2024-01-01',
        estimationDate: '2024-01-15',
      }, {
        id: '2',
        reportDate: '2024-01-08',
        estimationDate: '2024-01-15',
      }, {
        id: '3',
        reportDate: '2024-01-15',
        estimationDate: '2024-01-22',
      }, {
        id: '4',
        reportDate: '2024-01-22',
        estimationDate: '2024-01-29',
      }, {
        id: '5',
        reportDate: '2024-01-29',
        estimationDate: '2024-01-29',
      }],
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form disabled, since the milestone is reached', () => {
    for (const control in component.form.controls) {
      if (control === 'milestoneReached') {
        expect(component.form.controls[control].disabled).toBeFalsy();
      } else {
        expect(component.form.controls[control].disabled).toBeTruthy();
      }
    }
  });

  it('should enable the entire form, since the checkbox values of milestoneReached has changed', () => {
    component.form.patchValue({
      milestoneReached: false,
    });

    expect(component.form.enabled).toBeTruthy();
  });

  describe('clearControl(string): void', () => {
    it('should clear the input value for an estimation date', () => {
      const control = 'estimate_0';

      expect(component.form.controls[control].value).toEqual('2024-01-15');

      component.clearControl(control);

      expect(component.form.controls[control].value).toEqual('');
    });
  });

  describe('deleteEstimate(EstimateAndControl): void', () => {
    it('should cancel the deletion operation of an estimate', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(false),
      } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(milestoneEstimates, 'delete');

      component.deleteEstimate({
        id: 0,
        control: 'estimate_0',
        estimate: component.milestone.estimates[0],
      });

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_CANCELED);
      expect(milestoneEstimates.delete).not.toHaveBeenCalled();
    });

    it('should allow the deletion operation of an estimate, but fail to delete it', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-002' }});
      spyOn(milestoneEstimates, 'delete').and.returnValue(throwError(() => exception));

      component.deleteEstimate({
        id: 0,
        control: 'estimate_0',
        estimate: component.milestone.estimates[0],
      });

      expect(dialog.open).toHaveBeenCalled();
      expect(milestoneEstimates.delete).toHaveBeenCalledWith(':id', '1');
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED,
        exception,
      );
    });

    it('should allow the deletion operation of an estimate, but fail to confirm the deletion (due to sql)', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(milestoneEstimates, 'delete').and.returnValue(of(false));
      spyOn(component.form, 'removeControl').and.callThrough();

      component.deleteEstimate({
        id: 0,
        control: 'estimate_0',
        estimate: component.milestone.estimates[0],
      });

      expect(dialog.open).toHaveBeenCalled();
      expect(milestoneEstimates.delete).toHaveBeenCalledWith(':id', '1');
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION,
      );
      expect(component.form.removeControl).toHaveBeenCalledWith('estimate_0', { emitEvent: false });
    });

    it('should allow the deletion operation of an estimate and successfully delete it', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(milestoneEstimates, 'delete').and.returnValue(of(true));
      spyOn(component.form, 'removeControl').and.callThrough();

      component.deleteEstimate({
        id: 0,
        control: 'estimate_0',
        estimate: component.milestone.estimates[0],
      });

      expect(dialog.open).toHaveBeenCalled();
      expect(milestoneEstimates.delete).toHaveBeenCalledWith(':id', '1');
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
      expect(component.form.removeControl).toHaveBeenCalledWith('estimate_0', { emitEvent: false });
    });
  });

  describe('onMilestoneDelete(): void', () => {
    it('should cancel the delete operation of a milestone', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(false),
      } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMilestones, 'delete');

      component.onMilestoneDelete();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_CANCELED);
      expect(projectMilestones.delete).not.toHaveBeenCalled();
    });

    it('should allow the delete operation of a milestone, but fail to delete it', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);
      spyOn(snackbar, 'showException');
      const exception = new HttpException({ error: { code: 'HSEL-400-003' }});
      spyOn(projectMilestones, 'delete').and.returnValue(throwError(() => exception));

      component.onMilestoneDelete();

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.delete).toHaveBeenCalledWith(':id', '11');
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED,
        exception,
      );
    });

    it('should allow the delete operation of a milestone, but fail to confirm the deletion (due to sql)', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);
      spyOn(snackbar, 'showWarning');
      spyOn(projectMilestones, 'delete').and.returnValue(of(false));
      spyOn(component.onDelete, 'emit');

      component.onMilestoneDelete();

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.delete).toHaveBeenCalledWith(':id', '11');
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION,
      );
      expect(component.onDelete.emit).toHaveBeenCalled();
    });

    it('should allow the delete operation of a milestone and successfully delete it', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);
      spyOn(snackbar, 'showInfo');
      spyOn(projectMilestones, 'delete').and.returnValue(of(true));
      spyOn(component.onDelete, 'emit');

      component.onMilestoneDelete();

      expect(dialog.open).toHaveBeenCalled();
      expect(projectMilestones.delete).toHaveBeenCalledWith(':id', '11');
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
      expect(component.onDelete.emit).toHaveBeenCalled();
    });
  });

  describe('addNextEstimate(): void', () => {
    it('should show an error since there cannot be a new estimate', () => {
      spyOn(date, 'getNextDateInInterval').and.callThrough();
      spyOn(snackbar, 'showError');

      component.addNextEstimate();

      expect(date.getNextDateInInterval).toHaveBeenCalledWith('2024-01-29', 7);
      expect(snackbar.showError).toHaveBeenCalledWith(
        'Berichtszeitpunkt liegt hinter dem Projektende',
        5000,
      );
    });

    it('should successfully add the first estimate', (done) => {
      component.milestone.estimates = [];
      component.estimateControls = [];
      fixture.detectChanges();

      spyOn(date, 'getNextDateInInterval');
      spyOn(milestoneEstimates, 'create').and.returnValue(of({
        estimationDate: '2024-01-01',
        reportDate: '2024-01-01',
        id: '1',
      }));
      spyOn(snackbar, 'showInfo');
      spyOn(snackbar, 'showError');

      fixture.whenStable().then(() => {
        component.addNextEstimate();

        expect(date.getNextDateInInterval).not.toHaveBeenCalled();
        expect(snackbar.showError).not.toHaveBeenCalled();
        expect(milestoneEstimates.create).toHaveBeenCalledWith('', {
          estimationDate: '2024-01-01',
          reportDate: '2024-01-01',
          milestone: {
            id: '11',
          },
        });
        expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CREATE_ESTIMATE_SUCCEEDED);
        done();
      });
    });

    it('should fail to add a new estimate', (done) => {
      component.milestone.estimates = [];
      component.estimateControls = [];
      fixture.detectChanges();

      const exception = new HttpException({ error: { code: 'HSEL-400-004' }});
      spyOn(milestoneEstimates, 'create').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');

      fixture.whenStable().then(() => {
        component.addNextEstimate();

        expect(milestoneEstimates.create).toHaveBeenCalledWith('', {
          estimationDate: '2024-01-01',
          reportDate: '2024-01-01',
          milestone: {
            id: '11',
          },
        });
        expect(snackbar.showException).toHaveBeenCalledWith(SnackbarMessage.FAILED, exception);
        done();
      });
    });
  });

  describe('onSaveChanges(): void', () => {
    it('should show a warning, because no changes could be found', () => {
      spyOn(projectMilestones, 'update');
      spyOn(snackbar, 'showWarning');

      component.onSaveChanges();

      expect(snackbar.showWarning).toHaveBeenCalledWith(SnackbarMessage.NO_CHANGES);
      expect(projectMilestones.update).not.toHaveBeenCalled();
    });

    it('should update the name and the flag milestoneReached, but fail due to an exception', () => {
      const exception = new HttpException({ error: { code: 'HSEL-400-005' }});
      spyOn(projectMilestones, 'update').and.returnValue(throwError(() => exception));
      spyOn(snackbar, 'showException');
      component.form.patchValue({
        name: 'Milstone A',
        milestoneReached: false,
      });

      component.onSaveChanges();

      expect(projectMilestones.update).toHaveBeenCalledWith(':id', '11', {
        name: 'Milstone A',
        milestoneReached: false,
      });
      expect(snackbar.showException).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED,
        exception,
      );
    });

    it('should update the name and the flag milestoneReached, but fail to confirm that the changes have been saved and apply them regardless', () => {
      spyOn(projectMilestones, 'update').and.returnValue(of(false));
      spyOn(snackbar, 'showWarning');
      component.form.patchValue({
        name: 'Milstone A',
        milestoneReached: false,
      });

      component.onSaveChanges();

      expect(projectMilestones.update).toHaveBeenCalledWith(':id', '11', {
        name: 'Milstone A',
        milestoneReached: false,
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION,
      );
    });

    it('should successfully save changes to the estimates and apply them', () => {
      spyOn(projectMilestones, 'update').and.returnValue(of(true));
      spyOn(snackbar, 'showInfo');
      component.form.patchValue({
        estimate_0: '2024-01-08',
      });
      expect(component.milestone.estimates[0].estimationDate).toEqual('2024-01-15');

      component.onSaveChanges();

      expect(projectMilestones.update).toHaveBeenCalledWith(':id', '11', {
        estimates: [{
          id: '1',
          estimationDate: '2024-01-08',
        }],
      });
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
      expect(component.milestone.estimates[0].estimationDate).toEqual('2024-01-08');
    });
  });

  describe('back(): void', () => {
    it('should go one back in the windows history', () => {
      component.onBack();

      expect(windowHistoryBackSpy).toHaveBeenCalled();
    });
  });
});
