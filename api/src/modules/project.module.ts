import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from '@Controllers/project.controller';
import { Project } from '@Entities/project';
import { ProjectMember } from '@Entities/project-member';
import { ProjectMilestone } from '@Entities/project-milestone';
import { ProjectService } from '@Services/project.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

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
