import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowProviderService {
  private readonly window: Window;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.window = this.document.defaultView ?? window;
  }

  getWindow(): Window {
    return this.window;
  }

  getDocument(): Document {
    return this.document;
  }
}
