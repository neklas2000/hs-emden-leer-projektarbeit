import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Data, Router, RouterModule } from '@angular/router';

import { take } from 'rxjs';

import {
  MilestoneTrendAnalysisChartComponent
} from '@Components/milestone-trend-analysis-chart/milestone-trend-analysis-chart.component';
import {
  ConfirmMilestoneDeletionComponent
} from '@Dialogs/confirm-milestone-deletion/confirm-milestone-deletion.component';
import {
  CreateNewMilestoneComponent
} from '@Dialogs/create-new-milestone/create-new-milestone.component';
import {
  ConfirmProjectDeletionComponent
} from '@Dialogs/confirm-project-deletion/confirm-project-deletion.component';
import {
  ConfirmProjectMemberRemovalComponent
} from '@Dialogs/confirm-project-member-removal/confirm-project-member-removal.component';
import {
  InviteProjectMemberComponent
} from '@Dialogs/invite-project-member/invite-project-member.component';
import { Project } from '@Models/project';
import { ProjectMember, ProjectRole } from '@Models/project-member';
import { ProjectMilestone } from '@Models/project-milestone';
import { FullTitleNamePipe } from '@Pipes/full-title-name.pipe';
import { AuthenticationService } from '@Services/authentication.service';
import { DialogService } from '@Services/dialog.service';
import { ProjectService } from '@Services/project.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { DeepPartial, Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';

