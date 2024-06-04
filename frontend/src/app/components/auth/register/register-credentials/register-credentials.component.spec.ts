import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import { RegisterCredentialsComponent } from './register-credentials.component';

describe('Component: RegisterCredentialsComponent', () => {
  let component: RegisterCredentialsComponent;
  let fixture: ComponentFixture<RegisterCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FormBuilder, provideAnimations()],
      imports: [RegisterCredentialsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
