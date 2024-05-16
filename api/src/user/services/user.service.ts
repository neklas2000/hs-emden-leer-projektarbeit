import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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

	register(userData: DeepPartial<User>): Promise<User> {
		const user = this.userRepository.create(userData);

		return user.save();
	}
}
