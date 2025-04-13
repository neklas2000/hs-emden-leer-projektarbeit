import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { type UUID } from 'crypto';
import { DeepPartial, Repository } from 'typeorm';

import { CryptoService } from '@Common/services';
import { User } from '@Entities/user';
import type { Filters } from '@JsonApi/lib';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class UserService extends CRUDService<User> {
	constructor(
		@InjectRepository(User)
		repository: Repository<User>,
		private readonly crypto: CryptoService,
	) {
		super(repository);
	}

	register(partialUser: DeepPartial<User>): Promise<User> {
		return this.createOne(partialUser);
	}

	findByEmailAddress(email: string): Promise<User | null> {
		return this.readOneBy({ emailAddress: email });
	}

	override updateOne(id: UUID, payload: DeepPartial<User>): Promise<User> {
		if (payload.password) {
			payload.password = this.crypto.hash(payload.password);
		}

		return <Promise<User>>super.updateOne(id, payload);
	}

	queryAll(filters: Filters<User>): Promise<User[]> {
		const query = this.repository.createQueryBuilder('u').select();
		let hasWhere = false;

		if (filters?.academicTitle) {
			query.where("LOWER(COALESCE(u.academic_title, '')) LIKE :academicTitle", {
				academicTitle: `%${(<string>filters.academicTitle).toLowerCase()}%`,
			});
			hasWhere = true;
		}

		if (filters?.firstName) {
			const whereQuery = "LOWER(COALESCE(u.first_name, '')) LIKE :firstName";
			const whereParam = {
				firstName: `%${(<string>filters.firstName).toLowerCase()}%`,
			};

			if (hasWhere) {
				query.orWhere(whereQuery, whereParam);
			} else {
				query.where(whereQuery, whereParam);
			}

			hasWhere = true;
		}

		if (filters?.lastName) {
			const whereQuery = "LOWER(COALESCE(u.last_name, '')) LIKE :lastName";
			const whereParam = {
				lastName: `%${(<string>filters.lastName).toLowerCase()}%`,
			};

			if (hasWhere) {
				query.orWhere(whereQuery, whereParam);
			} else {
				query.where(whereQuery, whereParam);
			}
		}

		return query.getMany();
	}
}
