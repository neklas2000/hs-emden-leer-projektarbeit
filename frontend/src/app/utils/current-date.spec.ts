import { currentDate } from './current-date';

describe('Util: currentDate', () => {
  it('should return the current date in the format yyyy-MM-dd', () => {
    const date = new Date(2024, 3, 5);

    const clock = jasmine.clock().install();
    clock.mockDate(date);

    expect(currentDate()).toEqual('2024-04-05');
  });
});
