import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { MarkdownPipe } from 'ngx-markdown';
import { take } from 'rxjs';

import { ProjectReport } from '@Models/project-report';
import { ProjectRole } from '@Models/project-member';
import { PdfService } from '@Services/pdf.service';
import { SnackbarService } from '@Services/snackbar.service';
import { Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';
import { AgChartService } from '@Services/ag-chart.service';
import { ProjectService } from '@Services/project.service';

@Component({
  selector: 'hsel-report-details',
  standalone: true,
  imports: [
    MarkdownPipe,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss'
})
export class ReportDetailsComponent implements OnInit {
  projectReport: Nullable<ProjectReport> = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly agChart: AgChartService,
    private readonly pdf: PdfService,
    private readonly projects: ProjectService,
    private readonly snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(take(1))
      .subscribe({
        next: (data: Data) => {
          this.projectReport = data['report'] || null;
        }
      });
  }

  downloadPdf(): void {
    if (!this.projectReport) {
      this.snackbar.open('PDF kann nicht erstellt werden');

      return;
    }

    const project$ = this.projects.read({
      route: ':id',
      ids: this.projectReport.project?.id,
      query:       {
        includes: ['owner', 'members', 'members.user', 'milestones', 'milestones.estimates'],
        sparseFieldsets: {
          members: ['id', 'role'],
          'members.user': ['id', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
          milestones: ['id', 'name'],
        },
      },
    });

    project$.pipe(take(1)).subscribe({
      next: (project) => {
        if (!project) {
          this.snackbar.open('PDF kann nicht erstellt werden');

          return;
        }

        this.agChart.defineOptions({
          start: project.officialStart!,
          end: project.officialEnd,
          milestones: project.milestones,
          interval: project.reportInterval,
        });

        this.agChart.dataUri$
          .then((milestoneTrendAnalysisChart) => {
            this.pdf.generateProjectReport({
              companions: project.members
                .filter((member) => member.role === ProjectRole.Viewer)
                .map((member) => member.user),
              deliverables: this.projectReport?.deliverables ?? '',
              hazards: this.projectReport?.hazards ?? '',
              objectives: this.projectReport?.objectives ?? '',
              other: this.projectReport?.other ?? '',
              projectTitle: project.name,
              projectType: project.type,
              reportDate: this.projectReport?.reportDate ?? '',
              reportEnd: project.officialEnd ?? '',
              reportInterval: project.reportInterval,
              reportStart: project.officialStart!,
              sequenceNumber: this.projectReport?.sequenceNumber ?? NaN,
              students: project.members
                .filter((member) => member.role === ProjectRole.Contributor)
                .map((member) => member.user).concat(project.owner),
              milestoneTrendAnalysis: milestoneTrendAnalysisChart,
            });
          })
          .catch((_) => {
            this.snackbar.open('MTA Diagramm konnte nicht erzeugt werden');
          });
      },
      error: (exception: HttpException) => {
        this.snackbar.showException('Daten konnten nicht geladen werden', exception);
      }
    })
  }
}
