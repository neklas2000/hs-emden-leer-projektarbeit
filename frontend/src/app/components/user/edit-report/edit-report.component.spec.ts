import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { MarkdownService, provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { EditReportComponent } from './edit-report.component';
import { SnackbarService } from '@Services/snackbar.service';
import { ProjectReportService } from '@Services/project-report.service';
import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';

describe('Component: EditReportComponent', () => {
  let component: EditReportComponent;
  let fixture: ComponentFixture<EditReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditReportComponent,
        MarkdownEditorComponent,
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              report: null,
            }),
          },
        },
        SnackbarService,
        ProjectReportService,
        provideHttpClient(),
        MarkdownService,
        provideMarkdown(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
