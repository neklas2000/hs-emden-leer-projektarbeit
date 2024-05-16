import { Module } from '@nestjs/common';

import { ProfileController } from './controllers';
import { UserModule } from '@Routes/User/user.module';

@Module({
	imports: [UserModule],
	providers: [],
	controllers: [ProfileController],
})
export class ProfileModule {}
