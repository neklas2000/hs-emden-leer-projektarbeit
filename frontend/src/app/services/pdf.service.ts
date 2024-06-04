import { Injectable } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';

import { ProjectReportContent, ProjectReportSchema } from '@PdfSchemas/project-report.schema';
import { Nullable, Undefinable } from '@Types';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private backgroundDataUri: Nullable<string> = null;

  constructor(
    private readonly reportSchema: ProjectReportSchema
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

  generateProjectReport(content: ProjectReportContent): void {
    this.reportSchema.populate(this.getBackground(), content)
      .then((documentDefinitions) => {
        const isoDate = (new Date(content.reportDate)).toLocaleString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split('.').reverse().join('-');

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
