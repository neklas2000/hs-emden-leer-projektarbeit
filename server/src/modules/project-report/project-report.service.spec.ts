import { Test, TestingModule } from '@nestjs/testing';
import { ProjectReportService } from './project-report.service';

describe('ProjectReportService', () => {
  let service: ProjectReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectReportService],
    }).compile();

    service = module.get<ProjectReportService>(ProjectReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
