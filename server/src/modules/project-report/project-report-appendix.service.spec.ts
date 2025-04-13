import { Test, TestingModule } from '@nestjs/testing';
import { ProjectReportAppendixService } from './project-report-appendix.service';

describe('ProjectReportAppendixService', () => {
  let service: ProjectReportAppendixService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectReportAppendixService],
    }).compile();

    service = module.get<ProjectReportAppendixService>(ProjectReportAppendixService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
