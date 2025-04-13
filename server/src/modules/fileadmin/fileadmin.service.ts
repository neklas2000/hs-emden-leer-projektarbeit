import { Injectable, RequestTimeoutException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { randomUUID } from 'crypto';
import { access, constants, createReadStream, writeFile, type PathLike } from 'fs';
import { join } from 'path';
import { catchError, Observable, switchMap, throwError, timeout, TimeoutError } from 'rxjs';
import { Repository } from 'typeorm';

import { File } from '@Entities/file';
import { FileNotFoundException } from '@Exceptions/file-not-found.exception';
import { promiseToObervable } from '@Common/utils';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class FileadminService extends CRUDService<File> {
	private readonly filesStore = join(process.cwd(), 'files');

	constructor(
		@InjectRepository(File)
		private readonly filesRepository: Repository<File>,
		private readonly config: ConfigService,
	) {
		super(filesRepository);
	}

	async read(fileName: string): Promise<StreamableFile> {
		const fileId = fileName.substring(0, fileName.lastIndexOf('.'));
		const filePath = join(this.filesStore, fileName);
		const fileExists = await this.exists(filePath);

		if (!fileExists) {
			throw new FileNotFoundException(fileName);
		}

		const fileRecord = await this.filesRepository.findOneBy({ id: fileId });
		const file = createReadStream(filePath);

		return new StreamableFile(file, {
			type: fileRecord?.mimeType || undefined,
			disposition: `attachment; filename="${fileName}"`,
		});
	}

	private exists(filePath: PathLike): Promise<boolean> {
		return new Promise((resolve) => {
			access(filePath, constants.F_OK, (err) => {
				resolve(!err);
			});
		});
	}

	upload(file: Express.Multer.File, userId: string, fileName?: Nullable<string>): Observable<File> {
		const controller = new AbortController();
		const { signal } = controller;
		const uuid = randomUUID();
		const ending = file.filename.substring(file.filename.lastIndexOf('.') + 1);

		const createFile$ = new Promise<UploadedFile>((resolve, reject) => {
			const uploadedFileName = `${uuid}.${ending}`;

			writeFile(join(this.filesStore, uploadedFileName), file.buffer, { signal }, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve({
						id: uuid,
						name: fileName || file.filename.substring(0, file.filename.lastIndexOf('.')),
						fileName: uploadedFileName,
					});
				}
			});
		});

		return promiseToObervable(createFile$).pipe(
			timeout(this.config.get('FILE_UPLOAD_TIMEOUT_IN_MS') || 5_000),
			catchError((err) => {
				if (err instanceof TimeoutError) {
					throw new RequestTimeoutException();
				}

				return throwError(() => err);
			}),
			switchMap((value: UploadedFile) => {
				const createdFile = this.filesRepository.create({
					id: value.id,
					name: value.name,
					mimeType: file.mimetype,
					uri: value.fileName,
					uploadedBy: {
						id: userId,
					},
				});

				return promiseToObervable(this.filesRepository.save(createdFile));
			}),
		);
	}

	async delete(fileId: string): Promise<SuccessResponse> {
		try {
			const deleteResult = await this.filesRepository.delete({ id: fileId });

			if (!deleteResult?.affected) throw new NoAffectedRowException();

			return {
				success: deleteResult.affected > 0,
			};
		} catch (err) {
			return err;
		}
	}
}
