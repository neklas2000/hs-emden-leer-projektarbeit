import { Controller } from '@Common/decorators';
import { ProjectMilestone } from '@Entities/project-milestone';
import { CRUDControllerMixin } from '../crud-mixin.controller';
import { ProjectMilestoneService } from './project-milestone.service';

@Controller(() => ProjectMilestone, {
	path: 'project-milestone',
	version: '1',
})
export class ProjectMilestoneController extends CRUDControllerMixin(ProjectMilestone) {
	constructor(private readonly projectMilestones: ProjectMilestoneService) {
		super(projectMilestones);
	}
}
