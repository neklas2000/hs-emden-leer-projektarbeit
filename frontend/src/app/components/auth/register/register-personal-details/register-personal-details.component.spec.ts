import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  RegisterPersonalDetailsComponent
} from '@Components/auth/register/register-personal-details/register-personal-details.component';

describe('Component: RegisterPersonalDetailsComponent', () => {
  let component: RegisterPersonalDetailsComponent;
  let fixture: ComponentFixture<RegisterPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FormBuilder, provideAnimations()],
      imports: [RegisterPersonalDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
