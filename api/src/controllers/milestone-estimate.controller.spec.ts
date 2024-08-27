import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { MilestoneEstimateController } from '@Controllers/milestone-estimate.controller';
import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { DateService } from '@Services/date.service';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';
import { provideMilestoneEstimateRepository } from '@Test/Providers/milestone-estimate-repository.provider';

describe('Controller: MilestoneEstimateController', () => {
	let controller: MilestoneEstimateController;
	let milestoneEstimates: MilestoneEstimateService;
	let milestoneEstimate: MilestoneEstimate;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [MilestoneEstimateService, provideMilestoneEstimateRepository(), DateService],
			controllers: [MilestoneEstimateController],
		}).compile();

		milestoneEstimates = module.get(MilestoneEstimateService);
		controller = module.get(MilestoneEstimateController);
		milestoneEstimate = {
			reportDate: '2024-01-01',
			estimationDate: '2024-01-15',
			milestone: {
				id: '123',
			},
		} as any;
	});

	it('should create', () => {
		expect(milestoneEstimates).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('create(DeepPartial<MilestoneEstimate>): Observable<MilestoneEstimate>', () => {
		it('should create a new milestone estimate', (done) => {
			const milestoneEstimateWithId = { ...milestoneEstimate, id: '1' } as any;
			jest.spyOn(milestoneEstimates, 'create').mockResolvedValue(milestoneEstimateWithId);

			controller
				.create(milestoneEstimate)
				.pipe(take(1))
				.subscribe((result) => {
					expect(milestoneEstimates.create).toHaveBeenCalledWith(milestoneEstimate);
					expect(result).toEqual(milestoneEstimateWithId);

					done();
				});
		});
	});

	describe('update(string, DeepPartial<MilestoneEstimate>): Observable<Success>', () => {
		it('should update an existing milestone', (done) => {
			jest.spyOn(milestoneEstimates, 'update').mockResolvedValue(true);

			controller
				.update('1', milestoneEstimate)
				.pipe(take(1))
				.subscribe((result) => {
					expect(milestoneEstimates.update).toHaveBeenCalledWith('1', milestoneEstimate);
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});

	describe('delete(string): Observable<Success>', () => {
		it('should delte an existing milestone', (done) => {
			jest.spyOn(milestoneEstimates, 'delete').mockResolvedValue(true);

			controller
				.delete('2')
				.pipe(take(1))
				.subscribe((result) => {
					expect(milestoneEstimates.delete).toHaveBeenCalledWith('2');
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});
});
