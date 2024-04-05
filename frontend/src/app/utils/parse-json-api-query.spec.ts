import { parseJsonApiQuery } from './parse-json-api-query';

describe('Util: parseJsonApiQuery', () => {
  it('should return an empty string since no argument was provided', () => {
    expect(parseJsonApiQuery()).toEqual('');
  });

  it('should return an empty string since an empty object was provided', () => {
    expect(parseJsonApiQuery({})).toEqual('');
  });

  it('should parse relationship includes', () => {
    expect(parseJsonApiQuery({
      includes: ['relationA', 'relationB'],
    })).toEqual('?include=relationA,relationB');
  });

  it('should parse sparse fieldsets', () => {
    expect(parseJsonApiQuery({
      sparseFieldsets: {
        tableA: ['fieldA', 'fieldB'],
        tableB: ['fieldC', 'fieldD'],
      },
    })).toEqual('?fields[tableA]=fieldA,fieldB&fields[tableB]=fieldC,fieldD');
  });

  it('should parse filters', () => {
    expect(parseJsonApiQuery({
      filters: {
        fieldA: null,
        fieldB: 15,
      },
    })).toEqual('?filter[fieldA]=NULL&filter[fieldB]=15');
  });

  it('should combine all json api queries', () => {
    expect(parseJsonApiQuery({
      includes: ['relationA', 'relationB'],
      sparseFieldsets: {
        tableA: ['fieldA', 'fieldB'],
        tableB: ['fieldC', 'fieldD'],
      },
      filters: {
        fieldA: null,
        fieldB: 15,
      },
    })).toEqual('?include=relationA,relationB&fields[tableA]=fieldA,fieldB&fields[tableB]=fieldC,fieldD&filter[fieldA]=NULL&filter[fieldB]=15');
  });
});
