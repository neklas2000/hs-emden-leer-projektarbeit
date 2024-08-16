import { UUID } from '@Utils/uuid';

describe('Util: UUID', () => {
  it('should report that the uuid is not well formed since the input is undefined', () => {
    expect(UUID.isWellFormed(undefined)).toBeFalsy();
  });

  it('should report that the uuid is not well formed', () => {
    expect(UUID.isWellFormed('aaaa')).toBeFalsy();
  });

  it('should report that the uuid is well formed', () => {
    expect(UUID.isWellFormed('c94c5795-a051-11ee-b998-0242c0a87002')).toBeTruthy();
  });
});
