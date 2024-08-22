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

  describe('populate(Undefinable<DynamicBackground | Content>, ProjectReportContent): Promise<TDocumentDefinitions>', () => {
    it('should create the document definition', (done) => {
      schema.populate(undefined, {
        projectTitle: 'Test',
        reportStart: '2024-01-01',
        reportEnd: '2024-01-29',
        sequenceNumber: 1,
        reportDate: '2024-01-01',
        reportInterval: 7,
        projectType: 'Softwareproject',
        students: [{
          academicTitle: 'B. Sc.',
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max.mustermann@gmx.de',
          phoneNumber: '+49 1234 1234567890',
          matriculationNumber: 1234567,
        }, {
          academicTitle: null,
          firstName: 'Gustav',
          lastName: 'Mustermann',
          email: 'gustav.mustermann@gmx.de',
          phoneNumber: null,
          matriculationNumber: null,
        }],
        companions: [{
          academicTitle: 'Prof.',
          firstName: 'Herbert',
          lastName: 'Mustermann',
          email: 'herbert.mustermann@gmx.de',
          phoneNumber: '+49 1234 1234567890',
        }, {
          academicTitle: null,
          firstName: 'Maria',
          lastName: 'Mustermann',
          email: 'maria.mustermann@gmx.de',
          phoneNumber: null,
        }],
        deliverables: '### These are the deliverables',
        hazards: '### These are the hazards',
        objectives: '### These are the objectives',
        other: '### This is all the other information',
        milestoneTrendAnalysis: '',
      }).then((docDefinitions) => {
        expect((<any>docDefinitions.content)[0].table.body[1][1].text).toEqual('01.01.2024 - 29.01.2024');
        expect((<any>docDefinitions.content)[0].table.body[2][6].text).toEqual('Softwareproject');

        done();
      });
    });

    it('should create the document definition with a fallback project type and project end', (done) => {
      schema.populate(undefined, {
        projectTitle: 'Test',
        reportStart: '2024-01-01',
        reportEnd: null,
        sequenceNumber: 1,
        reportDate: '2024-01-01',
        reportInterval: 7,
        projectType: null,
        students: [],
        companions: [],
        deliverables: '### These are the deliverables',
        hazards: '### These are the hazards',
        objectives: '### These are the objectives',
        other: '',
        milestoneTrendAnalysis: '',
      }).then((docDefinitions) => {
        expect((<any>docDefinitions.content)[0].table.body[1][1].text).toEqual('01.01.2024 - TBA');
        expect((<any>docDefinitions.content)[0].table.body[2][6].text).toEqual('');

        done();
      });
    });
  });
});
