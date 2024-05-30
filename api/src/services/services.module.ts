import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { DateService } from './date.service';

@Module({
	providers: [CryptoService, DateService],
})
export class ServicesModule {}
