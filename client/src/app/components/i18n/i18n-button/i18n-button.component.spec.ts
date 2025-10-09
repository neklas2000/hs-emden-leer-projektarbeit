import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nButtonComponent } from './i18n-button.component';

describe('I18nButtonComponent', () => {
  let component: I18nButtonComponent;
  let fixture: ComponentFixture<I18nButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(I18nButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
