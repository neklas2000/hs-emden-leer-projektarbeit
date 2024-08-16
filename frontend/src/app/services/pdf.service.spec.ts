import { TestBed } from '@angular/core/testing';

import { provideMarkdown } from 'ngx-markdown';

import { PdfService } from '@Services/pdf.service';

describe('Service: PdfService', () => {
  let service: PdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMarkdown(),
      ],
    });

    service = TestBed.inject(PdfService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
