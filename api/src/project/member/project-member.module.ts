import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMemberController } from './controllers';
import { ProjectMember } from './entities';
import { ProjectMemberService } from './services';
import { Project } from '../entities';
import { UserModule } from '@Routes/User/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectMember, Project]), UserModule],
	providers: [ProjectMemberService],
	controllers: [ProjectMemberController],
	exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
