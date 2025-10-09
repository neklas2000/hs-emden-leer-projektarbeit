import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalPathAnalysisComponent } from './critical-path-analysis.component';

describe('CriticalPathAnalysisComponent', () => {
  let component: CriticalPathAnalysisComponent;
  let fixture: ComponentFixture<CriticalPathAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalPathAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriticalPathAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
