import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'crypto-js';
import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { User } from '@Routes/User/entities';
import { Nullable } from '@Types/index';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	findAll(
		where: FindOptionsWhere<User>,
		select: FindOptionsSelect<User>,
		relations: FindOptionsRelations<User>,
	): Promise<User[]> {
		return this.userRepository.find({ where, select, relations });
	}

	findOne(
		matriculationNumber: number,
		where: FindOptionsWhere<User>,
		select: FindOptionsSelect<User>,
		relations: FindOptionsRelations<User>,
	): Promise<User> {
		return this.userRepository.findOne({
			where: {
				...where,
				matriculationNumber,
			},
			select,
			relations,
		});
	}

	findByEmail(email: string): Promise<Nullable<User>> {
		return this.userRepository.findOneBy({ email });
	}

	findById(id: string): Promise<Nullable<User>> {
		return this.userRepository.findOneBy({ id });
	}

	findByIdAndCredentials(id: string, where: FindOptionsWhere<User> = {}): Promise<Nullable<User>> {
		if (where?.password) {
			where.password = crypto.SHA256(where.password as string).toString(crypto.enc.Hex);
		}

		return this.userRepository.findOneBy({ id, ...where });
	}

	register(userData: DeepPartial<User>): Promise<User> {
		const user = this.userRepository.create(userData);

		return user.save();
	}

	async update(id: string, payload: DeepPartial<User>): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });

		if (!user) {
			throw new NotFoundException();
		}

		if (payload?.password) {
			payload.password = crypto.SHA256(payload.password).toString(crypto.enc.Hex);
		}

		for (const attribute in payload) {
			user[attribute] = payload[attribute];
		}

		return user.save();
	}
}
