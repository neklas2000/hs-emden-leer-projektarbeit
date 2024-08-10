import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProfileDeletionComponent } from './confirm-profile-deletion.component';

describe('ConfirmProfileDeletionComponent', () => {
  let component: ConfirmProfileDeletionComponent;
  let fixture: ComponentFixture<ConfirmProfileDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmProfileDeletionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmProfileDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
