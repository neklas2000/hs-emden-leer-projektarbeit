import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { RegisterPersonalDetailsComponent } from './register-personal-details.component';

describe('RegisterPersonalDetailsComponent', () => {
  let component: RegisterPersonalDetailsComponent;
  let fixture: ComponentFixture<RegisterPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAnimations()],
      imports: [RegisterPersonalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
