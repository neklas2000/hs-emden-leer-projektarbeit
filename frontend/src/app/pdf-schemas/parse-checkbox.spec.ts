import { parseCheckbox } from '@PdfSchemas/parse-checkbox';

describe('PdfSchema: parseCheckbox', () => {
  it('should immediately return the content since it is not an array', () => {
    const content = '';
    const result: any = parseCheckbox(content);

    expect(result).toEqual(content);
  });

  it('should remove useless entries', () => {
    const content = [{
      text: ' ',
    }, {
      text: 'Hello'
    }, {
      text: ' '
    }, {
      text: 'World'
    }];
    const result: any = parseCheckbox(content);

    expect(result).toEqual([{
      text: 'Hello'
    }, {
      text: 'World'
    }]);
  });

  it('should parse an unordered list', () => {
    const content: any[] = [{
      nodeName: 'UL',
      ul: [
        {
          nodeName: 'DIV',
          stack: [{
            stack: [{
              image: 'this is the image',
            }, {
              text: 'this is the text',
            }],
          }],
        },
        {
          nodeName: 'DIV',
        },
        {
          nodeName: 'SPAN',
        },
      ],
    }];

    const result: any = parseCheckbox(content);

    expect(result).toEqual([{
      nodeName: 'UL',
      table: {
        body: [[{
          border: [false, false, false, false],
          nodeName: 'IMG',
          image: 'this is the image',
          width: 12,
        }, {
          border: [false, false, false, false],
          text: 'this is the text',
        }]],
      },
    }]);
  });
});
