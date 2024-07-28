import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';

import { ZONE } from '@Constants';
import { ProjectReportContent, ProjectReportSchema } from '@PdfSchemas/project-report.schema';
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
  private backgroundDataUri: Nullable<string> = null;

  constructor(
    private readonly reportSchema: ProjectReportSchema,
  ) {
    (async () => {
      const response = await fetch('../../assets/background.png');
      const blobData = await response.blob();

      this.backgroundDataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          let result: Nullable<string> = null;

          if (!(reader.result instanceof ArrayBuffer)) {
            result = reader.result;
          }

          resolve(result);
        };

        reader.onerror = (err) => {
          reject(new Error('An error occurred while loading the pdf background.', { cause: err }));
        };

        reader.readAsDataURL(blobData);
      });
    })();
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

        pdfMake.createPdf(documentDefinitions, undefined, undefined, pdfFonts.pdfMake.vfs)
          .download(`MTA-Report_${isoDate}_${content.projectTitle.replaceAll(' ', '')}.pdf`);
      })
      .catch((err) => {
        console.error(err);
      });
	}

  private getBackground(): Undefinable<Content> {
    return (this.backgroundDataUri ? [{
      image: this.backgroundDataUri,
      width: 595,
      height: 842,
      absolutePosition: {
        x: 0,
        y: 0,
      },
    }] : undefined);
  }
}
