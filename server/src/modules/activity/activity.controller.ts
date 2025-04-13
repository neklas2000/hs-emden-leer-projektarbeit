import { Controller } from '@Common/decorators';
import { ProjectActivity } from '@Entities/project-activity';
import { CRUDControllerMixin } from '../crud-mixin.controller';
import { ActivityService } from './activity.service';

@Controller(() => ProjectActivity, {
	path: 'activity',
	version: '1',
})
export class ActivityController extends CRUDControllerMixin(ProjectActivity) {
	constructor(private readonly activities: ActivityService) {
		super(activities);
	}
}
