import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { take } from 'rxjs';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ProjectMilestone } from '@Models/project-milestone';
import { SnackbarService } from '@Services/snackbar.service';
import { DialogService } from '@Services/dialog.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { HttpException } from '@Utils/http-exception';
import { DeepPartial } from '@Types';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { FormValidators } from 'app/validators';
import { MilestoneEstimateFormFieldComponent } from '@Components/milestone-estimate-form-field/milestone-estimate-form-field.component';
import { DatePipe } from '@angular/common';
import { MilestoneEstimate } from '@Models/milestone-estimate';

type Estimate = {
  id: number;
  date: string;
  estimation: MilestoneEstimate;
};

@Component({
  selector: 'hsel-edit-milestone-estimates-tab',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MilestoneEstimateFormFieldComponent,
  ],
  templateUrl: './edit-milestone-estimates-tab.component.html',
  styleUrl: './edit-milestone-estimates-tab.component.scss'
})
export class EditMilestoneEstimatesTabComponent implements OnInit {
  @Input() reportDates: string[] = [];
  @Input() milestone!: ProjectMilestone;
  @Output() onDelete: EventEmitter<ProjectMilestone> = new EventEmitter();
  @Output() onChanges: EventEmitter<DeepPartial<ProjectMilestone>> = new EventEmitter();
  milestoneReached: boolean = false;
  form!: FormGroup;
  estimates: Estimate[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly projectMilestone: ProjectMilestoneService,
    private readonly milestoneEstimate: MilestoneEstimateService,
    private readonly dialog: DialogService,
    private readonly snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.milestoneReached = this.milestone.estimates
      .filter((estimate) => estimate.milestoneReached).length > 0;

    this.form = this.formBuilder.group({
      name: [this.milestone.name, [FormValidators.required]],
      milestoneReached: [this.milestoneReached, [FormValidators.required]],
    });

    this.reportDates.forEach((reportDate, index) => {
      this.estimates.push({
        id: index,
        date: reportDate,
        estimation: this.milestone.estimates.find(
          (milestoneEstimate) => milestoneEstimate.reportDate === reportDate,
        ) ?? {
          id: null,
          reportDate,
          estimationDate: null,
          milestoneReached: false,
          milestone: this.milestone,
        },
      });
    });
  }

  onSaveChanges(): void {
    const changes = this.getChanges();

    this.projectMilestone.update(':id', this.milestone.id!, changes)
      .pipe(take(1))
      .subscribe({
        next: (updateSuccessful) => {
          if (updateSuccessful) {
            this.snackbar.open('Änderungen erfolgreich gespeichert');
            this.onChanges.emit(changes);
          } else {
            this.snackbar.open('Aktualisierung konnte nicht bestätigt werden');
          }
        },
        error: (exception: HttpException) => {
          this.snackbar.showException('Aktualisierung fehlgeschlagen', exception);
        },
      });
  }

  private getChanges(): DeepPartial<ProjectMilestone> {
		let changes: DeepPartial<ProjectMilestone> = {};

    if (this.milestone.name !== this.form.get('name')!.value) {
      changes.name = this.form.get('name')?.value;
    }

		return changes;
  }

  onDiscardChanges(): void { }

  onMilestoneDelete(): void {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        data: {
          type: 'delete-milestone',
        },
      },
    );

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.projectMilestone.delete(':id', this.milestone.id!).pipe(take(1)).subscribe({
          next: (deletionSuccessful) => {
            if (deletionSuccessful) {
              this.snackbar.open('Erfolgreich gelöscht');
              this.onDelete.emit(this.milestone);
            } else {
              this.snackbar.open('Löschvorgang konnte nicht bestätigt werden');
            }
          },
          error: (exception: HttpException) => {
            this.snackbar.showException('Löschvorgang fehlgeschlagen', exception);
          },
        });
      } else {
        this.snackbar.open('Löschvorgang erfolgreich abgebrochen');
      }
    });
  }
}
