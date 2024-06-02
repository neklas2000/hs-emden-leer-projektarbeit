import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateTime } from 'luxon';
import { Subscription, take } from 'rxjs';

import { FormValidators } from 'app/validators';
import { DateService } from '@Services/date.service';
import { Nullable, Undefinable } from '@Types';
import { ProjectMilestone } from '@Models/project-milestone';
import { NewMilestoneDialogComponent } from '@Components/new-milestone-dialog/new-milestone-dialog.component';
import { SnackbarService } from '@Services/snackbar.service';
import { ProjectMember, ProjectRole } from '@Models/project-member';
import { UndefinedStringPipe } from 'app/pipes/undefined-string.pipe';
import { InviteProjectMemberDialogComponent } from '@Components/invite-project-member-dialog/invite-project-member-dialog.component';
import { ProjectService } from '@Services/project.service';
import { HttpException } from '@Utils/http-exception';
import { Router } from '@angular/router';
import { AuthenticationService } from '@Services/authentication.service';

@Component({
  selector: 'hsel-new-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    UndefinedStringPipe,
    MatTooltipModule,
  ],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent implements OnInit, OnDestroy {
  form: FormGroup = this.formBuilder.group({
    name: ['', [FormValidators.required]],
    interval: [7, [FormValidators.required, FormValidators.min(1)]],
    startDate: [this.date.getToday(), [FormValidators.required]],
    endDate: ['', [FormValidators.behindDate('startDate'), FormValidators.matchesInterval('startDate', 'interval')]],
    type: [''],
  });
  milestones: ProjectMilestone[] = [];
  companions: ProjectMember[] = [];
  students: ProjectMember[] = [];
  private intervalChangesSubscription: Undefinable<Subscription>;
  private startDateChangesSubscription: Undefinable<Subscription>;
  private userId!: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly date: DateService,
    private readonly dialog: MatDialog,
    private readonly snackbar: SnackbarService,
    private readonly project: ProjectService,
    private readonly router: Router,
    private readonly authentication: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.intervalChangesSubscription = this.form.get('interval')?.valueChanges
      .subscribe((changes) => {
        const control = this.form.get('endDate');

        if (control?.dirty) {
          control.updateValueAndValidity();
        }
      });

    this.startDateChangesSubscription = this.form.get('startDate')?.valueChanges
      .subscribe((changes) => {
        const control = this.form.get('endDate');

        if (control?.dirty) {
          control.updateValueAndValidity();
        }
      });

    this.userId = this.authentication.getUser()!;
  }

  ngOnDestroy(): void {
    if (this.intervalChangesSubscription) {
      this.intervalChangesSubscription.unsubscribe();
    }

    if (this.startDateChangesSubscription) {
      this.startDateChangesSubscription.unsubscribe();
    }
  }

  private filterEndDate(date: DateTime | null): boolean {
    if (!date) return false;

    const interval = parseInt(this.form.get('interval')?.value ?? 1);
    const start: DateTime = this.form.get('startDate')?.value ?? this.date.getToday();
    const diff = this.date.compare(date.toFormat('yyyy-MM-dd'), start.toFormat('yyyy-MM-dd'));

    if (diff <= 0) return false;

    return diff % interval === 0;
  }

  boundFilterEndDate = this.filterEndDate.bind(this);

  addMilestone(): void {
    const dialogRef = this.dialog.open(NewMilestoneDialogComponent, {
      minWidth: '60dvw',
      maxWidth: '80dvw',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((milestone: Nullable<ProjectMilestone>) => {
      if (milestone) {
        this.milestones.push(milestone);
        this.snackbar.open('Meilenstein hinzugefügt');
      }
    });
  }

  deleteMilestone(index: number): void {
    this.milestones.splice(index, 1);
  }

  inviteStudent(): void {
    const dialogRef = this.dialog.open(InviteProjectMemberDialogComponent, {
      data: {
        role: ProjectRole.Contributor,
      },
      minWidth: '60dvw',
      maxWidth: '80dvw',
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((member: Nullable<ProjectMember>) => {
      if (!member) return;
      if (member.user.id === this.userId) {
        this.snackbar.open('Sie können sich nicht selber einladen');

        return;
      }

      if (member.role === ProjectRole.Contributor) {
        this.students.push(member);
      } else {
        this.companions.push(member);
      }
    });
  }

  inviteCompanion(): void {
    const dialogRef = this.dialog.open(InviteProjectMemberDialogComponent, {
      data: {
        role: ProjectRole.Viewer,
      },
      minWidth: '60dvw',
      maxWidth: '80dvw',
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((member: Nullable<ProjectMember>) => {
      if (!member) return;
      if (member.user.id === this.userId) {
        this.snackbar.open('Sie können sich nicht selber einladen');

        return;
      }

      if (member.role === ProjectRole.Viewer) {
        this.companions.push(member);
      } else {
        this.students.push(member);
      }
    });
  }

  moveToCompanions(index: number): void {
    const student = this.students.splice(index, 1);

    if (student.length > 0) {
      student[0].role = ProjectRole.Viewer;
    }

    this.companions.push(...student);
  }

  moveToStudents(index: number): void {
    const companion = this.companions.splice(index, 1);

    if (companion.length > 0) {
      companion[0].role = ProjectRole.Contributor;
    }

    this.students.push(...companion);
  }

  removeStudent(index: number): void {
    this.students.splice(index, 1);
  }

  removeCompanion(index: number): void {
    this.companions.splice(index, 1);
  }

  onCancelClick(): void {
    window.history.back();
  }

  onSubmitClick(): void {
    this.project.create('', {
      name: this.form.get('name')!.value,
      reportInterval: this.form.get('interval')!.value,
      officialStart: this.form.get('startDate')!.value.toFormat('yyyy-MM-dd'),
      officialEnd: this.getOfficialEnd(),
      type: this.form.get('type')?.value,
      ...(this.milestones.length > 0 ? { milestones: this.milestones } : {}),
      ...(this.companions.length > 0 || this.students.length > 0 ? { members: [...this.companions, ...this.students] } : {}),
    }).pipe(take(1)).subscribe({
      next: (createdProject) => {
        this.snackbar.open('Projekt erfolgreich gespeichert');
        this.router.navigateByUrl(`/projects/${createdProject.id}`);
      },
      error: (exception: HttpException) => {
        this.snackbar.showException('Speichern fehlgeschlagen', exception);
      },
    });
  }

  private getOfficialEnd(): Nullable<string> {
    if (this.form.get('endDate')?.value) {
      if (this.form.get('endDate')!.value instanceof DateTime) {
        return this.form.get('endDate')!.value.toFormat('yyyy-MM-dd');
      }
    }

    return null;
  }
}
