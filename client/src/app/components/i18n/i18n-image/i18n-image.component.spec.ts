import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nImageComponent } from './i18n-image.component';

describe('I18nImageComponent', () => {
  let component: I18nImageComponent;
  let fixture: ComponentFixture<I18nImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(I18nImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
