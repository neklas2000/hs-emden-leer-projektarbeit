import { UndefinedStringPipe } from './undefined-string.pipe';

describe('UndefinedStringPipe', () => {
  it('create an instance', () => {
    const pipe = new UndefinedStringPipe();
    expect(pipe).toBeTruthy();
  });
});
