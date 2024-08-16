import { TestBed } from '@angular/core/testing';

import { provideMarkdown } from 'ngx-markdown';

import { ProjectReportSchema } from '@PdfSchemas/project-report.schema';

describe('PdfSchema: ProjectReportSchema', () => {
  let schema: ProjectReportSchema;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideMarkdown(),
      ],
    });

    schema = TestBed.inject(ProjectReportSchema);
  });

  it('should create', () => {
    expect(schema).toBeTruthy();
  });
});
