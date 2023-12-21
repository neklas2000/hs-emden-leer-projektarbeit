import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMemberController } from 'src/controllers/project-member.controller';
import { ProjectMember } from 'src/entities/project-member';
import { ProjectMemberService } from 'src/services/project-member.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMember])],
  providers: [ProjectMemberService],
  controllers: [ProjectMemberController],
})
export class ProjectMemberModule {}
