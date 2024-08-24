import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideMarkdown } from 'ngx-markdown';
import { of, throwError } from 'rxjs';

import { ReportDetailsComponent } from '@Components/user/report-details/report-details.component';
import { ProjectRole } from '@Models/project-member';
import { AgChartService } from '@Services/ag-chart.service';
import { PdfService } from '@Services/pdf.service';
import { ProjectService } from '@Services/project.service';
import { SnackbarService } from '@Services/snackbar.service';
import { HttpException } from '@Utils/http-exception';

describe('Component: ReportDetailsComponent', () => {
  let component: ReportDetailsComponent;
  let fixture: ComponentFixture<ReportDetailsComponent>;
  let snackbar: SnackbarService;
  let chart: AgChartService;
  let pdf: PdfService;
  let projects: ProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              report: {
                reportDate: '2024-01-01',
                sequenceNumber: 1,
                deliverables: 'Nothing has been done the past week.',
                objectives: 'We plan to accomplish more than the previous week.',
                hazards: 'The typical risk of random sickness stays.',
                other: 'The is nothing else to mention.',
                project: {
                  id: '123',
                },
              },
            }),
          },
        },
        AgChartService,
        PdfService,
        ProjectService,
        provideHttpClient(),
        SnackbarService,
        provideMarkdown(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportDetailsComponent);
    snackbar = TestBed.inject(SnackbarService);
    chart = TestBed.inject(AgChartService);
    pdf = TestBed.inject(PdfService);
    projects = TestBed.inject(ProjectService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('downloadPdf(): void', () => {
    it('should throw an error while reading the project and abort the pdf generation', () => {
      const exception = new HttpException({ error: { code: 'HSEL-404-001' }});
      spyOn(projects, 'read').and.returnValue(throwError(() => exception));
      spyOn(chart, 'defineOptions');
      spyOn(snackbar, 'showException');

      component.downloadPdf();

      expect(projects.read).toHaveBeenCalledWith({
        route: ':id',
        ids: '123',
        query:       {
          includes: ['owner', 'members', 'members.user', 'milestones', 'milestones.estimates'],
          sparseFieldsets: {
            members: ['id', 'role'],
            'members.user': ['id', 'academicTitle', 'firstName', 'lastName', 'matriculationNumber', 'email', 'phoneNumber'],
            milestones: ['id', 'name'],
          },
        },
      });
      expect(chart.defineOptions).not.toHaveBeenCalled();
      expect(snackbar.showException).toHaveBeenCalledWith('Daten konnten nicht geladen werden', exception);
    });

    it('should show an error because no project has been found', () => {
      spyOn(projects, 'read').and.returnValue(of(null));
      spyOn(chart, 'defineOptions');
      spyOn(snackbar, 'showError');

      component.downloadPdf();

      expect(projects.read).toHaveBeenCalled();
      expect(snackbar.showError).toHaveBeenCalledWith('PDF kann nicht erstellt werden');
      expect(chart.defineOptions).not.toHaveBeenCalled();
    });

    it('should define the chart options, but fail to generate the diagram', fakeAsync(() => {
      spyOn(projects, 'read').and.returnValue(of({
        officialStart: '2024-01-01',
        officialEnd: null,
        milestones: [],
        reportInterval: 7,
      }));
      spyOn(chart, 'defineOptions');
      spyOnProperty(chart, 'dataUri$', 'get').and.rejectWith(new Error('Could not generate the diagram'));
      spyOn(snackbar, 'showError');
      spyOn(pdf, 'generateProjectReport');

      component.downloadPdf();
      tick();

      expect(projects.read).toHaveBeenCalled();
      expect(chart.defineOptions).toHaveBeenCalled();
      expect(pdf.generateProjectReport).not.toHaveBeenCalled();
      expect(snackbar.showError).toHaveBeenCalledWith('MTA Diagramm konnte nicht erzeugt werden');
    }));

    it('should define the chart options and generate the pdf document', fakeAsync(() => {
      spyOn(projects, 'read').and.returnValue(of({
        officialStart: '2024-01-01',
        officialEnd: null,
        milestones: [],
        reportInterval: 7,
        members: [{
          role: ProjectRole.Viewer,
          user: {},
        }, {
          role: ProjectRole.Contributor,
          user: {},
        }],
        name: 'Test',
        type: null,
        owner: {},
      }));
      spyOn(chart, 'defineOptions');
      spyOnProperty(chart, 'dataUri$', 'get').and.resolveTo('base64 encoded chart diagram');
      spyOn(snackbar, 'showError');
      spyOn(pdf, 'generateProjectReport');

      component.downloadPdf();
      tick();

      expect(projects.read).toHaveBeenCalled();
      expect(chart.defineOptions).toHaveBeenCalled();
      expect(pdf.generateProjectReport).toHaveBeenCalledWith({
        companions: [{}],
        deliverables: 'Nothing has been done the past week.',
        hazards: 'The typical risk of random sickness stays.',
        objectives: 'We plan to accomplish more than the previous week.',
        other: 'The is nothing else to mention.',
        projectTitle: 'Test',
        projectType: null,
        reportDate: '2024-01-01',
        reportEnd: '',
        reportInterval: 7,
        reportStart: '2024-01-01',
        sequenceNumber: 1,
        students: [{}, {}],
        milestoneTrendAnalysis: 'base64 encoded chart diagram',
      });
      expect(snackbar.showError).not.toHaveBeenCalled();
    }));

    it('should define the chart options and generate the pdf document with fallback values', fakeAsync(() => {
      spyOn(projects, 'read').and.returnValue(of({
        officialStart: '2024-01-01',
        officialEnd: null,
        milestones: [],
        reportInterval: 7,
        members: [{
          role: ProjectRole.Viewer,
          user: {},
        }, {
          role: ProjectRole.Contributor,
          user: {},
        }],
        name: 'Test',
        type: null,
        owner: {},
      }));
      spyOn(chart, 'defineOptions');
      spyOnProperty(chart, 'dataUri$', 'get').and.resolveTo('base64 encoded chart diagram');
      spyOn(snackbar, 'showError');
      spyOn(pdf, 'generateProjectReport');

      component.projectReport = {
        reportDate: null,
        sequenceNumber: null,
        deliverables: null,
        objectives: null,
        hazards: null,
        other: null,
        project: {
          id: '123',
        },
      } as any;
      component.downloadPdf();
      tick();

      expect(projects.read).toHaveBeenCalled();
      expect(chart.defineOptions).toHaveBeenCalled();
      expect(pdf.generateProjectReport).toHaveBeenCalledWith({
        companions: [{}],
        deliverables: '',
        hazards: '',
        objectives: '',
        other: '',
        projectTitle: 'Test',
        projectType: null,
        reportDate: '',
        reportEnd: '',
        reportInterval: 7,
        reportStart: '2024-01-01',
        sequenceNumber: NaN,
        students: [{}, {}],
        milestoneTrendAnalysis: 'base64 encoded chart diagram',
      });
      expect(snackbar.showError).not.toHaveBeenCalled();
    }));
  });
});
