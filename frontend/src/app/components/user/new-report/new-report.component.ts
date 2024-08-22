import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { take } from 'rxjs';

import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';
import { DateService } from '@Services/date.service';
import { ProjectReportService } from '@Services/project-report.service';
import { SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';
import { Nullable } from '@Types';
import { HttpException } from '@Utils/http-exception';
import { FormValidators } from '@Validators';

type State = {
  sequenceNumber?: number;
  [key: string]: any;
};

@Component({
  selector: 'hsel-new-report',
  templateUrl: './new-report.component.html',
  styleUrl: './new-report.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownEditorComponent,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class NewReportComponent implements OnInit {
  private projectId!: Nullable<string>;
  form: FormGroup = this.formBuilder.group({
    sequenceNumber: [null, [FormValidators.required, FormValidators.min(1)]],
    reportDate: [this.date.getToday(), [FormValidators.required]],
  });
  deliverables = '';
  hazards = '';
  objectives = '';
  other: Nullable<string> = '';
  private window: Window;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly projectReports: ProjectReportService,
    private readonly date: DateService,
    private readonly snackbar: SnackbarService,
    private readonly windowProvider: WindowProviderService,
  ) {
    this.window = this.windowProvider.getWindow();
  }

  ngOnInit(): void {
    const { sequenceNumber }: State = this.window.history.state;

    if (sequenceNumber) {
      this.form.patchValue({ sequenceNumber });
    }

    this.activatedRoute.paramMap.pipe(take(1)).subscribe((paramMap: ParamMap) => {
      this.projectId = paramMap.get('projectId');
    });
  }

  onCancelClick(): void {
    this.window.history.back();
  }

  onSaveClick(): void {
    this.projectReports.create('', {
      sequenceNumber: this.form.get('sequenceNumber')?.value!,
      reportDate: this.form.get('reportDate')?.value.toFormat('yyyy-MM-dd'),
      deliverables: this.deliverables,
      hazards: this.hazards,
      objectives: this.objectives,
      other: this.other,
      ...(
        this.projectId ? {
          project: {
            id: this.projectId,
          },
        } : {}
      ),
    }).pipe(take(1)).subscribe({
      next: (projectReport) => {
        this.snackbar.open('Erfolgreich gespeichert');
        this.router.navigateByUrl(`/projects/${projectReport.project?.id}/report/${projectReport.id}`);
      },
      error: (exception: HttpException) => {
        this.snackbar.showException('Speichervorgang fehlgeschlagen', exception);
      },
    });
  }

  get invalid(): boolean {
    if (!this.form.get('sequenceNumber')?.value) return true;
    if (!this.form.get('reportDate')?.value) return true;
    if (!this.deliverables) return true;
    if (!this.hazards) return true;
    if (!this.objectives) return true;

    return false;
  }
}
