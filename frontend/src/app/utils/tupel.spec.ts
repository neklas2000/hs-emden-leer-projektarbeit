import { Tupel } from './tupel';

describe('Util: Tupel', () => {
  it('should create an empty tupel', () => {
    const tupel = new Tupel();

    expect(tupel.isEmpty).toBeTruthy();
  });

  it('should create a tupel with two number values', () => {
    const tupel = new Tupel<number>([1, 2]);

    expect(tupel.x).toEqual(1);
    expect(tupel.y).toEqual(2);
  });

  it('should reset a tupel back to null values', () => {
    const tupel = new Tupel<number>([1, 2]);

    expect(tupel.x).toEqual(1);
    expect(tupel.y).toEqual(2);

    tupel.reset();

    expect(tupel.x).toBeNull();
    expect(tupel.y).toBeNull();
  });

  it('should update the x value', () => {
    const tupel = new Tupel<number>([1, 2]);

    expect(tupel.x).toEqual(1);
    expect(tupel.y).toEqual(2);

    tupel.x = 5;

    expect(tupel.x).toEqual(5);
    expect(tupel.y).toEqual(2);
  });

  it('should update the y value', () => {
    const tupel = new Tupel<number>([1, 2]);

    expect(tupel.x).toEqual(1);
    expect(tupel.y).toEqual(2);

    tupel.y = 5;

    expect(tupel.x).toEqual(1);
    expect(tupel.y).toEqual(5);
  });
});
