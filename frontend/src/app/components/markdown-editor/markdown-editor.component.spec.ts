import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideMarkdown } from 'ngx-markdown';
import { of } from 'rxjs';

import { MarkdownProvideExternalUrlComponent } from '@Components/dialog/markdown-provide-external-url/markdown-provide-external-url.component';
import { MarkdownEditorComponent } from '@Components/markdown-editor/markdown-editor.component';
import { DialogService } from '@Services/dialog.service';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { WindowProviderService } from '@Services/window-provider.service';

describe('Component: MarkdownEditorComponent', () => {
  let component: MarkdownEditorComponent;
  let fixture: ComponentFixture<MarkdownEditorComponent>;
  let windowProvider: WindowProviderService;
  let dialog: DialogService;
  let window: Window;
  let snackbar: SnackbarService;

  class WindowStub {
    private static instance: WindowStub;

    static getSingleton(): WindowStub {
      if (!this.instance) {
        this.instance = new WindowStub();
      }

      return this.instance;
    }

    private listeners: { [channel: string]: Array<(ev: Event) => void>; } = {};

    addEventListener(ev: string, fn: (ev: Event) => void) {
      const fns = this.listeners[ev] || [];
      fns.push(fn);
      this.listeners[ev] = fns;
    }

    removeEventListener(ev: string, fn: (ev: Event) => void) {
      this.listeners[ev] = (this.listeners[ev] || []).filter((_fn) => {
        return _fn != fn;
      });
    }

    dispatchEvent(ev: Event) {
      for (const fn of (this.listeners[ev.type] || [])) {
        fn(ev);
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownEditorComponent],
      providers: [
        provideMarkdown(),
        provideAnimations(),
        DialogService,
        {
          provide: WindowProviderService,
          useValue: {
            getWindow: () => WindowStub.getSingleton(),
          },
        },
        SnackbarService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownEditorComponent);
    dialog = TestBed.inject(DialogService);
    windowProvider = TestBed.inject(WindowProviderService);
    snackbar = TestBed.inject(SnackbarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    window = windowProvider.getWindow();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the field as touched', () => {
    expect(component.touched).toBeFalsy();

    component.textArea.nativeElement.click();

    expect(component.touched).toBeTruthy();
  });

  it('should reset the cursor position, due to an outside click', () => {
    component['currentCursorPosition'] = [10, 10];

    expect(component['currentCursorPosition']).toEqual([10, 10]);

    window.dispatchEvent(new Event('click'));

    expect(component['currentCursorPosition']).toEqual([-1, -1]);
  });

  describe('writeValue(string): void', () => {
    it('should change the markdown value', () => {
      expect(component.markdown).toEqual('');

      component.writeValue('### Hello World');

      expect(component.markdown).toEqual('### Hello World');
    });
  });

  describe('registerOnChange(any): void', () => {
    it('should override the onChange hook', () => {
      const onChange = jasmine.createSpy();

      component.registerOnChange(onChange);

      expect(component.onChange).toBe(onChange);
    });
  });

  describe('registerOnTouched(any): void', () => {
    it('should override the onTouched hook', () => {
      const onTouched = jasmine.createSpy();

      component.registerOnTouched(onTouched);

      expect(component.onTouched).toBe(onTouched);
    });
  });

  describe('markAsTouched(): void', () => {
    it('should mark the input field als touched', () => {
      expect(component.touched).toBeFalsy();

      component.markAsTouched();

      expect(component.touched).toBeTruthy();
    });
  });

  describe('setDisabledState(boolean): void', () => {
    it('should change the disabled state from false to true and back to false', () => {
      expect(component.disabled).toBeFalsy();

      component.setDisabledState!(true);

      expect(component.disabled).toBeTruthy();

      component.setDisabledState!(false);

      expect(component.disabled).toBeFalsy();
    });
  });

  describe('onInputChange(): void', () => {
    it('should mark the field as touched and call onChange', () => {
      component.markdown = '### Hello World';
      expect(component.touched).toBeFalsy();
      spyOn(component, 'onChange').and.callThrough();

      component.onInputChange();

      expect(component.touched).toBeTruthy();
      expect(component.onChange).toHaveBeenCalledWith('### Hello World');
    });
  });

  describe('updateSelection(KeyboardEvent | MouseEvent): void', () => {
    it('should set shiftPressed to false and update the cursor position', () => {
      component['shiftPressed'] = true;

      expect(component['shiftPressed']).toBeTruthy();

      component.updateSelection(new KeyboardEvent('Shift', { key: 'Shift' }));

      expect(component['shiftPressed']).toBeFalsy();
    });
  });

  describe('changeIndentation(KeyboardEvent): void', () => {
    it('should set shiftPressed to true', () => {
      component['shiftPressed'] = false;

      expect(component['shiftPressed']).toBeFalsy();

      component.changeIndentation(new KeyboardEvent('Shift', { key: 'Shift' }));

      expect(component['shiftPressed']).toBeTruthy();
    });

    it('should add indentation in a single line', () => {
      component['currentCursorPosition'] = [0, 0];
      component.writeValue('### Hello World');

      expect(component.markdown).toEqual('### Hello World');

      component.changeIndentation(new KeyboardEvent('Tab', { key: 'Tab' }));

      expect(component.markdown).toEqual('\t### Hello World');
    });

    it('should remove the indentation in a single line', () => {
      component['shiftPressed'] = true;
      component.writeValue('\t### Hello World');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('#')];

      expect(component.markdown).toEqual('\t### Hello World');

      component.changeIndentation(new KeyboardEvent('Tab', { key: 'Tab' }));

      expect(component.markdown).toEqual('### Hello World');
    });

    it('should add indentation in multiple lines (CR)', () => {
      component.writeValue('### Title 1\n### Title 2\n### Title 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3')];

      expect(component.markdown).toEqual('### Title 1\n### Title 2\n### Title 3');

      component.changeIndentation(new KeyboardEvent('Tab', { key: 'Tab' }));

      expect(component.markdown).toEqual('\t### Title 1\n\t### Title 2\n\t### Title 3');
    });

    it('should remove indentation in multiple lines (CR)', () => {
      component['shiftPressed'] = true;
      component.writeValue('\t### Title 1\n\t### Title 2\n\t### Title 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3')];

      expect(component.markdown).toEqual('\t### Title 1\n\t### Title 2\n\t### Title 3');

      component.changeIndentation(new KeyboardEvent('Tab', { key: 'Tab' }));

      expect(component.markdown).toEqual('### Title 1\n### Title 2\n### Title 3');
    });

    it('should add indentation in multiple lines (CRLF)', () => {
      component.writeValue('### Title 1\r\n### Title 2\r\n### Title 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3')];

      expect(component.markdown).toEqual('### Title 1\r\n### Title 2\r\n### Title 3');

      component.changeIndentation(new KeyboardEvent('Tab', { key: 'Tab' }));

      expect(component.markdown).toEqual('\t### Title 1\r\n\t### Title 2\r\n\t### Title 3');
    });

    it('should remove indentation in multiple lines (CRLF)', () => {
      component['shiftPressed'] = true;
      component.writeValue('\t### Title 1\r\n\t### Title 2\r\n\t### Title 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3')];

      expect(component.markdown).toEqual('\t### Title 1\r\n\t### Title 2\r\n\t### Title 3');

      component.changeIndentation(new KeyboardEvent('Tab', { key: 'Tab' }));

      expect(component.markdown).toEqual('### Title 1\r\n### Title 2\r\n### Title 3');
    });
  });

  describe('formatBold(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatBold();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by bold text', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatBold();

      expect(component.markdown).toEqual('**strong text**');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [6, 11];

      component.formatBold();

      expect(component.markdown).toEqual('Hello **World**');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatBold();

      expect(component.markdown).toEqual('**Hello 1**\n**Hello 2**\n**Hello 3**');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatBold();

      expect(component.markdown).toEqual('**Hello 1**\r\n**Hello 2**\r\n**Hello 3**');
    });
  });

  describe('formatItalic(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatItalic();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by italic text', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatItalic();

      expect(component.markdown).toEqual('*emphasized text*');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [6, 11];

      component.formatItalic();

      expect(component.markdown).toEqual('Hello *World*');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatItalic();

      expect(component.markdown).toEqual('*Hello 1*\n*Hello 2*\n*Hello 3*');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatItalic();

      expect(component.markdown).toEqual('*Hello 1*\r\n*Hello 2*\r\n*Hello 3*');
    });
  });

  describe('formatHeading(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatHeading();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by heading text', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatHeading();

      expect(component.markdown).toEqual('## Heading');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatHeading();

      expect(component.markdown).toEqual('## Hello World');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatHeading();

      expect(component.markdown).toEqual('## Hello 1\n## Hello 2\n## Hello 3');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatHeading();

      expect(component.markdown).toEqual('## Hello 1\r\n## Hello 2\r\n## Hello 3');
    });
  });

  describe('formatStrikethrough(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatStrikethrough();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by strikethrough text', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatStrikethrough();

      expect(component.markdown).toEqual('~~strikethrough text~~');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [6, 11];

      component.formatStrikethrough();

      expect(component.markdown).toEqual('Hello ~~World~~');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatStrikethrough();

      expect(component.markdown).toEqual('~~Hello 1~~\n~~Hello 2~~\n~~Hello 3~~');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatStrikethrough();

      expect(component.markdown).toEqual('~~Hello 1~~\r\n~~Hello 2~~\r\n~~Hello 3~~');
    });
  });

  describe('formatBulletList(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatBulletList();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by a bullet list', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatBulletList();

      expect(component.markdown).toEqual('- List item');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatBulletList();

      expect(component.markdown).toEqual('- Hello World');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatBulletList();

      expect(component.markdown).toEqual('- Hello 1\n- Hello 2\n- Hello 3');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatBulletList();

      expect(component.markdown).toEqual('- Hello 1\r\n- Hello 2\r\n- Hello 3');
    });
  });

  describe('formatNumberedList(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatNumberedList();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by a numbered list', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatNumberedList();

      expect(component.markdown).toEqual('1. List item');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatNumberedList();

      expect(component.markdown).toEqual('1. Hello World');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatNumberedList();

      expect(component.markdown).toEqual('1. Hello 1\n1. Hello 2\n1. Hello 3');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatNumberedList();

      expect(component.markdown).toEqual('1. Hello 1\r\n1. Hello 2\r\n1. Hello 3');
    });
  });

  describe('formatTaskList(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatTaskList();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by a task list', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatTaskList();

      expect(component.markdown).toEqual('- [ ] List item');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatTaskList();

      expect(component.markdown).toEqual('- [ ] Hello World');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatTaskList();

      expect(component.markdown).toEqual('- [ ] Hello 1\n- [ ] Hello 2\n- [ ] Hello 3');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatTaskList();

      expect(component.markdown).toEqual('- [ ] Hello 1\r\n- [ ] Hello 2\r\n- [ ] Hello 3');
    });
  });

  describe('formatQuote(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatQuote();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by a qouted text', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatQuote();

      expect(component.markdown).toEqual('> Blockquote');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatQuote();

      expect(component.markdown).toEqual('> Hello World');
    });

    it('should format multiple lines of selected text (CR)', () => {
      component.writeValue('Hello 1\nHello 2\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatQuote();

      expect(component.markdown).toEqual('> Hello 1\n> Hello 2\n> Hello 3');
    });

    it('should format multiple lines of selected text (CRLF)', () => {
      component.writeValue('Hello 1\r\nHello 2\r\nHello 3');
      component['currentCursorPosition'] = [0, component.markdown.indexOf('3') + 1];

      component.formatQuote();

      expect(component.markdown).toEqual('> Hello 1\r\n> Hello 2\r\n> Hello 3');
    });
  });

  describe('formatCode(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatCode();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by code block', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatCode();

      expect(component.markdown).toEqual('```\r\n\tenter code here\r\n```\r\n');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatCode();

      expect(component.markdown).toEqual('```\r\n\tHello World\r\n```\r\n');
    });
  });

  describe('formatTable(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatTable();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by a table', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatTable();

      expect(component.markdown).toEqual('|  |  |\r\n|--|--|\r\n|  |  |');
    });

    it('should format a selected text', () => {
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatTable();

      expect(component.markdown).toEqual('|Hello World|  |\r\n|--|--|\r\n|  |  |');
    });
  });

  describe('formatLink(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatLink();

      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by a link to an external resource', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('https://external-url.com') } as any);
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatLink();

      expect(dialog.open).toHaveBeenCalledWith(MarkdownProvideExternalUrlComponent, {
        data: {
          isImage: false,
        },
      });
      expect(component.markdown).toEqual('[enter link description here](https://external-url.com)');
    });

    it('should format a selected text and set an empty link for an external resource', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('#url') } as any);
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatLink();

      expect(dialog.open).toHaveBeenCalled();
      expect(component.markdown).toEqual('[Hello World](#url)');
    });

    it('should show a snackbar since no value has been returned', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showInfo');
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatLink();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(component.markdown).toEqual('Hello World');
    });
  });

  describe('formatImage(): void', () => {
    it('should cancel extending the markdown, since the first cursor position is less than zero', () => {
      spyOn(dialog, 'open');
      component.writeValue('');
      component['currentCursorPosition'] = [-1, 0];

      component.formatImage();

      expect(dialog.open).not.toHaveBeenCalled();
      expect(component.markdown).toEqual('');
    });

    it('should extend the markdown by a link to an external image', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('https://image-url.com') } as any);
      component.writeValue('');
      component['currentCursorPosition'] = [0, 0];

      component.formatImage();

      expect(dialog.open).toHaveBeenCalledWith(MarkdownProvideExternalUrlComponent, {
        data: {
          isImage: true,
        },
      });
      expect(component.markdown).toEqual('![enter image description here](https://image-url.com)');
    });

    it('should format a selected text and set an empty link for an image', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of('#url') } as any);
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatImage();

      expect(dialog.open).toHaveBeenCalled();
      expect(component.markdown).toEqual('![Hello World](#url)');
    });

    it('should show a snackbar since no value has been returned', () => {
      spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
      spyOn(snackbar, 'showInfo');
      component.writeValue('Hello World');
      component['currentCursorPosition'] = [0, 11];

      component.formatImage();

      expect(dialog.open).toHaveBeenCalled();
      expect(snackbar.showInfo).toHaveBeenCalledWith(SnackbarMessage.CANCELED);
      expect(component.markdown).toEqual('Hello World');
    });
  });

  describe('formatMarkdown(string, number, boolean?): boolean', () => {
    it('should return false, since both cursor positions are the same, hence no selection was made', () => {
      component['currentCursorPosition'] = [1, 1];

      expect(component['formatMarkdown']('**:selection**', 2)).toBeFalsy();
    });

    it('should return false, since the given content does not include a selection pattern (":selection")', () => {
      component['currentCursorPosition'] = [0, 10];

      expect(component['formatMarkdown']('**:thisIsTheWrongPattern**', 2)).toBeFalsy();
    });
  });
});
