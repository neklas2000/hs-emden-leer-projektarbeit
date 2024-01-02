import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneTrendAnalysisChartComponent } from './milestone-trend-analysis-chart.component';

describe('MilestoneTrendAnalysisChartComponent', () => {
  let component: MilestoneTrendAnalysisChartComponent;
  let fixture: ComponentFixture<MilestoneTrendAnalysisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilestoneTrendAnalysisChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MilestoneTrendAnalysisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
