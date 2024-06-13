import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { take } from 'rxjs';

import {
  InviteProjectMemberDialogComponent
} from '../../invite-project-member-dialog/invite-project-member-dialog.component';
import {
  MilestoneTrendAnalysisChartComponent
} from '../../milestone-trend-analysis-chart/milestone-trend-analysis-chart.component';
import { Project } from '@Models/project';
import { ProjectMember, ProjectRole } from '@Models/project-member';
import { User } from '@Models/user';
import { MilestoneEstimate } from '@Models/milestone-estimate';
import { DeepPartial, Nullable } from '@Types';
import { NewMilestoneDialogComponent } from '@Components/new-milestone-dialog/new-milestone-dialog.component';
import { DialogService } from '@Services/dialog.service';
import { ProjectMilestone } from '@Models/project-milestone';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { HttpException } from '@Utils/http-exception';
import { ProjectMemberService } from '@Services/project-member.service';

@Component({
  selector: 'hsel-project-details',
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
    MatTooltipModule,
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('chart') private readonly chart!: MilestoneTrendAnalysisChartComponent;
  project: Nullable<Project> = null;
  contributors: Nullable<User[]> = null;
  viewers: Nullable<User[]> = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: DialogService,
    private readonly projectMilestones: ProjectMilestoneService,
    private readonly projectMembers: ProjectMemberService,
    private readonly snackbar: SnackbarService,
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
    const dialogRef = this.dialog.open(InviteProjectMemberDialogComponent, {
      data: {
        role: ProjectRole.Viewer,
      },
    });

    dialogRef.afterClosed().pipe(take(1))
      .subscribe((result: Nullable<DeepPartial<ProjectMember>>) => {
        if (!result) {
          this.snackbar.open(SnackbarMessage.CANCELED);
        } else {
          this.addProjectMember(result);
        }
      });
  }

  openContributorDialog(): void {
    const dialogRef = this.dialog.open(InviteProjectMemberDialogComponent, {
      data: {
        role: ProjectRole.Contributor,
      },
    });

    dialogRef.afterClosed().pipe(take(1))
      .subscribe((result: Nullable<DeepPartial<ProjectMember>>) => {
        if (!result) {
          this.snackbar.open(SnackbarMessage.CANCELED);
        } else {
          this.addProjectMember(result);
        }
      });
  }

  private addProjectMember(member: DeepPartial<ProjectMember>): void {
    member.invitePending = true;
    member.project = this.project!;

    this.projectMembers.create('', member).pipe(take(1)).subscribe({
      next: (createdMember) => {
        this.snackbar.open('Mitglied erfolgreich hinzugefügt');
        this.project!.members.push(createdMember);

        if (createdMember.role === ProjectRole.Contributor) {
          this.contributors?.push(createdMember.user);
        } else {
          this.viewers?.push(createdMember.user);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
      },
    });
  }

  onNewMilestoneClick(): void {
    const dialogRef = this.dialog.open(NewMilestoneDialogComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: Nullable<ProjectMilestone>) => {
      if (!result) {
        this.snackbar.open(SnackbarMessage.CANCELED);
      } else {
        this.saveNewMilestone(result);
      }
    });
  }

  private saveNewMilestone(milestone: ProjectMilestone): void {
    this.projectMilestones.create('', {
      ...milestone,
      project: this.project,
    }).pipe(take(1)).subscribe({
      next: (createdMilestone) => {
        this.project!.milestones.push(createdMilestone);
        this.snackbar.open('Meilenstein erfolgreich hinzugefügt');
        this.chart.refresh();
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
      },
    });
  }

  isMilestoneReached(estimates: MilestoneEstimate[]): boolean {
    return estimates.filter((estimate) => estimate.milestoneReached).length > 0;
  }

  getNextSequenceNumber(): number {
    if (!this.project || this.project.reports.length === 0) return 1;

    return this.project.reports[this.project.reports.length - 1].sequenceNumber + 1;
  }
}
