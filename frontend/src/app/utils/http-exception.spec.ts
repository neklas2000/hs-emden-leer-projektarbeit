import { HttpException } from './http-exception';

describe('Util: HttpException', () => {
  it('should create an empty exception from an empty object', () => {
    const exception = new HttpException({});

    expect(exception).toBeTruthy();
  });

  it('should create an empty exception from a null value', () => {
    const exception = new HttpException(null);

    expect(exception).toBeTruthy();
  });

  it('should create an exception with headers', () => {
    const exception = new HttpException({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(exception.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('should create an exception with a detailed error code and status', () => {
    const exception = new HttpException({
      error: {
        code: 'HSEL-404-001',
        status: 404,
      },
      status: 0,
    });

    expect(exception.code).toEqual('HSEL-404-001');
    expect(exception.status).toEqual(404);
  });

  it('should create an exception with a basic error message', () => {
    const exception = new HttpException({
      error: {
        message: '',
      },
      message: 'Not Found',
    });

    expect(exception.message).toEqual('Not Found');
  });

  it('should create an exception with the maximum of information', () => {
    const exception = new HttpException({
      headers: {
        'Content-Type': 'application/json',
      },
      error: {
        code: 'HSEL-403-001',
        message: 'Insufficient Permissions',
        description: 'The access to the resource is forbidden',
        path: '/api/v1/resourceA',
        status: 0,
        timestamp: '2024-04-01T12:00:00',
      },
      message: 'Forbidden',
      name: 'Forbidden',
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      url: 'http://localhost/api/v1/resourceA',
    });

    expect(exception.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(exception.code).toEqual('HSEL-403-001');
    expect(exception.description).toEqual('The access to the resource is forbidden');
    expect(exception.message).toEqual('Insufficient Permissions');
    expect(exception.requestPath).toEqual('/api/v1/resourceA');
    expect(exception.timestamp).toEqual('2024-04-01T12:00:00');
    expect(exception.fullRequestUrl).toEqual('http://localhost/api/v1/resourceA');
    expect(exception.status).toEqual(403);
    expect(exception.statusText).toEqual('Forbidden');
    expect(exception.name).toEqual('Forbidden');
    expect(exception.ok).toBeFalsy();
  });
});
