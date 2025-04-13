import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMilestoneController } from './project-milestone.controller';

describe('ProjectMilestoneController', () => {
  let controller: ProjectMilestoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectMilestoneController],
    }).compile();

    controller = module.get<ProjectMilestoneController>(ProjectMilestoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
