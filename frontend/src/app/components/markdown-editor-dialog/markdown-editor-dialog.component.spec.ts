import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MarkdownEditorDialogComponent } from './markdown-editor-dialog.component';

describe('Component: MarkdownEditorDialogComponent', () => {
  let component: MarkdownEditorDialogComponent;
  let fixture: ComponentFixture<MarkdownEditorDialogComponent>;
  let closeSpy: jasmine.Spy<jasmine.Func>;

  beforeEach(async () => {
    closeSpy = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [MarkdownEditorDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: closeSpy,
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            isImage: true,
          },
        },
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
