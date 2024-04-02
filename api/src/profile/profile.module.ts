import { Module } from '@nestjs/common';

import { ProfileController } from './controllers';

@Module({
  imports: [],
  providers: [],
  controllers: [ProfileController],
})
export class ProfileModule {}
