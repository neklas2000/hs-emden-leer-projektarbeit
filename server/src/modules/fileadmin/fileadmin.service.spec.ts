import { Test, TestingModule } from '@nestjs/testing';
import { FileadminService } from './fileadmin.service';

describe('FileadminService', () => {
  let service: FileadminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileadminService],
    }).compile();

    service = module.get<FileadminService>(FileadminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
