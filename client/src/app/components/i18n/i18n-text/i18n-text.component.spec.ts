import { ComponentFixture, TestBed } from '@angular/core/testing';

import { I18nTextComponent } from './i18n-text.component';

describe('I18nTextComponent', () => {
  let component: I18nTextComponent;
  let fixture: ComponentFixture<I18nTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [I18nTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(I18nTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
