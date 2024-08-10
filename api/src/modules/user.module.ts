import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@Controllers/user.controller';
import { User } from '@Entities/user';
import { CryptoService } from '@Services/crypto.service';
import { UserService } from '@Services/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService, CryptoService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
