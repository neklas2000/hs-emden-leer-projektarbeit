import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Data } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, Observable, take } from 'rxjs';

import { EditMilestoneEstimatesTabComponent } from '../edit-milestone-estimates-tab/edit-milestone-estimates-tab.component';
import { ProjectMilestone } from '@Models/project-milestone';
import { Project } from '@Models/project';
import { NewMilestoneDialogComponent } from '../new-milestone-dialog/new-milestone-dialog.component';
import { DateService } from '@Services/date.service';
import { SnackbarService } from '@Services/snackbar.service';
import { Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

@Component({
  selector: 'hsel-edit-milestone-estimates',
  standalone: true,
  imports: [
    MatInputModule,
    MatCommonModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    DatePipe,
    MatDatepickerModule,
    MatTabsModule,
    MatIconModule,
    EditMilestoneEstimatesTabComponent,
    AsyncPipe,
  ],
  templateUrl: './edit-milestone-estimates.component.html',
  styleUrl: './edit-milestone-estimates.component.scss'
})
export class EditMilestoneEstimatesComponent implements OnInit {
  reportDates: string[] = [];
  milestones: ProjectMilestone[] = [];
  project: Nullable<Project> = null;
  selectedTab: Observable<number>;
  private selectedTabSubject: BehaviorSubject<number>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly date: DateService,
    private readonly projectMilestones: ProjectMilestoneService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialog,
  ) {
    this.selectedTabSubject = new BehaviorSubject(0);
    this.selectedTab = this.selectedTabSubject.asObservable();
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(take(1))
      .subscribe(({ milestones, project }: Data) => {
        this.milestones = milestones;
        this.project = project;

        this.milestones.forEach((milestone) => {
          milestone.estimates.sort((estimateA, estimateB) => {
            return this.date.compare(estimateA.estimationDate, estimateB.estimationDate);
          });
        })

        if (this.project !== null) {
          this.reportDates = this.date.getReportDates(
            this.project.officialStart!,
            this.project.officialEnd,
            this.project.reportInterval,
          ).map((date) => date.toFormat('yyyy-MM-dd'));
        }
      });
  }

  onTabChange(tabIndex: number): void {
    if (tabIndex !== this.milestones.length) {
      this.activateTab(tabIndex);

      return;
    }

    const dialogRef = this.dialog.open(NewMilestoneDialogComponent, {
      minWidth: '60dvw',
      maxWidth: '80dvw',
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((milestone?: ProjectMilestone) => {
      if (!milestone && tabIndex !== 0) {
        this.activateTab(0);
      } else if (milestone) {
        this.createMilestone(milestone, tabIndex);
      }
    });
  }

  createMilestone(milestone: ProjectMilestone, tabIndex: number): void {
    this.projectMilestones.create('', {
      ...milestone,
      project: this.project,
    }).pipe(take(1)).subscribe({
      next: (createdMilestone) => {
        this.milestones.push(createdMilestone);
        this.activateTab(tabIndex);
      },
      error: (exception: HttpException) => {
        this.snackbar.showException('Erstellen des Meilensteins fehlgeschlagen', exception);

        if (tabIndex !== 0) {
          this.activateTab(0);
        }
      },
    });
  }

  private activateTab(tabIndex: number): void {
    this.selectedTabSubject.next(tabIndex);
  }
}
