import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { ProjectMilestone } from '../entities';
import {
  PROJECT_MILESTONE_REPOSITORY_TOKEN,
  provideProjectMilestoneRepository,
} from '@Mocks/Providers/project-milestone-repository.provider';
import { ProjectMilestoneService } from './project-milestone.service';

describe('Service: ProjectMilestoneService', () => {
  let service: ProjectMilestoneService;
  let repository: Repository<ProjectMilestone>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProjectMilestoneService, provideProjectMilestoneRepository()],
    }).compile();

    service = module.get(ProjectMilestoneService);
    repository = module.get(PROJECT_MILESTONE_REPOSITORY_TOKEN);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find all milestones', (done) => {
    jest
      .spyOn(repository, 'find')
      .mockResolvedValue(['Milestone 1', 'Milestone 2'] as any[]);

    service.findAll({}, {}, {}).then((result) => {
      expect(repository.find).toHaveBeenCalledWith({
        where: {},
        select: {},
        relations: {},
      });
      expect(result).toEqual(['Milestone 1', 'Milestone 2']);

      done();
    });
  });

  it('should find a milestone by an id', (done) => {
    jest.spyOn(repository, 'findOne').mockResolvedValue('Milestone' as any);

    service.findOne('1', {}, {}, {}).then((result) => {
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        select: {},
        relations: {},
      });
      expect(result).toEqual('Milestone');

      done();
    });
  });

  it('should create a new milestone and delete the id', (done) => {
    jest
      .spyOn(repository, 'create')
      .mockReturnValue({ name: 'Milestone' } as any);
    jest.spyOn(repository, 'save').mockResolvedValue('Milestone' as any);

    service
      .createOne({
        id: '1',
        name: 'Milestone',
      })
      .then((result) => {
        expect(repository.create).toHaveBeenCalledWith({ name: 'Milestone' });
        expect(repository.save).toHaveBeenCalledWith(
          { name: 'Milestone' },
          { reload: true },
        );
        expect(result).toEqual('Milestone');

        done();
      });
  });

  it('should create a new milestone and not delete the id', (done) => {
    jest
      .spyOn(repository, 'create')
      .mockReturnValue({ name: 'Milestone' } as any);
    jest.spyOn(repository, 'save').mockResolvedValue('Milestone' as any);

    service
      .createOne({
        name: 'Milestone',
        estimates: [],
      })
      .then((result) => {
        expect(repository.create).toHaveBeenCalledWith({
          name: 'Milestone',
          estimates: [],
        });
        expect(repository.save).toHaveBeenCalledWith(
          { name: 'Milestone' },
          { reload: true },
        );
        expect(result).toEqual('Milestone');

        done();
      });
  });
});
