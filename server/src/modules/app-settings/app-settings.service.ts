import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { type UUID } from 'crypto';
import { Repository } from 'typeorm';

import { AppSettings } from '@Entities/app-settings';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class AppSettingsService extends CRUDService<AppSettings> {
	constructor(@InjectRepository(AppSettings) repository: Repository<AppSettings>) {
		super(repository);
	}

	initializeForNewlyRegisteredUser(userId: UUID) {
		return this.createOne({
			user: {
				id: userId,
			},
		});
	}
}
