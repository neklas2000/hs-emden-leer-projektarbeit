import { Module } from '@nestjs/common';

import { ProfileController } from '@Controllers/profile.controller';
import { ProjectMemberModule } from '@Modules/project-member.module';
import { UserModule } from '@Modules/user.module';

@Module({
	imports: [UserModule, ProjectMemberModule],
	providers: [],
	controllers: [ProfileController],
})
export class ProfileModule {}
