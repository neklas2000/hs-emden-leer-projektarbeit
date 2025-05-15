import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthStepActionsComponent } from './auth-step-actions.component';

describe('AuthStepActionsComponent', () => {
  let component: AuthStepActionsComponent;
  let fixture: ComponentFixture<AuthStepActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthStepActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthStepActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
