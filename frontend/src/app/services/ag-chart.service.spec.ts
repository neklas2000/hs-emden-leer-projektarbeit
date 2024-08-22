import { TestBed } from '@angular/core/testing';

import { AgChartService } from '@Services/ag-chart.service';
import { DateService } from '@Services/date.service';

describe('Service: AgChartService', () => {
  let service: AgChartService;
  let date: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
    });

    service = TestBed.inject(AgChartService);
    date = TestBed.inject(DateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('defineOptions(Options): void', () => {
    it('should define the chart options by the given start and end date, because no reportDates were provided', () => {
      spyOn(date, 'getReportDates').and.callThrough();

      service.defineOptions({
        start: '2024-01-01',
        end: '2024-01-29',
        milestones: [{
          id: '1',
          name: 'Milestone A',
          estimates: [{
            id: '11',
            reportDate: '2024-01-01',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '12',
            reportDate: '2024-01-08',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '13',
            reportDate: '2024-01-15',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }],
          milestoneReached: true,
          project: {} as any,
        }],
        interval: 7,
      });

      expect(date.getReportDates).toHaveBeenCalledWith('2024-01-01', '2024-01-29', 7);
    });

    it('should define the chart options by the given start and end date, because reportDates was an empty array', () => {
      spyOn(date, 'getReportDates').and.callThrough();

      service.defineOptions({
        start: '2024-01-01',
        end: '2024-01-29',
        milestones: [{
          id: '1',
          name: 'Milestone A',
          estimates: [{
            id: '11',
            reportDate: '2024-01-01',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '12',
            reportDate: '2024-01-08',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '13',
            reportDate: '2024-01-15',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }],
          milestoneReached: true,
          project: {} as any,
        }],
        interval: 7,
        reportDates: [],
      });

      expect(date.getReportDates).toHaveBeenCalledWith('2024-01-01', '2024-01-29', 7);
    });

    it('should define the chart options by the given reportDates and not use the date service', () => {
      spyOn(date, 'getReportDates');

      service.defineOptions({
        start: '2024-01-01',
        end: null,
        milestones: [{
          id: '1',
          name: 'Milestone A',
          estimates: [{
            id: '11',
            reportDate: '2024-01-01',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '12',
            reportDate: '2024-01-08',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '13',
            reportDate: '2024-01-15',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }],
          milestoneReached: true,
          project: {} as any,
        }],
        interval: 7,
        reportDates: [
          '2024-01-01',
          '2024-01-08',
          '2024-01-15',
          '2024-01-22',
          '2024-01-29',
        ],
      });

      expect(date.getReportDates).not.toHaveBeenCalled();
    });

    it('should return a well formatted label for the y-axis', () => {
      service.defineOptions({
        start: '2024-01-01',
        end: null,
        milestones: [{
          id: '1',
          name: 'Milestone A',
          estimates: [{
            id: '11',
            reportDate: '2024-01-01',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '12',
            reportDate: '2024-01-08',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '13',
            reportDate: '2024-01-15',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }],
          milestoneReached: true,
          project: {} as any,
        }],
        interval: 7,
        reportDates: [
          '2024-01-01',
          '2024-01-08',
          '2024-01-15',
          '2024-01-22',
          '2024-01-29',
        ],
      });

      const label = (<any>service.options).axes[1].label.formatter({ value: 2 });

      expect(label).toEqual('15.01.2024');
    });

    it('should trigger the tooltip renderer and return the custom html', () => {
      service.defineOptions({
        start: '2024-01-01',
        end: '2024-01-29',
        milestones: [{
          id: '1',
          name: 'Milestone A',
          estimates: [{
            id: '11',
            reportDate: '2024-01-01',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '12',
            reportDate: '2024-01-08',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }, {
            id: '13',
            reportDate: '2024-01-15',
            estimationDate: '2024-01-15',
            milestone: {} as any,
          }],
          milestoneReached: true,
          project: {} as any,
        }],
        interval: 7,
      });

      const tooltipHTML = (<any>service.options.series![0]).tooltip.renderer({
        datum: {
          'reportDate': '01/15',
          'milestone-0': 2,
        },
        xKey: 'reportDate',
        yKey: 'milestone-0',
        color: '#FF0000',
        yName: 'Meilenstein A',
      });

      expect(tooltipHTML).toMatch(/<div class="ag-chart-tooltip-title" style="background-color:#FF0000">Meilenstein A<\/div><div class="ag-chart-tooltip-content">Prognose vom 15.01.2024:<br \/>15.01.2024<\/div>/);
    });
  });

  it('should define the chart options and resolve the data uri of the generated chart', (done) => {
    service.defineOptions({
      start: '2024-01-01',
      end: '2024-01-29',
      milestones: [{
        id: '1',
        name: 'Milestone A',
        estimates: [{
          id: '11',
          reportDate: '2024-01-01',
          estimationDate: '2024-01-15',
          milestone: {} as any,
        }, {
          id: '12',
          reportDate: '2024-01-08',
          estimationDate: '2024-01-15',
          milestone: {} as any,
        }, {
          id: '13',
          reportDate: '2024-01-15',
          estimationDate: '2024-01-15',
          milestone: {} as any,
        }],
        milestoneReached: true,
        project: {} as any,
      }],
      interval: 7,
      reportDates: [],
    });

    service.dataUri$
      .then((dataUri) => {
        expect(dataUri.startsWith('data:image/png;base64,')).toBeTrue();
        expect(dataUri).toBeDefined();
      })
      .finally(() => {
        done();
      });
  });
});
