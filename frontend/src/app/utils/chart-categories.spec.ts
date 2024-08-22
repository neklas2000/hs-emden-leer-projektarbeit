import { ChartCategories } from '@Utils/chart-categories';
import { DateTime } from 'luxon';

describe('Util: ChartCategories', () => {
  it('should create with a list of DateTime objects', () => {
    const categories = new ChartCategories([
      DateTime.fromSQL('2024-01-01'),
      DateTime.fromSQL('2024-01-08'),
      DateTime.fromSQL('2024-01-15'),
      DateTime.fromSQL('2024-01-22'),
      DateTime.fromSQL('2024-01-29'),
    ]);

    expect(categories).toBeTruthy();
  });

  it('should create with a list of dates as string', () => {
    const categories = new ChartCategories([
      '2024-01-01',
      '2024-01-08',
      '2024-01-15',
      '2024-01-22',
      '2024-01-29',
    ]);

    expect(categories).toBeTruthy();
  });

  describe('get xAxis(): string[]', () => {
    let categories: ChartCategories;

    beforeEach(() => {
      categories = new ChartCategories([
        DateTime.fromSQL('2024-01-01'),
        DateTime.fromSQL('2024-01-08'),
        DateTime.fromSQL('2024-01-15'),
        DateTime.fromSQL('2024-01-22'),
        DateTime.fromSQL('2024-01-29'),
      ]);
    });

    it('should define all labels and return them', () => {
      spyOn(categories['dates'], 'map').and.callThrough();

      expect(categories.xAxis).toEqual([
        '01/01',
        '01/08',
        '01/15',
        '01/22',
        '01/29',
      ]);
      expect(categories['dates'].map).toHaveBeenCalledTimes(1);
    });

    it('should return already defined labels', () => {
      spyOn(categories['dates'], 'map').and.callThrough();

      expect(categories.xAxis).toEqual([
        '01/01',
        '01/08',
        '01/15',
        '01/22',
        '01/29',
      ]);
      expect(categories['dates'].map).not.toHaveBeenCalledTimes(2);
    });
  });

  describe('get yAxis(): string[]', () => {
    let categories: ChartCategories;

    beforeEach(() => {
      categories = new ChartCategories([
        DateTime.fromSQL('2024-01-01'),
        DateTime.fromSQL('2024-01-08'),
        DateTime.fromSQL('2024-01-15'),
        DateTime.fromSQL('2024-01-22'),
        DateTime.fromSQL('2024-01-29'),
      ]);
    });

    it('should define all labels and return them', () => {
      spyOn(categories['dates'], 'map').and.callThrough();

      expect(categories.yAxis).toEqual([
        '01.01.2024',
        '08.01.2024',
        '15.01.2024',
        '22.01.2024',
        '29.01.2024',
      ]);
      expect(categories['dates'].map).toHaveBeenCalledTimes(1);
    });

    it('should return already defined labels', () => {
      spyOn(categories['dates'], 'map').and.callThrough();

      expect(categories.yAxis).toEqual([
        '01.01.2024',
        '08.01.2024',
        '15.01.2024',
        '22.01.2024',
        '29.01.2024',
      ]);
      expect(categories['dates'].map).not.toHaveBeenCalledTimes(2);
    });
  });

  describe('get size(): number', () => {
    let categories: ChartCategories;

    beforeEach(() => {
      categories = new ChartCategories([
        DateTime.fromSQL('2024-01-01'),
        DateTime.fromSQL('2024-01-08'),
        DateTime.fromSQL('2024-01-15'),
        DateTime.fromSQL('2024-01-22'),
        DateTime.fromSQL('2024-01-29'),
      ]);
    });

    it('should return the size (amount) of the provided dates', () => {
      expect(categories.size).toBe(5);
    });
  });

  describe('indexOfAxisLabel(string, "x" | "y"): number', () => {
    let categories: ChartCategories;

    beforeEach(() => {
      categories = new ChartCategories([
        DateTime.fromSQL('2024-01-01'),
        DateTime.fromSQL('2024-01-08'),
        DateTime.fromSQL('2024-01-15'),
        DateTime.fromSQL('2024-01-22'),
        DateTime.fromSQL('2024-01-29'),
      ]);
    });

    it('should return the index of an x-axis label', () => {
      expect(categories.indexOfAxisLabel('01/08', 'x')).toBe(1);
    });

    it('should return the index of an y-axis label', () => {
      expect(categories.indexOfAxisLabel('22.01.2024', 'y')).toBe(3);
    });
  });

  describe('getXAxisLabel(number): Nullable<string>', () => {
    let categories: ChartCategories;

    beforeEach(() => {
      categories = new ChartCategories([
        DateTime.fromSQL('2024-01-01'),
        DateTime.fromSQL('2024-01-08'),
        DateTime.fromSQL('2024-01-15'),
        DateTime.fromSQL('2024-01-22'),
        DateTime.fromSQL('2024-01-29'),
      ]);
    });

    it('should return null since the index is less than zero', () => {
      expect(categories.getXAxisLabel(-Infinity)).toBeNull();
    });

    it('should return null since the index is greate than the size', () => {
      expect(categories.getXAxisLabel(5)).toBeNull();
      expect(categories.getXAxisLabel(Infinity)).toBeNull();
    });

    it('should return the x-axis label', () => {
      expect(categories.getXAxisLabel(4)).toEqual('01/29');
    });
  });
});
