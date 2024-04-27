import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMemberController } from './controllers';
import { ProjectMember } from './entities';
import { ProjectMemberService } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectMember])],
	providers: [ProjectMemberService],
	controllers: [ProjectMemberController],
})
export class ProjectMemberModule {}
