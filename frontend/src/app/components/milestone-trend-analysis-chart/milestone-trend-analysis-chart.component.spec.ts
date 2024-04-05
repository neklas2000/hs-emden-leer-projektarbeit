import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneTrendAnalysisChartComponent } from './milestone-trend-analysis-chart.component';
import { ChartService } from '@Services/chart.service';

describe('Component: MilestoneTrendAnalysisChartComponent', () => {
  let component: MilestoneTrendAnalysisChartComponent;
  let fixture: ComponentFixture<MilestoneTrendAnalysisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneTrendAnalysisChartComponent],
      providers: [
        ChartService,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MilestoneTrendAnalysisChartComponent);
    component = fixture.componentInstance;
    component.startDate = '2024-01-01';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
