import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MilestoneTrendAnalysisChartComponent
} from '@Components/milestone-trend-analysis-chart/milestone-trend-analysis-chart.component';
import { AgChartService } from '@Services/ag-chart.service';
import { ThemeService } from '@Services/theme.service';

describe('Component: MilestoneTrendAnalysisChartComponent', () => {
  let component: MilestoneTrendAnalysisChartComponent;
  let fixture: ComponentFixture<MilestoneTrendAnalysisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneTrendAnalysisChartComponent],
      providers: [AgChartService, ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneTrendAnalysisChartComponent);
    component = fixture.componentInstance;
    component.startDate = '2024-01-01';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
