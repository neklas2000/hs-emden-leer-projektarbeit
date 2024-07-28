import { Content, DynamicBackground, TDocumentDefinitions } from 'pdfmake/interfaces';

import { Undefinable } from '@Types';

/**
 * @description
 * This interface defines the function `populate`, which is required by any schema defining a pdf
 * document structure.
 */
export interface PdfSchema<T> {
  populate(
    background: Undefinable<DynamicBackground | Content>,
    content: T,
  ): Promise<TDocumentDefinitions>;
};
