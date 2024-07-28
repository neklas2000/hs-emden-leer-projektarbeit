import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMilestoneDeletionComponent } from './confirm-milestone-deletion.component';

describe('ConfirmMilestoneDeletionComponent', () => {
  let component: ConfirmMilestoneDeletionComponent;
  let fixture: ComponentFixture<ConfirmMilestoneDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmMilestoneDeletionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmMilestoneDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
