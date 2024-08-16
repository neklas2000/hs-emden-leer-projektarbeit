import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { CustomSnackBarComponent } from '@Components/custom-snack-bar/custom-snack-bar.component';

describe('Component: CustomSnackBarComponent', () => {
  let component: CustomSnackBarComponent;
  let fixture: ComponentFixture<CustomSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSnackBarComponent],
      providers: [{
        provide: MAT_SNACK_BAR_DATA,
        useValue: {
          label: 'Info message',
          type: 'info',
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
