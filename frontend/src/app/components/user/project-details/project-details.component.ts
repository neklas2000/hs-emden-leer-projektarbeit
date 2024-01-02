import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { take } from 'rxjs';

import { Nullable } from '../../../types/nullable';
import { Project } from '../../../models/project';
import { ProjectRole } from '../../../models/project-member';
import { User } from '../../../models/user';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InviteProjectMemberDialogComponent } from '../../invite-project-member-dialog/invite-project-member-dialog.component';
import { MilestoneTrendAnalysisChartComponent } from '../../milestone-trend-analysis-chart/milestone-trend-analysis-chart.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    RouterModule,
    CommonModule,
    MilestoneTrendAnalysisChartComponent,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  project: Nullable<Project> = null;
  contributors: Nullable<User[]> = null;
  viewers: Nullable<User[]> = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1))
      .subscribe({
        next: (data: Data) => {
          const project: Nullable<Project> = data['project'] || null;
          this.project = project;
          this.project?.reports.sort((reportA, reportB) => reportA.sequenceNumber - reportB.sequenceNumber);

          if (project !== null) {
            this.contributors = [];
            this.viewers = [];

            this.contributors.push(
              ...project.members
                .filter((member) => member.role === ProjectRole.Contributor)
                .map((member) => member.user),
              project.owner,
            );
            this.viewers.push(
              ...project.members
                .filter((member) => member.role === ProjectRole.Viewer)
                .map((member) => member.user),
            );
          }
        }
      });
  }

  openViewerDialog(): void {
    const dialogRef = this.dialog.open(
      InviteProjectMemberDialogComponent,
      {
        data: {
          role: ProjectRole.Viewer,
        },
        width: '400px',
      },
    );

    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      console.log(result);
    });
  }

  openContributorDialog(): void {
    const dialogRef = this.dialog.open(
      InviteProjectMemberDialogComponent,
      {
        data: {
          role: ProjectRole.Contributor,
        },
        width: '400px',
      },
    );

    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      console.log(result);
    });
  }
}
