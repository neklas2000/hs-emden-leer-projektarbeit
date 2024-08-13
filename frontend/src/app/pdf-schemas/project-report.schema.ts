import { Injectable } from '@angular/core';

import htmlToPdfmake from 'html-to-pdfmake';
import { DateTime } from 'luxon';
import { MarkdownService } from 'ngx-markdown';
import { Content, DynamicBackground, TDocumentDefinitions } from 'pdfmake/interfaces';

import { parseCheckbox } from './parse-checkbox';
import { PdfSchema } from './pdf-schema';
import { Nullable } from '@Types';

/**
 * @description
 * This type represents the required data to generate a pdf of a project report.
 */
export type ProjectReportContent<E = string> = {
  projectTitle: string;
  reportStart: string;
  reportEnd: Nullable<string>;
  sequenceNumber: number;
  reportDate: string;
  reportInterval: number;
  projectType: Nullable<string>;
  /**
   * User with role 'Contributor'
   */
  students: any[];
  /**
   * User with role 'Viewer'
   */
  companions: any[];
  deliverables: E;
  hazards: E;
  objectives: E;
  other: E;
  milestoneTrendAnalysis: string;
};

/**
 * @description
 * This schema represents the pdf document definition to generate a pdf from a project report.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectReportSchema implements PdfSchema<ProjectReportContent> {
  constructor(private readonly markdownService: MarkdownService) {}

  /**
   * @description
   * This function populates the document definition with the required data, in order to generate
   * a populated pdf document.
   *
   * @param background An optional background to be included in the pdf document.
   * @param reportContent The required data used to populate the document definition.
   * @returns The populated document definition, ready to be downloaded as a pdf document.
   */
	async populate(
		background: DynamicBackground | Content | undefined,
		reportContent: ProjectReportContent
	): Promise<TDocumentDefinitions> {
    const deliverablesHtml = await this.markdownService.parse(reportContent.deliverables);
    const hazardsHtml = await this.markdownService.parse(reportContent.hazards);
    const objectivesHtml = await this.markdownService.parse(reportContent.objectives);
    const otherHtml = await this.markdownService.parse(reportContent.other);

    const content: ProjectReportContent<Content> = {
      ...reportContent,
      deliverables: parseCheckbox(htmlToPdfmake(deliverablesHtml)),
      hazards: parseCheckbox(htmlToPdfmake(hazardsHtml)),
      objectives: parseCheckbox(htmlToPdfmake(objectivesHtml)),
      other: parseCheckbox(htmlToPdfmake(otherHtml)),
    };

		return {
			background,
			pageMargins: [ 40, 90, 40, 40 ],
			header: [{
				text: '- Projektbericht -',
				alignment: 'center',
				margin: [ 0, 30, 0, 0 ]
			}],
			content: [
				{
					fontSize: 10,
					table: {
						widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
						body: [[{
							text: 'Projekt:',
							bold: true,
							border: [false, false, false, false],
							alignment: 'right'
						}, {
							text: content.projectTitle,
							color: 'red',
							bold: true,
							border: [false, false, false, false],
							colSpan: 6
						}, { }, { }, { }, { }, { }], [{
							text: 'Berichtszeitraum:',
							bold: true,
							border: [false, false, false, false],
							alignment: 'right'
						}, {
							text: this.getReportPeriod(content.reportStart, content.reportEnd),
							color: 'red',
							border: [true, true, false, false],
							colSpan: 2
						}, { }, {
							text: 'Folgenummer:',
							bold: true,
							alignment: 'right',
							border: [false, true, false, false]
						}, {
							text: content.sequenceNumber,
							border: [false, true, false, false]
						}, {
							text: 'Datum:',
							bold: true,
							alignment: 'right',
							border: [false, true, false, false]
						}, {
							text: DateTime.fromSQL(content.reportDate).toFormat('dd.MM.yyyy'),
							bold: true,
							border: [false, true, true, false]
						}], [{
							text: 'Intervall (Tage):',
							bold: true,
							border: [false, false, false, false],
							alignment: 'right'
						}, {
							text: content.reportInterval,
							border: [true, false, false, true],
							colSpan: 4
						}, { }, { }, { }, {
							text: 'Projekttyp:',
							bold: true,
							alignment: 'right',
							border: [false, false, false, true]
						}, {
							text: content.projectType ?? '',
							border: [false, false, true, true]
						}]]
					}
				},
				{
					marginTop: 12,
					fontSize: 10,
					table: {
						body: [[{
							text: 'Studierende:',
							bold: true,
							border: [false, false, false, false]
						}]]
					}
				},
				{
					fontSize: 10,
					table: {
						widths: ['auto', '*', 'auto', 'auto'],
						headerRows: 1,
						body: [[{
							text: 'Name',
							bold: true
						}, {
							text: 'E-Mail-Adresse',
							bold: true
						}, {
							text: 'Telefonnummer',
							bold: true
						}, {
							text: 'Matrikelnummer',
							bold: true
						}],
						...content.students.map((student, idx, arr) => {
							const row = [];
							row.push({ text: `${student.firstName} ${student.lastName}` });
							row.push({ text: student.email });
							row.push({ text: student.phoneNumber ?? '' });
							row.push({ text: student.matriculationNumber ?? '' });

							return row;
						}, [])]
					}
				},
				{
					marginTop: 12,
					fontSize: 10,
					table: {
						body: [[{
							text: 'Begleiter:',
							bold: true,
							border: [false, false, false, false]
						}]]
					}
				},
				{
					fontSize: 10,
					table: {
						widths: ['auto', '*', 'auto'],
						headerRows: 1,
						body: [[{
							text: 'Name',
							bold: true
						}, {
							text: 'E-Mail-Adresse',
							bold: true
						}, {
							text: 'Telefonnummer',
							bold: true
						}],
						...content.companions.map((companion, idx, arr) => {
							const row = [];
              const name = [];

              if (companion.academicTitle) name.push(companion.academicTitle);
              name.push(companion.firstName, companion.lastName);

							row.push({ text: name.join(' ') });
							row.push({ text: companion.email });
							row.push({ text: companion.phoneNumber ?? '' });

							return row;
						}, [])]
					}
				},
				{
					marginTop: 12,
					fontSize: 10,
					table: {
            widths: ['*'],
						body: [[{
							text: 'Ergebnisse:',
							bold: true,
							border: [false, false, false, false]
						}], [content.deliverables], [{
							text: ' ',
							border: [false, false, false, false],
							fontSize: 8
						}], [{
							text: 'Risiken:',
							bold: true,
							border: [false, false, false, false]
						}], [content.hazards], [{
							text: ' ',
							border: [false, false, false, false],
							fontSize: 8
						}], [{
							text: 'Ziele:',
							bold: true,
							border: [false, false, false, false]
						}], [content.objectives], [{
							text: ' ',
							border: [false, false, false, false],
							fontSize: 8
						}], [{
							text: 'Sonstiges:',
							bold: true,
							border: [false, false, false, false]
						}], [content.other]],
            dontBreakRows: true
					},
				},
        {
          image: content.milestoneTrendAnalysis,
          width: 515,
        },
			]
		};
	}

	private getReportPeriod(start: string, end: Nullable<string>): string {
		start = DateTime.fromSQL(start).toFormat('dd.MM.yyyy');
		end = end ? DateTime.fromSQL(end).toFormat('dd.MM.yyyy') : 'TBA';

		return `${start} - ${end}`;
	}
}
