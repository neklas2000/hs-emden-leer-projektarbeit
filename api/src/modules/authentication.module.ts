import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from './user.module';
import { AuthenticationService } from 'src/services/authentication.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { AuthenticationController } from 'src/controllers/authentication.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30m',
      },
    }),
  ],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
