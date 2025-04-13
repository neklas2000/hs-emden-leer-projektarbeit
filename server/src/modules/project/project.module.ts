import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from '@Entities/project';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Project])],
	providers: [ProjectService],
	controllers: [ProjectController],
	exports: [ProjectService],
})
export class ProjectModule {}
