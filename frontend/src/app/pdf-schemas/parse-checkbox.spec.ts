import { parseCheckbox } from './parse-checkbox';

describe('PdfSchema: parseCheckbox', () => {
  it('should immediately return the content since it is not an array', () => {
    // @ts-ignore
    expect(parseCheckbox('')).toEqual('');
  });
});
