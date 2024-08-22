import { ProjectTypePipe } from '@Pipes/project-type.pipe';

describe('Pipe: ProjectTypePipe', () => {
  let pipe: ProjectTypePipe;

  beforeAll(() => {
    pipe = new ProjectTypePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform(Nullable<string>): string', () => {
    it('should return an empty string, since the given value was null', () => {
      expect(pipe.transform(null)).toEqual('');
    });

    it('should return an empty string, since the given value was an empty string', () => {
      expect(pipe.transform('')).toEqual('');
    });

    it('should return the transformed value, since the given value was neither null nor an empty string', () => {
      expect(pipe.transform('Softwareprojekt')).toEqual('vom Typ "Softwareprojekt" -');
    });
  });
});
