import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MarkdownPipe } from 'ngx-markdown';
import { take } from 'rxjs';

import { Nullable } from '../../../types/nullable';
import { ProjectReport } from '../../../models/project-report';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChartService } from '../../../services/chart.service';
import { PdfService } from '../../../services/pdf.service';
import { JsonApiDatastore } from '../../../services/json-api-datastore.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Project } from '../../../models/project';
import { ProjectRole } from '../../../models/project-member';
import { HttpException } from '../../../types/http-exception';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-report-details',
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
    private readonly apexChart: ChartService,
    private readonly pdf: PdfService,
    private readonly jsonApiDatastore: JsonApiDatastore,
    private readonly snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1))
      .subscribe({
        next: (data: Data) => {
          this.projectReport = data['report'] || null;
        }
      });
  }

  downloadPdf(): void {
    const project$ = this.jsonApiDatastore.load<Project>(
      Project,
      this.projectReport?.project?.id || null,
      {
        includes: ['owner', 'members', 'members.user', 'milestones', 'milestones.estimates'],
        sparseFieldsets: {
          members: ['id', 'role'],
          'members.user': ['id', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
          milestones: ['id', 'name'],
        },
      },
    );

    if (!project$ || !this.projectReport) {
      this.snackbar.open('PDF kann nicht erstellt werden');

      return;
    }

    project$.pipe(take(1)).subscribe({
      next: (project) => {
        this.apexChart.defineOptions({
          start: project.officialStart,
          end: project.officialEnd,
          milestones: project.milestones,
          interval: project.reportInterval,
          chartWidth: 1000,
        });

        this.apexChart.dataUri$
          .then((svgImage) => {
            this.pdf.generateProjectReport({
              companions: project.members
                .filter((member) => member.role === ProjectRole.Viewer)
                .map((member) => member.user),
              deliverables: this.projectReport?.deliverables || '',
              hazards: this.projectReport?.hazards || '',
              objectives: this.projectReport?.objectives || '',
              other: this.projectReport?.other || '',
              projectTitle: project.name,
              projectType: project.type,
              reportDate: this.projectReport?.reportDate || '',
              reportEnd: project.officialEnd || '',
              reportInterval: project.reportInterval,
              reportStart: project.officialStart,
              sequenceNumber: this.projectReport?.sequenceNumber || NaN,
              students: project.members
                .filter((member) => member.role === ProjectRole.Contributor)
                .map((member) => member.user).concat(project.owner),
              milestoneTrendAnalysis: svgImage,
            });
          })
          .catch((err) => {
            this.snackbar.open('MTA Diagramm kann nicht erzeugt werden');
          });
      },
      error: (exception: HttpException) => {
        console.log(exception);
      }
    })
  }
}
