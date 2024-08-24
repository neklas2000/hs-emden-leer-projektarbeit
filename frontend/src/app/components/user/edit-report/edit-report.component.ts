import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { take } from 'rxjs';

import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';
import { ProjectReport } from '@Models/project-report';
import { ProjectReportService } from '@Services/project-report.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { HttpException } from '@Utils/http-exception';

@Component({
  selector: 'hsel-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrl: './edit-report.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MarkdownEditorComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class EditReportComponent implements OnInit {
  projectReport!: ProjectReport; // Will be initialized inside #ngOnInit
  deliverables: string = '';
  objectives: string = '';
  hazards: string = '';
  other: string = '';
  private window: Window;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectReportService: ProjectReportService,
    private readonly snackbar: SnackbarService,
    private readonly windowProvider: WindowProviderService,
  ) {
    this.window = this.windowProvider.getWindow();
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(take(1))
      .subscribe(({ report }: Data) => {
        this.projectReport = report;
        this.deliverables = this.projectReport.deliverables;
        this.objectives = this.projectReport.objectives;
        this.hazards = this.projectReport.hazards;
        this.other = this.projectReport.other ?? '';
      });
  }

  save(): void {
    const updateResponse$ = this.projectReportService.update(
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
              this.snackbar.showInfo(SnackbarMessage.SAVE_OPERATION_SUCCEEDED);
            });
          } else {
            this.snackbar.showWarning(SnackbarMessage.SAVE_OPERATION_FAILED_CONFIRMATION);
          }
        },
        error: (exception: HttpException) => {
          this.snackbar.showException(SnackbarMessage.SAVE_OPERATION_FAILED, exception);
        },
      });
  }

  cancel(): void {
    this.back();
  }

  back(): Promise<boolean> {
    return this.router.navigateByUrl(this.window.location.pathname.replace('/edit', ''));
  }
}
