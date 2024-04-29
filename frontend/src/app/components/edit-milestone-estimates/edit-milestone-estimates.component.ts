import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { JsonApiDatastore } from '@Services/json-api-datastore.service';
import { SnackbarService } from '@Services/snackbar.service';
import { Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';

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
  @ViewChildren('tabContent') private tabContents!: QueryList<EditMilestoneEstimatesTabComponent>;
  reportDates: string[] = [];
  milestones: ProjectMilestone[] = [];
  project: Nullable<Project> = null;
  annotations!: ApexAnnotations;
  selectedTab: Observable<number>;
  private selectedTabSubject: BehaviorSubject<number>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly date: DateService,
    private readonly jsonApiDatastore: JsonApiDatastore,
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
            return this.date.compare(estimateA.estimationDate ?? '', estimateB.estimationDate ?? '');
          });
        })

        if (this.project !== null) {
          this.reportDates = this.date.getReportDates(
            this.project.officialStart,
            this.project.officialEnd,
            this.project.reportInterval,
          ).map((date) => date.toFormat('yyyy-MM-dd'));
        }
      });
  }

  onTabChange(tabIndex: number): void {
    console.log(tabIndex);
    const lastTab = this.selectedTabSubject.value;
    let tab = this.tabContents.get(lastTab);

    if (tab) {
      tab.renderChart = false;
    }

    if (tabIndex === this.milestones.length) {
      const dialogRef = this.dialog.open(NewMilestoneDialogComponent, { width: '80vw' });
      dialogRef.afterClosed().pipe(take(1)).subscribe((milestone?: ProjectMilestone) => {
        if (!milestone && tabIndex !== 0) {
          this.activateTab(0);
        } else if (milestone) {
          this.createMilestone(milestone, tabIndex);
        }
      });
    } else {
      this.activateTab(tabIndex);
    }
  }

  createMilestone(milestone: ProjectMilestone, tabIndex: number): void {
    this.jsonApiDatastore.add<ProjectMilestone>(ProjectMilestone, {
      ...milestone,
      project: this.project,
    }).pipe(take(1)).subscribe({
      next: (result) => {
        if (result.length === 1) {
          this.milestones.push(result[0]);
        }

        this.activateTab(tabIndex);
      },
      error: (exception: HttpException) => {
        console.log(exception);
        if (tabIndex !== 0) {
          this.activateTab(0);
        }
      },
    });
  }

  private activateTab(tabIndex: number): void {
    const tab = this.tabContents.get(tabIndex);

    if (tab) {
      tab.renderChart = true;
    }

    this.selectedTabSubject.next(tabIndex);
  }
}
