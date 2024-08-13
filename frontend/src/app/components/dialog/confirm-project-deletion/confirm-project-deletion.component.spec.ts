import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProjectDeletionComponent } from './confirm-project-deletion.component';

describe('ConfirmProjectDeletionComponent', () => {
  let component: ConfirmProjectDeletionComponent;
  let fixture: ComponentFixture<ConfirmProjectDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmProjectDeletionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmProjectDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
