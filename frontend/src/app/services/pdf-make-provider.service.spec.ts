import { TestBed } from '@angular/core/testing';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { PdfMakeProviderService } from '@Services/pdf-make-provider.service';

describe('Service: PdfMakeProviderService', () => {
  let service: PdfMakeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfMakeProviderService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get createPdf()', () => {
    it('should return the createPdf function from pdfMake', () => {
      expect(service.createPdf).toBe(pdfMake.createPdf);
    });
  });

  describe('get fonts()', () => {
    it('should return the fonts from pdfMake', () => {
      expect(service.fonts).toBe(pdfFonts.pdfMake.vfs);
    });
  });
});
