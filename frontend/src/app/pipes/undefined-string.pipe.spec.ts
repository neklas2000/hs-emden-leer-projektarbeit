import { UndefinedStringPipe } from '@Pipes/undefined-string.pipe';

describe('Pipe: UndefinedStringPipe', () => {
  let pipe: UndefinedStringPipe;

  beforeAll(() => {
    pipe = new UndefinedStringPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform(Nullable<Undefinable<string | number>>, string?): string', () => {
    it('should return the default fallback value', () => {
      expect(pipe.transform(null)).toEqual('Nicht definiert');
    });

    it('should return a customized fallback value', () => {
      expect(pipe.transform(null, 'Customized')).toEqual('Customized');
    });

    it('should return the default fallback value since an empty string has been provided', () => {
      expect(pipe.transform('')).toEqual('Nicht definiert');
    });

    it('should return the provided value, since it is defined and not an empty string', () => {
      expect(pipe.transform('Hello', 'Customized')).toEqual('Hello');
    });
  });
});
