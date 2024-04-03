import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MarkdownComponent } from 'ngx-markdown';
import { take } from 'rxjs';

import { MarkdownEditorDialogComponent } from '../markdown-editor-dialog/markdown-editor-dialog.component';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [
    MarkdownComponent,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
  ],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MarkdownEditorComponent
    }
  ]
})
export class MarkdownEditorComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('editorButtons') editorButtons!: ElementRef<HTMLElement>;
  @Input() label: string = 'Textarea';

  markdown: string = '';
  previewOpen: boolean = false;
  touched = false;
  disabled = false;

  private currentCursorPosition!: [number, number];
  private cursorPositionUpdateBlocked: boolean = false;
  private shiftPressed: boolean = false;

  constructor(public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    const area = this.textArea.nativeElement;
    const buttons = this.editorButtons.nativeElement;
    this.currentCursorPosition = [-1, -1];

    window.addEventListener('click', (ev) => {
      if (!area.contains(ev.target as Node) && !buttons.contains(ev.target as Node) && !this.cursorPositionUpdateBlocked) {
        this.currentCursorPosition = [-1, -1];
      }
    });
  }

  onChange = (markdown: string) => { };
  onTouched = () => { };

  writeValue(markdown: string): void {
    this.markdown = markdown;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(): void {
    this.markAsTouched();

    if (!this.disabled) {
      this.onChange(this.markdown);
    }
  }

  updateSelection(ev: KeyboardEvent | MouseEvent): void {
    if (ev instanceof KeyboardEvent) {
      if (ev.key === 'Shift') this.shiftPressed = false;
    }

    const { selectionStart, selectionEnd } = this.textArea.nativeElement;
    this.currentCursorPosition = [selectionStart, selectionEnd];
  }

  changeIndentation(ev: KeyboardEvent): void {
    if (ev.key === 'Shift') this.shiftPressed = true;
    if (ev.key === 'Tab') {
      ev.preventDefault();
      const [start, end] = this.currentCursorPosition;
      const selection = this.markdown.slice(start, end);
      let rowsWithIndentation: string;

      if (selection.includes('\r\n')) {
        rowsWithIndentation = selection.split('\r\n').map((row) => {
          if (!this.shiftPressed) return `\t${row}`;

          return row.replace('\t', '');
        }).join('\r\n');
      } else if (selection.includes('\n')) {
        rowsWithIndentation = selection.split('\n').map((row) => {
          if (!this.shiftPressed) return `\t${row}`;

          return row.replace('\t', '');
        }).join('\n');
      } else {
        if (!this.shiftPressed) {
          rowsWithIndentation = `\t${selection}`;
        } else {
          rowsWithIndentation = selection.replace('\t', '');
        }
      }

      this.markdown = [this.markdown.slice(0, start), rowsWithIndentation, this.markdown.slice(end)].join('');
      this.textArea.nativeElement.focus();

      setTimeout(() => {
        this.textArea.nativeElement.setSelectionRange(
          start,
          start + rowsWithIndentation.length
        );

        this.onInputChange();
      }, 0);
    }
  }

  formatBold(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('**strong text**', [2, 13])) {
      this.formatMarkdown('**:selection**', 2);
    }

    this.onInputChange();
  }

  formatItalic(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('*emphasized text*', [1, 16])) {
      this.formatMarkdown('*:selection*', 1);
    }

    this.onInputChange();
  }

  formatHeading(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('## Heading', [3, 10])) {
      this.formatMarkdown('## :selection', 3);
    }

    this.onInputChange();
  }

  formatStrikethrough(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('~~strikethrough text~~', [2, 20])) {
      this.formatMarkdown('~~:selection~~', 2);
    }

    this.onInputChange();
  }

  formatBulletList(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('- List item', [2, 11])) {
      this.formatMarkdown('- :selection', 2);
    }

    this.onInputChange();
  }

  formatNumberedList(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('1. List item', [3, 12])) {
      this.formatMarkdown('1. :selection', 3);
    }

    this.onInputChange();
  }

  formatTaskList(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('- [ ] List Item', [6, 15])) {
      this.formatMarkdown('- [ ] :selection', 6);
    }

    this.onInputChange();
  }

  formatQuote(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('> Blockquote', [2, 12])) {
      this.formatMarkdown('> :selection', 2);
    }

    this.onInputChange();
  }

  formatCode(): void {
    if (this.currentCursorPosition[0] < 0) return;

    const content = '```\r\n\tenter code here\r\n```\r\n';

    if (!this.extendMarkdown(content, [content.indexOf('e') - 1, content.indexOf('e') + 14])) {
      this.formatMarkdown('```\r\n\t:selection\r\n```\r\n', content.indexOf('e') - 1, false); // alles markierte in den Codeblock
    }

    this.onInputChange();
  }

  formatTable(): void {
    if (this.currentCursorPosition[0] < 0) return;
    if (!this.extendMarkdown('|  |  |\r\n|--|--|\r\n|  |  |', [1, 3])) {
      this.formatMarkdown('|:selection|  |\r\n|--|--|\r\n|  |  |', 1, false);
    }

    this.onInputChange();
  }

  formatLink(): void {
    if (this.currentCursorPosition[0] < 0) return;

    this.cursorPositionUpdateBlocked = true;
    const dialogRef = this.dialog.open(MarkdownEditorDialogComponent, {
      data: {
        isImage: false,
      },
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        result = result ?? '';
        this.cursorPositionUpdateBlocked = false;

        if (!this.extendMarkdown(`[enter link description here](${result})`, [1, 28])) {
          this.formatMarkdown(`[:selection](${result})`, 1, false);
        }

        this.onInputChange();
      });
  }

  formatImage(): void {
    if (this.currentCursorPosition[0] < 0) return;

    this.cursorPositionUpdateBlocked = true;
    const dialogRef = this.dialog.open(MarkdownEditorDialogComponent, {
      data: {
        isImage: true,
      },
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        result = result ?? '';
        this.cursorPositionUpdateBlocked = false;

        if (!this.extendMarkdown(`![enter image description here](${result})`, [2, 30])) {
          this.formatMarkdown(`![:selection](${result})`, 2, false);
        }

        this.onInputChange();
      });
  }

  private extendMarkdown(content: string, startOffsets: [number, number]): boolean {
    if (this.currentCursorPosition[0] !== this.currentCursorPosition[1]) return false;

    const [start, end] = this.currentCursorPosition;
    this.markdown = [this.markdown.slice(0, start), content, this.markdown.slice(end)].join('');
    this.textArea.nativeElement.focus();

    setTimeout(() => {
      this.currentCursorPosition = [start + startOffsets[0], start + startOffsets[1]];
      this.textArea.nativeElement.setSelectionRange(
        start + startOffsets[0],
        start + startOffsets[1]
      );
    }, 0);

    return true;
  }

  /**
   * This function expects the placeholder ":selection" inside of the content,
   * which will be replaced with the current selected text. The result will then
   * be replaced in the markdown text.
   *
   * @param content The content containing the placeholder ":selection"
   * @param startOffset The offset from the selection start, so that the original
   * text can be selected again after adding the offset
   * @returns `true` if the content could be replaced and `false` if no range
   * was selected or the content parameter doesn't include the placeholder
   */
  private formatMarkdown(content: string, startOffset: number, allowMultiline: boolean = true): boolean {
    if (this.currentCursorPosition[0] === this.currentCursorPosition[1]) return false;
    if (!content.includes(':selection')) return false;

    const [start, end] = this.currentCursorPosition;
    const selection = this.markdown.slice(start, end);
    let newSelectionRange = [start + startOffset, start + startOffset + selection.length];

    if (selection.includes('\r\n') && allowMultiline) {
      content = selection.split('\r\n').map((row) => content.replace(':selection', row)).join('\r\n');
      newSelectionRange = [start, start + content.length];
    } else if (selection.includes('\n') && allowMultiline) {
      content = selection.split('\n').map((row) => content.replace(':selection', row)).join('\n');
      newSelectionRange = [start, start + content.length];
    } else {
      content = content.replace(':selection', selection);
    }

    this.markdown = [this.markdown.slice(0, start), content, this.markdown.slice(end)].join('');
    this.textArea.nativeElement.focus();

    setTimeout(() => {
      this.currentCursorPosition = [newSelectionRange[0], newSelectionRange[1]];
      this.textArea.nativeElement.setSelectionRange(
        newSelectionRange[0],
        newSelectionRange[1]
      );
    }, 0);

    return true;
  }
}
