import { Test, TestingModule } from '@nestjs/testing';
import { MilestoneEstimateService } from './milestone-estimate.service';

describe('MilestoneEstimateService', () => {
  let service: MilestoneEstimateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MilestoneEstimateService],
    }).compile();

    service = module.get<MilestoneEstimateService>(MilestoneEstimateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
