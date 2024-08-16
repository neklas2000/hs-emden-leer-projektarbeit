import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoComponent } from '@Components/logo/logo.component';
import { ThemeService } from '@Services/theme.service';

describe('Component: LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ThemeService],
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
