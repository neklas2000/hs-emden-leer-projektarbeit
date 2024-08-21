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

  describe('onBackClick(): void', () => {
    it('should emit the back signal', () => {
      const onBackEmitSpy = spyOn(component.onBack, 'emit');

      component.onBackClick();

      expect(onBackEmitSpy).toHaveBeenCalled();
    });
  });

  describe('onCancelClick(): void', () => {
    it('should emit the cancel signal', () => {
      const onCancelEmitSpy = spyOn(component.onCancel, 'emit');

      component.onCancelClick();

      expect(onCancelEmitSpy).toHaveBeenCalled();
    });
  });

  describe('onNextClick(): void', () => {
    it('should emit the next signal', () => {
      const onNextEmitSpy = spyOn(component.onNext, 'emit');

      component.onNextClick();

      expect(onNextEmitSpy).toHaveBeenCalled();
    });
  });

  describe('getPersonalDetails(): PersonalDetails', () => {
    it('should return the personal details with the form data', () => {
      component.form.patchValue({
        academicTitle: 'Prof.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
        phoneNumber: '+49 1234 1234567890',
      });

      expect(component.getPersonalDetails()).toEqual({
        academicTitle: 'Prof.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
        phoneNumber: '+49 1234 1234567890',
      });
    });

    it('should return the personal details only with fallback values', () => {
      component.form.patchValue({
        academicTitle: null,
        firstName: null,
        lastName: null,
        matriculationNumber: null,
        phoneNumber: null,
      });

      expect(component.getPersonalDetails()).toEqual({
        academicTitle: null,
        firstName: '',
        lastName: '',
        matriculationNumber: null,
        phoneNumber: null,
      });
    });
  });
});