@Component({
  selector: 'hsel-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FullTitleNamePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MilestoneTrendAnalysisChartComponent,
    RouterModule,
  ],
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('chart') private readonly chart!: MilestoneTrendAnalysisChartComponent;
  project!: Project; // Will be initialized inside #ngOnInit
  contributors: ProjectMember[] = [];
  viewers: ProjectMember[] = [];
  userId!: string; // Will be initialized inside #ngOnInit

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialog: DialogService,
    private readonly projectMilestones: ProjectMilestoneService,
    private readonly projectMembers: ProjectMemberService,
    private readonly snackbar: SnackbarService,
    private readonly auth: AuthenticationService,
    private readonly projects: ProjectService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = this.auth.getUser()!;

    this.activatedRoute.data.pipe(take(1))
      .subscribe({
        next: ({ project }: Data) => {

          this.project = project;
          this.project.reports.sort((reportA, reportB) => reportA.sequenceNumber - reportB.sequenceNumber);

          if (project !== null) {
            this.contributors = [];
            this.viewers = [];

            this.contributors.push(
              ...this.project.members
                .filter((member) => member.role === ProjectRole.Contributor),
            );
            this.viewers.push(
              ...this.project.members
                .filter((member) => member.role === ProjectRole.Viewer),
            );
          }
        }
      });
  }

  inviteStudent(): void {
    const dialogRef = this.dialog.open(InviteProjectMemberComponent, {
      data: {
        role: ProjectRole.Contributor,
      },
    });

    dialogRef.afterClosed().pipe(take(1))
      .subscribe((result: Nullable<DeepPartial<ProjectMember>>) => {
        if (!result) {
          this.snackbar.showInfo(SnackbarMessage.CANCELED);
        } else if (result.user!.id === this.project.owner.id) {
          this.snackbar.showWarning('Sie können sich nicht selber einladen');
        } else {
          this.addProjectMember(result);
        }
      });
  }

  inviteCompanion(): void {
    const dialogRef = this.dialog.open(InviteProjectMemberComponent, {
      data: {
        role: ProjectRole.Viewer,
      },
    });

    dialogRef.afterClosed().pipe(take(1))
      .subscribe((result: Nullable<DeepPartial<ProjectMember>>) => {
        if (!result) {
          this.snackbar.showInfo(SnackbarMessage.CANCELED);
        } else if (result.user!.id === this.project.owner.id) {
          this.snackbar.showWarning('Sie können sich nicht selber einladen');
        } else {
          this.addProjectMember(result);
        }
      });
  }

  private addProjectMember(member: DeepPartial<ProjectMember>): void {
    member.project = {
      id: this.project.id,
    };

    this.projectMembers.create('', member).pipe(take(1)).subscribe({
      next: (createdMember) => {
        this.snackbar.showInfo('Mitglied erfolgreich hinzugefügt');
        this.project.members.push(createdMember);

        if (createdMember.role === ProjectRole.Contributor) {
          this.contributors.push(createdMember);
        } else {
          this.viewers.push(createdMember);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
      },
    });
  }

  onNewMilestoneClick(): void {
    const dialogRef = this.dialog.open(CreateNewMilestoneComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: Nullable<ProjectMilestone>) => {
      if (!result) {
        this.snackbar.showInfo(SnackbarMessage.CANCELED);
      } else {
        this.saveNewMilestone(result);
      }
    });
  }

  private saveNewMilestone(milestone: ProjectMilestone): void {
    this.projectMilestones.create('', {
      ...milestone,
      project: {
        id: this.project.id,
      },
    }).pipe(take(1)).subscribe({
      next: (createdMilestone) => {
        this.project.milestones.push(createdMilestone);
        this.snackbar.showInfo('Meilenstein erfolgreich hinzugefügt');
        this.chart.refresh();
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
      },
    });
  }

  getNextSequenceNumber(): number {
    if (!this.project || this.project.reports.length === 0) return 1;

    return this.project.reports[this.project.reports.length - 1].sequenceNumber + 1;
  }

  deleteMilestone(index: number): void {
    const dialogRef = this.dialog.open(ConfirmMilestoneDeletionComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deleteMilestonePermanently(this.project.milestones[index].id, index);
      } else {
        this.snackbar.showInfo(SnackbarMessage.CANCELED);
      }
    });
  }

  private deleteMilestonePermanently(milestoneId: string, index: number): void {
    this.projectMilestones.delete(':id', milestoneId).pipe(take(1)).subscribe({
      next: (deletionSuccessful) => {
        if (deletionSuccessful) {
          this.project.milestones.splice(index, 1);
          this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
        } else {
          this.snackbar.showWarning(SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.DELETE_OPERATION_FAILED, exception);
      },
    });
  }

  moveToCompanions(id: string): void {
    const member = { ...this.project.members.find((member) => member.id === id)! };
    member.role = ProjectRole.Viewer;
    this.updateProjectMemberRole(member);
  }

  moveToStudents(id: string): void {
    const member = { ...this.project.members.find((member) => member.id === id)! };
    member.role = ProjectRole.Contributor;
    this.updateProjectMemberRole(member);
  }

  private updateProjectMemberRole(member: ProjectMember): void {
    this.projectMembers.update(':id', member.id, member).pipe(take(1)).subscribe({
      next: (updatedSuccessfully) => {
        if (updatedSuccessfully) {
          if (member.role === ProjectRole.Contributor) {
            this.contributors.push(member);
            this.viewers = this.viewers.filter((viewer) => viewer.id !== member.id);
            this.snackbar.showInfo('Erfolgreich zu einen Studierenden umgewandelt');
          } else {
            this.viewers.push(member);
            this.contributors = this.contributors.filter((contributor) => contributor.id !== member.id);
            this.snackbar.showInfo('Erfolgreich zu einen Betreuer umgewandelt');
          }
        } else {
          this.snackbar.showWarning(SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
      },
    });
  }

  removeStudent(id: string): void {
    const dialogRef = this.dialog.open(ConfirmProjectMemberRemovalComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deleteProjectMemberPermanently(id, ProjectRole.Contributor);
      } else {
        this.snackbar.showInfo(SnackbarMessage.CANCELED);
      }
    });
  }

  removeCompanion(id: string): void {
    const dialogRef = this.dialog.open(ConfirmProjectMemberRemovalComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.deleteProjectMemberPermanently(id, ProjectRole.Viewer);
      } else {
        this.snackbar.showInfo(SnackbarMessage.CANCELED);
      }
    });
  }

  private deleteProjectMemberPermanently(memberId: string, role: ProjectRole): void {
    this.projectMembers.delete(':id', memberId).pipe(take(1)).subscribe({
      next: (deletionSuccessful) => {
        if (deletionSuccessful) {
          if (role === ProjectRole.Contributor) {
            this.contributors = this.contributors.filter((contributor) => {
              return contributor.id !== memberId;
            });
          } else {
            this.viewers = this.viewers.filter((viewer) => {
              return viewer.id !== memberId;
            });
          }

          this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
        } else {
          this.snackbar.showWarning(SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.DELETE_OPERATION_FAILED, exception);
      },
    });
  }

  deleteProject(): void {
    const dialogRef = this.dialog.open(ConfirmProjectDeletionComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((shouldDelete) => {
      if (shouldDelete) {
        this.deleteProjectPermanently();
      } else {
        this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_CANCELED);
      }
    });
  }

  private deleteProjectPermanently(): void {
    this.projects.delete(':id', this.project.id).pipe(take(1)).subscribe({
      next: (deletionSuccessful) => {
        if (deletionSuccessful) {
          this.snackbar.showInfo(SnackbarMessage.DELETE_OPERATION_SUCCEEDED);
          this.router.navigateByUrl('/projects');
        } else {
          this.snackbar.showWarning(SnackbarMessage.DELETE_OPERATION_FAILED_CONFIRMATION);
        }
      },
      error: (exception: HttpException) => {
        this.snackbar.showException(SnackbarMessage.DELETE_OPERATION_FAILED, exception);
      },
    });
  }
}
