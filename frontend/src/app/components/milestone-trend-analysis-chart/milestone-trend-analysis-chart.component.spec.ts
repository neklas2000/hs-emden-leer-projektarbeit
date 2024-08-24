import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MilestoneTrendAnalysisChartComponent
} from '@Components/milestone-trend-analysis-chart/milestone-trend-analysis-chart.component';
import { AgChartService } from '@Services/ag-chart.service';
import { ThemeService } from '@Services/theme.service';

describe('Component: MilestoneTrendAnalysisChartComponent', () => {
  let component: MilestoneTrendAnalysisChartComponent;
  let fixture: ComponentFixture<MilestoneTrendAnalysisChartComponent>;
  let chart: AgChartService;
  let theme: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneTrendAnalysisChartComponent],
      providers: [AgChartService, ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneTrendAnalysisChartComponent);
    chart = TestBed.inject(AgChartService);
    theme = TestBed.inject(ThemeService);
    component = fixture.componentInstance;
    component.startDate = '2024-01-01';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit(): void', () => {
    it('should set the dark mode theme, after updating the global theme mode', () => {
      expect(component['chartInstance'].getOptions().theme).toEqual('ag-default');

      theme.toggle();

      expect(component['chartInstance'].getOptions().theme).toEqual('ag-default-dark');
    });
  });

  describe('refresh(): void', () => {
    it('should regenerate the chart options and create a new chart instance', () => {
      spyOn(chart, 'defineOptions');

      component.refresh();

      expect(chart.defineOptions).toHaveBeenCalled();
    });

    it('should regenerate the chart options and create a new chart instance with dark mode', () => {
      spyOn(chart, 'defineOptions');

      expect(component['chartInstance'].getOptions().theme).toEqual('ag-default');

      theme.toggle();
      component.refresh();

      expect(chart.defineOptions).toHaveBeenCalled();
      expect(component['chartInstance'].getOptions().theme).toEqual('ag-default-dark');
    });
  });
});
