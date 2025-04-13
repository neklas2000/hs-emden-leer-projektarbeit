import { Test, TestingModule } from '@nestjs/testing';
import { ProjectReportController } from './project-report.controller';

describe('ProjectReportController', () => {
  let controller: ProjectReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectReportController],
    }).compile();

    controller = module.get<ProjectReportController>(ProjectReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
