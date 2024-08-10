import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMemberController } from '@Controllers/project-member.controller';
import { Project } from '@Entities/project';
import { ProjectMember } from '@Entities/project-member';
import { UserModule } from '@Modules/user.module';
import { ProjectMemberService } from '@Services/project-member.service';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectMember, Project]), UserModule],
	providers: [ProjectMemberService],
	controllers: [ProjectMemberController],
	exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
