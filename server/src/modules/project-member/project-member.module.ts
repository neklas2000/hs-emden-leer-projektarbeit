import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMember } from '@Entities/project-member';
import { UserModule } from '@Modules/user/user.module';
import { ProjectMemberService } from './project-member.service';
import { ProjectMemberController } from './project-member.controller';

@Module({
	imports: [UserModule, TypeOrmModule.forFeature([ProjectMember])],
	providers: [ProjectMemberService],
	controllers: [ProjectMemberController],
})
export class ProjectMemberModule {}
