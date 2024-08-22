import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';
import { Content } from 'pdfmake/interfaces';
import { switchMap, take } from 'rxjs';

import { ZONE } from '@Constants';
import { ProjectReportContent, ProjectReportSchema } from '@PdfSchemas/project-report.schema';
import { PdfMakeProviderService } from '@Services/pdf-make-provider.service';
import { SnackbarService } from '@Services/snackbar.service';
import { UtilityProviderService } from '@Services/utility-provider.service';
import { Nullable, Undefinable } from '@Types';

/**
 * @description
 * This service provides to possibility to generate pdf documents by a predefined schema and it
 * downloads the generated pdf automatically. Once the singleton is instantiated, a watermark for
 * the pdfs is preloaded and made available for future pdf creations. That watermark can then be
 * provided as a background of the pdf.
 */
@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private backgroundDataUri: Undefinable<Nullable<string>> = null;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly pdfMake: PdfMakeProviderService,
    private readonly utility: UtilityProviderService,
    private readonly reportSchema: ProjectReportSchema,
    private readonly snackbar: SnackbarService,
  ) {
    this.httpClient.get('/assets/background.png', { responseType: 'blob' })
      .pipe(take(1), switchMap(this.utility.toBase64))
      .subscribe((base64) => {
        this.backgroundDataUri = base64;
      });
  }

  /**
   * @description
   * This function generates a pdf document based on a predefined schema and this schema will be
   * populated with the data, provided by the argument `content`. After the document was
   * successfully generated the pdf will be downloaded automatically.
   *
   * @param content The data which will be rendered within the pdf document.
   */
  generateProjectReport(content: ProjectReportContent): void {
    this.reportSchema.populate(this.getBackground(), content)
      .then((documentDefinitions) => {
        const isoDate = DateTime.fromSQL(content.reportDate).setZone(ZONE).toFormat('yyyy-MM-dd');

        this.pdfMake.createPdf(documentDefinitions, undefined, undefined, this.pdfMake.fonts)
          .download(`MTA-Report_${isoDate}_${content.projectTitle.replaceAll(' ', '')}.pdf`);
      })
      .catch((err) => {
        this.snackbar.showError('Das PDF Dokument konnte nicht erstellt werden (HSEL-400-999)');
      });
	}

  private getBackground(): Undefinable<Content> {
    if (this.backgroundDataUri) {
      return [{
        image: this.backgroundDataUri,
        width: 595,
        height: 842,
        absolutePosition: {
          x: 0,
          y: 0,
        },
      }];
    }

    return undefined;
  }
}
