import { add } from './add';

describe('function add(number, number): number', () => {
  it('should add two numbers', () => {
    const result = add(1, 2);
    expect(result).toEqual(3);
  });
});
