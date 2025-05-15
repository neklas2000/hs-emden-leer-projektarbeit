import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppSettings } from '@Entities/app-settings';
import { AppSettingsController } from './app-settings.controller';
import { AppSettingsService } from './app-settings.service';

@Module({
	imports: [TypeOrmModule.forFeature([AppSettings])],
	controllers: [AppSettingsController],
	providers: [AppSettingsService],
	exports: [AppSettingsService],
})
export class AppSettingsModule {}
