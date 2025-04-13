import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityPredecessor } from '@Entities/activity-predecessor';
import { ActivitySuccessor } from '@Entities/activity-successor';
import { ProjectActivity } from '@Entities/project-activity';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectActivity, ActivityPredecessor, ActivitySuccessor])],
	controllers: [ActivityController],
	providers: [ActivityService],
})
export class ActivityModule {}
