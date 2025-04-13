import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from '@Entities/file';
import { FileadminService } from './fileadmin.service';
import { FileadminController } from './fileadmin.controller';

@Module({
	imports: [TypeOrmModule.forFeature([File])],
	providers: [FileadminService],
	controllers: [FileadminController],
})
export class FileadminModule {}
