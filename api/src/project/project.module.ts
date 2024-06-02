import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from './controllers';
import { Project } from './entities';
import { ProjectService } from './services';
import { ProjectMilestoneService } from './milestone/services';
import { ProjectMemberService } from './member/services';
import { ProjectMember } from './member/entities';
import { ProjectMilestone } from './milestone/entities';

@Module({
	imports: [
		TypeOrmModule.forFeature([Project]),
		TypeOrmModule.forFeature([ProjectMilestone]),
		TypeOrmModule.forFeature([ProjectMember]),
	],
	providers: [ProjectService, ProjectMilestoneService, ProjectMemberService],
	controllers: [ProjectController],
})
export class ProjectModule {}
