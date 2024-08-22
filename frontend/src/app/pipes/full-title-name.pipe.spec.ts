import { FullTitleNamePipe } from '@Pipes/full-title-name.pipe';

describe('Pipe: FullTitleNamePipe', () => {
  let pipe: FullTitleNamePipe;

  beforeAll(() => {
    pipe = new FullTitleNamePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform(User, boolean?): string', () => {
    it('should return a fully populated label with every possible data', () => {
      expect(pipe.transform({
        academicTitle: 'Prof.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
      } as any)).toEqual('Prof. Max Mustermann (1234567)');
    });

    it('should return a label without the academic title and the matriculation number, since the matriculation number was null', () => {
      expect(pipe.transform({
        academicTitle: null,
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: null,
      } as any)).toEqual('Max Mustermann');
    });

    it("should return a label without the matriculation number, since the flag 'includeMatriculationNumber' was set to false", () => {
      expect(pipe.transform({
        academicTitle: 'Prof.',
        firstName: 'Max',
        lastName: 'Mustermann',
        matriculationNumber: 1234567,
      } as any, false)).toEqual('Prof. Max Mustermann');
    });
  });
});
