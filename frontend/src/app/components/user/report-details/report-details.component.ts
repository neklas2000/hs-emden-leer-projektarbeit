import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { take } from 'rxjs';

import { Nullable } from '../../../types/nullable';
import { ProjectReport } from '../../../models/project-report';
import { MarkdownEditorComponent } from '../../markdown-editor/markdown-editor.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MarkdownPipe } from 'ngx-markdown';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [
    MarkdownPipe,
    CommonModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss'
})
export class ReportDetailsComponent implements OnInit {
  projectReport: Nullable<ProjectReport> = null;

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1))
      .subscribe({
        next: (data: Data) => {
          this.projectReport = data['report'] || null;
        }
      });
  }
}
