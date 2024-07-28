import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownProvideExternalUrlComponent } from './markdown-provide-external-url.component';

describe('MarkdownProvideExternalUrlComponent', () => {
  let component: MarkdownProvideExternalUrlComponent;
  let fixture: ComponentFixture<MarkdownProvideExternalUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownProvideExternalUrlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarkdownProvideExternalUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
