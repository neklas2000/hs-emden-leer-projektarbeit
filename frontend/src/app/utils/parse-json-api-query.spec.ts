import { parseJsonApiQuery } from './parse-json-api-query';

describe('Util: parseJsonApiQuery', () => {
  it('should return an empty string', () => {
    expect(parseJsonApiQuery()).toEqual('');
  });
});
