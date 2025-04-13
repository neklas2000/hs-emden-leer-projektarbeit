import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMilestoneService } from './project-milestone.service';

describe('ProjectMilestoneService', () => {
  let service: ProjectMilestoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectMilestoneService],
    }).compile();

    service = module.get<ProjectMilestoneService>(ProjectMilestoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
