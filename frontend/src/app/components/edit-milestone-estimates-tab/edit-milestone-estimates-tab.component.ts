import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateTime } from 'luxon';
import { Subscription, take } from 'rxjs';

import { InfoBoxComponent } from '@Components/info-box/info-box.component';
import {
  ConfirmMilestoneDeletionComponent,
} from '@Dialogs/confirm-milestone-deletion/confirm-milestone-deletion.component';
import {
  ConfirmMilestoneEstimateDeletionComponent,
} from '@Dialogs/confirm-milestone-estimate-deletion/confirm-milestone-estimate-deletion.component';
import { MilestoneEstimate } from '@Models/milestone-estimate';
import { ProjectMilestone } from '@Models/project-milestone';
import { DateService } from '@Services/date.service';
import { DialogService } from '@Services/dialog.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { DeepPartial, Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';
import { FormValidators } from '@Validators';

type EstimateAndControl = {
  id: number;
  control: string;
  estimate: MilestoneEstimate;
};

@Component({
  selector: 'hsel-edit-milestone-estimates-tab',
  templateUrl: './edit-milestone-estimates-tab.component.html',
  styleUrl: './edit-milestone-estimates-tab.component.scss',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    InfoBoxComponent,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
})
export class EditMilestoneEstimatesTabComponent implements OnInit, OnDestroy {
  @Input() reportStart!: string;
  @Input() reportEnd: Nullable<string> = null;
  @Input() reportInterval!: number;
  @Input() milestone!: ProjectMilestone;
  @Output() onDelete: EventEmitter<void> = new EventEmitter();
  form!: FormGroup;
  estimateControls: EstimateAndControl[] = [];
  maxDate: Nullable<DateTime> = null;
  private milestoneReachedChangesSubscription!: Subscription;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly projectMilestones: ProjectMilestoneService,
    private readonly milestonesEstimates: MilestoneEstimateService,
    private readonly dialog: DialogService,
    private readonly snackbar: SnackbarService,
    private readonly date: DateService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.milestone.name, [FormValidators.required]],
      milestoneReached: [this.milestone.milestoneReached, [FormValidators.required]],
    });

    this.milestone.estimates.forEach((estimate, idx) => {
      const control = `estimate_${idx}`;
      this.estimateControls.push({ id: idx, control, estimate });
      this.form.addControl(
        control,
        new FormControl(estimate.estimationDate, [
          FormValidators.required,
          FormValidators.withinInterval(this.reportStart, this.reportInterval, this.reportEnd),
        ]),
      );
    });

    if (this.reportEnd) {
      this.maxDate = DateTime.fromSQL(this.reportEnd);
    }

    this.milestoneReachedChangesSubscription = this.form.controls['milestoneReached'].valueChanges
      .subscribe((_) => {
        this.toggleFormActivation();
      });

    this.toggleFormActivation();
  }

  ngOnDestroy(): void {
    if (this.milestoneReachedChangesSubscription) {
      this.milestoneReachedChangesSubscription.unsubscribe();
    }
  }

  clearControl(control: string): void {
    this.form.controls[control].reset('', { emitEvent: false });
  }

  deleteEstimate(estimateControl: EstimateAndControl): void {
    const dialogRef = this.dialog.open(ConfirmMilestoneEstimateDeletionComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deleteEstimatePermanently(estimateControl);
      } else {
        this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_CANCELED);
      }
    });
  }

  private deleteEstimatePermanently(estimateControl: EstimateAndControl): void {
    this.milestonesEstimates.delete(':id', estimateControl.estimate.id).pipe(take(1)).subscribe({
      next: (deletionSuccessful) => {
        if (deletionSuccessful) {
          this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
        } else {
          this.snackbar.showWarning(SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION);
        }

        this.estimateControls.pop();
        this.form.removeControl(estimateControl.control, { emitEvent: false });
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.DELETE_OPERATION_FAILED, exception);
      },
    });
  }

  addNextEstimate(): void {
    const id = (this.estimateControls[this.estimateControls.length - 1]?.id ?? -1) + 1;
    const control = `estimate_${id}`;
    let nextDate = this.reportStart;

    if (id > 0) {
      nextDate = this.date.getNextDateInInterval(
        this.estimateControls[this.estimateControls.length - 1].estimate.reportDate,
        this.reportInterval,
      );
    }

    if (this.reportEnd && this.date.compare(nextDate, this.reportEnd) > 0) {
      this.snackbar.showError('Berichtszeitpunkt liegt hinter dem Projektende', 5000);

      return;
    }

    this.milestonesEstimates.create('', {
      estimationDate: nextDate,
      milestone: {
        id: this.milestone.id,
      },
      reportDate: nextDate,
    }).pipe(take(1)).subscribe({
      next: (estimate) => {
        this.estimateControls.push({ id, control, estimate });
        this.milestone.estimates.push(estimate);
        this.form.addControl(
          control,
          new FormControl(estimate.estimationDate, [
            FormValidators.required,
            FormValidators.withinInterval(this.reportStart, this.reportInterval, this.reportEnd),
          ]),
        );

        this.snackbar.showInfo(SnackbarMessage.CREATE_ESTIMATE_SUCCEEDED);
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.FAILED, exception);
      },
    });
  }

  onSaveChanges(): void {
    const changes = this.getChanges();

    if (Object.keys(changes).length === 0) {
      this.snackbar.showWarning(SnackbarMessage.NO_CHANGES);

      return;
    }

    this.projectMilestones.update(':id', this.milestone.id, changes).pipe(take(1)).subscribe({
      next: (updateSuccessful) => {
        if (updateSuccessful) {
          this.snackbar.showInfo(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
        } else {
          this.snackbar.showWarning(SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION);
        }

        this.applyChanges(changes);
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
      },
    });
  }

  private getChanges(): DeepPartial<ProjectMilestone> {
    const changes: DeepPartial<ProjectMilestone> = {};

    if (this.form.controls['name'].value !== this.milestone.name) {
      changes.name = this.form.controls['name'].value;
    }

    if (this.isMilestoneReached !== this.milestone.milestoneReached) {
      changes.milestoneReached = this.isMilestoneReached;
    }

    const changedEstimates: DeepPartial<MilestoneEstimate>[] = [];

    for (const estimateControl of this.estimateControls) {
      const formValue = this.date.toString(this.form.controls[estimateControl.control].value);

      if (formValue !== this.milestone.estimates[estimateControl.id].estimationDate) {
        changedEstimates.push({
          id: estimateControl.estimate.id,
          estimationDate: formValue,
        });
      }
    }

    if (changedEstimates.length > 0) {
      changes.estimates = changedEstimates;
    }

    return changes;
  }

  private applyChanges(changes: DeepPartial<ProjectMilestone>): void {
    if (changes.name) {
      this.milestone.name = changes.name;
    }

    if (Object.hasOwn(changes, 'milestoneReached')) {
      this.milestone.milestoneReached = changes.milestoneReached!;
    }

    if (changes.estimates) {
      for (const changedEstimate of changes.estimates) {
        for (const estimate of this.milestone.estimates) {
          if (estimate.id === changedEstimate.id) {
            estimate.estimationDate = changedEstimate.estimationDate!;
          }
        }
      }
    }
  }

  onMilestoneDelete(): void {
    const dialogRef = this.dialog.open(ConfirmMilestoneDeletionComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deleteMilestonePermanently();
      } else {
        this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_CANCELED);
      }
    });
  }

  private deleteMilestonePermanently(): void {
    this.projectMilestones.delete(':id', this.milestone.id).pipe(take(1)).subscribe({
      next: (deletionSuccessful) => {
        if (deletionSuccessful) {
          this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
        } else {
          this.snackbar.showWarning(SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION);
        }

        this.onDelete.emit();
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.DELETE_OPERATION_FAILED, exception);
      },
    });
  }

  boundFilterDates = this.filterDates.bind(this);

  private filterDates(date: DateTime | null): boolean {
    if (!date) return false;

    return this.date.isWithinInterval(date, this.reportInterval, this.reportStart, this.reportEnd);
  }

  convertToDateTime(date: string): DateTime {
    return DateTime.fromSQL(date);
  }

  get isMilestoneReached(): boolean {
    return Boolean(this.form.get('milestoneReached')?.value);
  }

  private toggleFormActivation(): void {
    if (this.isMilestoneReached) {
      this.form.disable({ emitEvent: false });
      this.form.controls['milestoneReached'].enable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }
}
