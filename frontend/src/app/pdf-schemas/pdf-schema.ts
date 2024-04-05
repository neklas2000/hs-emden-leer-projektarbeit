import { Content, DynamicBackground, TDocumentDefinitions } from 'pdfmake/interfaces';

import { Undefinable } from '@Types';

export interface PdfSchema<T> {
  populate(
    background: Undefinable<DynamicBackground | Content>,
    content: T,
  ): Promise<TDocumentDefinitions>;
};
