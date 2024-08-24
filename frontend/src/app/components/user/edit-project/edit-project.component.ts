import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { DateTime } from 'luxon';
import { Subscription, take } from 'rxjs';

import { Project } from '@Models/project';
import { ProjectMember } from '@Models/project-member';
import { ProjectMilestone } from '@Models/project-milestone';
import { UndefinedStringPipe } from '@Pipes/undefined-string.pipe';
import { DateService } from '@Services/date.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { ProjectService } from '@Services/project.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { DeepPartial, Nullable, Undefinable } from '@Types';
import { HttpException } from '@Utils/http-exception';
import { FormValidators } from '@Validators';

@Component({
  selector: 'hsel-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    UndefinedStringPipe,
  ],
})
export class EditProjectComponent implements OnInit, OnDestroy {
  form!: FormGroup; // Will be initialized inside #ngOnInit
  milestones: ProjectMilestone[] = [];
  companions: ProjectMember[] = [];
  students: ProjectMember[] = [];
  private intervalChangesSubscription: Undefinable<Subscription>;
  private startDateChangesSubscription: Undefinable<Subscription>;
  private project!: Project; // Will be initialized inside #ngOnInit
  private window: Window;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly date: DateService,
    private readonly snackbar: SnackbarService,
    private readonly projects: ProjectService,
    private readonly router: Router,
    private readonly windowProvider: WindowProviderService,
  ) {
    this.window = this.windowProvider.getWindow();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [FormValidators.required]],
      interval: [7, [FormValidators.required, FormValidators.min(1)]],
      startDate: [this.date.getToday(), [FormValidators.required]],
      endDate: ['', [
        FormValidators.behindDate('startDate'),
        FormValidators.matchesInterval('startDate', 'interval'),
      ]],
      type: [''],
    });

    this.intervalChangesSubscription = this.form.get('interval')!.valueChanges
      .subscribe((_) => {
        const control = this.form.get('endDate')!;

        if (control.dirty) {
          control.updateValueAndValidity();
        }
      });

    this.startDateChangesSubscription = this.form.get('startDate')!.valueChanges
      .subscribe((_) => {
        const control = this.form.get('endDate')!;

        if (control.dirty) {
          control.updateValueAndValidity();
        }
      });

    this.activatedRoute.data.pipe(take(1)).subscribe(({ project }: Data) => {
      this.project = project;

      this.form.patchValue({
        name: this.project.name,
        interval: this.project.reportInterval,
        startDate: DateTime.fromSQL(this.project.officialStart),
        endDate: this.project.officialEnd ? DateTime.fromSQL(project.officialEnd) : '',
        type: this.project.type ?? '',
      });
    });
  }

  ngOnDestroy(): void {
    if (this.intervalChangesSubscription) {
      this.intervalChangesSubscription.unsubscribe();
    }

    if (this.startDateChangesSubscription) {
      this.startDateChangesSubscription.unsubscribe();
    }
  }

  boundFilterEndDate = this.filterEndDate.bind(this);

  private filterEndDate(date: DateTime | null): boolean {
    if (!date) return false;

    const interval = parseInt(this.form.get('interval')!.value ?? 1);
    const start = this.date.toString(this.form.get('startDate')!.value);
    const diff = this.date.compare(date.toFormat('yyyy-MM-dd'), start);

    if (diff <= 0) return false;

    return diff % interval === 0;
  }

  onCancelClick(): void {
    this.window.history.back();
  }

  onSubmitClick(): void {
    const payload: DeepPartial<Project> = {
      name: this.form.get('name')!.value,
      reportInterval: this.form.get('interval')!.value,
      officialStart: this.form.get('startDate')!.value.toFormat('yyyy-MM-dd'),
      officialEnd: this.getOfficialEnd(),
      type: this.getProjectType(),
    };

    this.projects.update(':id', this.project.id, payload).pipe(take(1)).subscribe({
      next: (updatedSuccessfully) => {
        if (updatedSuccessfully) {
          this.snackbar.showInfo(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
          this.router.navigateByUrl(`/projects/${this.project.id}`);
        } else {
          this.snackbar.showWarning(SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
      },
    });
  }

  private getOfficialEnd(): Nullable<string> {
    if (this.form.get('endDate')!.value) {
      if (this.form.get('endDate')!.value instanceof DateTime) {
        return this.form.get('endDate')!.value.toFormat('yyyy-MM-dd');
      }
    }

    return null;
  }

  private getProjectType(): Nullable<string> {
    if (this.form.get('type')!.value) {
      if (this.form.get('type')!.value.length > 0) {
        return this.form.get('type')!.value;
      }
    }

    return null;
  }
}
