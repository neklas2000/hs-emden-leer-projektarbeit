import { provideHttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { PdfService } from '@Services/pdf.service';
import { PdfMakeProviderService } from '@Services/pdf-make-provider.service';
import { SnackbarService } from '@Services/snackbar.service';
import { UtilityProviderService } from '@Services/utility-provider.service';
import { ProjectReportSchema } from '@PdfSchemas/project-report.schema';

const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ij8qz0AAAAASUVORK5CYII';

class UtilityProviderServiceStub {
  get toBase64() {
    return () => {
      return of(base64Data);
    };
  }
}

describe('Service: PdfService', () => {
  let service: PdfService;
  let pdfMake: PdfMakeProviderService;
  let schema: ProjectReportSchema;
  let snackbar: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        PdfMakeProviderService,
        {
          provide: UtilityProviderService,
          useClass: UtilityProviderServiceStub,
        },
        ProjectReportSchema,
        SnackbarService,
        provideMarkdown(),
        provideAnimations(),
      ],
    });

    service = TestBed.inject(PdfService);
    pdfMake = TestBed.inject(PdfMakeProviderService);
    schema = TestBed.inject(ProjectReportSchema);
    snackbar = TestBed.inject(SnackbarService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('generateProjectReport(ProjectReportContent): void', () => {
    it('should throw an error while populating the pdf schema', fakeAsync(() => {
      spyOn(schema, 'populate').and.rejectWith(new Error());
      spyOn(snackbar, 'showError');
      const pdfMakeCreatePdfSpy = spyOnProperty(pdfMake, 'createPdf', 'get');

      service.generateProjectReport({} as any);
      tick();

      expect(schema.populate).toHaveBeenCalled();
      expect(pdfMakeCreatePdfSpy).not.toHaveBeenCalled();
      expect(snackbar.showError).toHaveBeenCalledWith('Das PDF Dokument konnte nicht erstellt werden (HSEL-400-999)');
    }));

    it('should generate a pdf document without a background', () => {
      const schemaPopulateSpy = spyOn(schema, 'populate').and.returnValue(
        Promise.resolve({ content: [] }),
      );
      spyOnProperty(pdfMake, 'createPdf', 'get').and.returnValue(
        jasmine.createSpy().and.returnValue({
          download: jasmine.createSpy(),
        }),
      );

      service.generateProjectReport({
        reportDate: '2024-01-01',
        projectTitle: 'Test',
      } as any);

      expect(schema.populate).toHaveBeenCalled();
      expect(schemaPopulateSpy.calls.argsFor(0)[0]).toBeUndefined();
    });

    it('should generate a pdf document with a background', () => {
      const schemaPopulateSpy = spyOn(schema, 'populate').and.returnValue(
        Promise.resolve({ content: [] }),
      );
      spyOnProperty(pdfMake, 'createPdf', 'get').and.returnValue(
        jasmine.createSpy().and.returnValue({
          download: jasmine.createSpy(),
        }),
      );
      service['backgroundDataUri'] = base64Data;

      service.generateProjectReport({
        reportDate: '2024-01-01',
        projectTitle: 'Test',
      } as any);

      expect(schema.populate).toHaveBeenCalled();
      const firstArg = schemaPopulateSpy.calls.argsFor(0)[0] as any;
      expect(firstArg).toEqual([{
        image: base64Data,
        width: 595,
        height: 842,
        absolutePosition: {
          x: 0,
          y: 0,
        },
      }]);
    });
  });
});
