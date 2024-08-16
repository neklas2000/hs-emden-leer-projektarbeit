import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { MarkdownService, provideMarkdown } from 'ngx-markdown';

import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';

describe('Component: MarkdownEditorComponent', () => {
  let component: MarkdownEditorComponent;
  let fixture: ComponentFixture<MarkdownEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownEditorComponent],
      providers: [
        MarkdownService,
        provideMarkdown(),
        provideAnimations(),
        MatDialog,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
