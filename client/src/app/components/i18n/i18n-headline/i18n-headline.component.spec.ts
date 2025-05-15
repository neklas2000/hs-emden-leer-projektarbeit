import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nHeadlineComponent } from './i18n-headline.component';

describe('I18nHeadlineComponent', () => {
  let component: I18nHeadlineComponent;
  let fixture: ComponentFixture<I18nHeadlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nHeadlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(I18nHeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
