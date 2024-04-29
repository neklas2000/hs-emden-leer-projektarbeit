import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { take } from 'rxjs';

import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';
import { ProjectReport } from '@Models/project-report';
import { SnackbarService } from '@Services/snackbar.service';
import { ProjectReportService } from '@Services/project-report.service';
import { Nullable, DeepPartial } from '@Types';
import { HttpException } from '@Utils/http-exception';

@Component({
  selector: 'hsel-edit-report',
  standalone: true,
  imports: [
    MarkdownEditorComponent,
    MatCardModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './edit-report.component.html',
  styleUrl: './edit-report.component.scss'
})
export class EditReportComponent implements OnInit {
  projectReport: Nullable<ProjectReport> = null;
  deliverables: string = '';
  objectives: string = '';
  hazards: string = '';
  other: string = '';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectReportService: ProjectReportService,
    private readonly snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(take(1))
      .subscribe(({ report }: Data) => {
        this.projectReport = report;
        this.deliverables = this.projectReport?.deliverables || '';
        this.objectives = this.projectReport?.objectives || '';
        this.hazards = this.projectReport?.hazards || '';
        this.other = this.projectReport?.other || '';
        console.log(this.projectReport);
      });
  }

  save(): void {
    if (!this.projectReport?.id) return;

    const updateResponse$ = this.projectReportService.update<DeepPartial<ProjectReport>>(
      ':id',
      this.projectReport.id,
      {
        deliverables: this.deliverables,
        objectives: this.objectives,
        hazards: this.hazards,
        other: this.other,
      },
    );

    updateResponse$
      .pipe(take(1))
      .subscribe({
        next: (patchSuccessful) => {
          if (patchSuccessful) {
            this.back().then(() => {
              this.snackbar.open('Änderungen gespeichert');
            });
          } else {
            this.snackbar.open('Es ist ein Fehler aufgetreten');
          }
        },
        error: (exception: HttpException) => {
          if (exception.code === 'HSEL-400-002') {
            this.snackbar.open('Erfolg der Änderung konnte nicht verifiziert werden (HSEL-400-002)', 5000);
          } else {
            this.snackbar.open('Es ist ein Fehler aufgetreten');
          }
        },
      });
  }

  cancel(): void {
    this.back();
  }

  back(): Promise<boolean> {
    return this.router.navigateByUrl(window.location.pathname.replace('/edit', ''));
  }
}
