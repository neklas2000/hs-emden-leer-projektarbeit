import { TestBed } from '@angular/core/testing';

import { provideMarkdown } from 'ngx-markdown';

import { ProjectReportSchema } from './project-report.schema';

describe('PdfSchema: ProjectReportSchema', () => {
  let schema: ProjectReportSchema;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideMarkdown(),
      ],
    });

    schema = TestBed.inject(ProjectReportSchema);
  });

  it('should be created', () => {
    expect(schema).toBeTruthy();
  });
});
