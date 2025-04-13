import { Test, TestingModule } from '@nestjs/testing';
import { MilestoneEstimateController } from './milestone-estimate.controller';

describe('MilestoneEstimateController', () => {
  let controller: MilestoneEstimateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilestoneEstimateController],
    }).compile();

    controller = module.get<MilestoneEstimateController>(MilestoneEstimateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
