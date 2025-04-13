import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	StreamableFile,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

import { ValidFileSizePipe } from '@Common/pipes/valid-file-size.pipe';
import { User } from '@Common/decorators/user.decorator';
import { File } from '@Entities/file';
import { CRUDControllerMixin } from '../crud-mixin.controller';
import { FileadminService } from './fileadmin.service';

@Controller({
	path: 'fileadmin',
	version: '2',
})
export class FileadminController extends CRUDControllerMixin(File, 'findOneById') {
	@Inject(ConfigService)
	static readonly config: ConfigService;

	constructor(private readonly fileadmin: FileadminService) {
		super(fileadmin);
	}

	@Get(':file')
	async readFile(@Param('file') fileName: string): Promise<StreamableFile> {
		return this.fileadmin.read(fileName);
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@Body()
		payload: FileUpload,
		@UploadedFile(new ValidFileSizePipe(FileadminController.config))
		file: Express.Multer.File,
		@User()
		user: Express.User,
	) {
		console.log(payload);
		console.log(file);

		return this.fileadmin.upload(file, user['sub'], payload?.name || null);
	}
}
