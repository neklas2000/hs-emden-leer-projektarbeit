import { Module } from '@nestjs/common';

import { ProfileController } from './controllers';
import { UserModule } from '@Routes/User/user.module';
import { ProjectMemberModule } from '@Routes/Project/member/project-member.module';

@Module({
	imports: [UserModule, ProjectMemberModule],
	providers: [],
	controllers: [ProfileController],
})
export class ProfileModule {}
