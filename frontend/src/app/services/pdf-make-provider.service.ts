import { Injectable } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfMakeProviderService {
  constructor() {}

	get createPdf() {
		return pdfMake.createPdf;
	}

	get fonts() {
		return pdfFonts.pdfMake.vfs;
	}
}
