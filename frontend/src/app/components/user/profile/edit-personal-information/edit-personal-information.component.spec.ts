import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonalInformationComponent } from './edit-personal-information.component';

describe('EditPersonalInformationComponent', () => {
  let component: EditPersonalInformationComponent;
  let fixture: ComponentFixture<EditPersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPersonalInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
