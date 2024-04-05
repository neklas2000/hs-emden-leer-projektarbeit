import { HttpException } from './http-exception';

describe('Util: HttpException', () => {
  it('should create an exception', () => {
    const exception = new HttpException({});

    expect(exception).toBeTruthy();
  });
});
