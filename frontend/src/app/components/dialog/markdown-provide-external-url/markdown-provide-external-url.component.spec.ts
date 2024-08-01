import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MarkdownProvideExternalUrlComponent } from './markdown-provide-external-url.component';

describe('Component: MarkdownProvideExternalUrlComponent', () => {
  let component: MarkdownProvideExternalUrlComponent;
  let fixture: ComponentFixture<MarkdownProvideExternalUrlComponent>;
  let dialogRefCloseSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    dialogRefCloseSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [MarkdownProvideExternalUrlComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            isImage: true,
          },
        }, {
          provide: MatDialogRef,
          useValue: {
            close: dialogRefCloseSpy,
          },
        },
        provideAnimations(),
      ],
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
