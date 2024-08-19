import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Data } from '@angular/router';

import { take } from 'rxjs';

import {
  EditMilestoneEstimatesTabComponent
} from '@Components/edit-milestone-estimates-tab/edit-milestone-estimates-tab.component';
import { Project } from '@Models/project';
import { ProjectMilestone } from '@Models/project-milestone';
import { DateService } from '@Services/date.service';
import { Nullable } from '@Types';

@Component({
  selector: 'hsel-edit-milestone-estimates',
  templateUrl: './edit-milestone-estimates.component.html',
  styleUrl: './edit-milestone-estimates.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    EditMilestoneEstimatesTabComponent,
    FormsModule,
    MatCommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
  ],
})
export class EditMilestoneEstimatesComponent implements OnInit {
  milestones: ProjectMilestone[] = [];
  reportStart!: string;
  reportEnd: Nullable<string> = null;
  reportInterval!: number;
  project!: Project;
  selectedTab: number = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly date: DateService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(take(1))
      .subscribe(({ milestones, project }: Data) => {
        this.milestones = milestones;
        this.project = project;
        this.reportStart = this.project.officialStart;
        this.reportEnd = this.project.officialEnd;
        this.reportInterval = this.project.reportInterval;

        this.milestones.forEach((milestone) => {
          milestone.estimates.sort((estimateA, estimateB) => {
            return this.date.compare(estimateA.reportDate, estimateB.reportDate);
          });
        });
      });
  }

  removeMilestone(id: string): void {
    this.milestones = this.milestones.filter((milestone) => milestone.id !== id);
    this.selectedTab = 0;
  }
}
