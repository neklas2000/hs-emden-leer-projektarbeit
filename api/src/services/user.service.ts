import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { User } from '@Entities/user';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { UserDoesNotExistException } from '@Exceptions/user-does-not-exist.exception';
import { CryptoService } from '@Services/crypto.service';
import { Nullable } from '@Types/nullable';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly crypto: CryptoService,
	) {}

	findAll(
		where: FindOptionsWhere<User>,
		select: FindOptionsSelect<User>,
		relations: FindOptionsRelations<User>,
	): Promise<User[]> {
		return this.userRepository.find({ where, select, relations });
	}

	searchAll(searchTerm: string): Promise<User[]> {
		return this.userRepository
			.createQueryBuilder('u')
			.select()
			.where(
				"LOWER(CONCAT(COALESCE(u.academic_title, ''), ' ', COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))) LIKE :searchTerm",
				{
					searchTerm: `%${searchTerm.toLowerCase()}%`,
				},
			)
			.getMany();
	}

	findByEmail(email: string): Promise<Nullable<User>> {
		return this.userRepository.findOneBy({ email });
	}

	findById(id: string): Promise<Nullable<User>> {
		return this.userRepository.findOneBy({ id });
	}

	findByIdAndCredentials(id: string, where: FindOptionsWhere<User> = {}): Promise<Nullable<User>> {
		if (where.password) {
			where.password = this.crypto.hash(where.password as string);
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

		if (payload.password) {
			payload.password = this.crypto.hash(payload.password);
		}

		for (const attribute in payload) {
			user[attribute] = payload[attribute];
		}

		return user.save();
	}

	async delete(id: string) {
		try {
			const user = await this.findById(id);

			if (!user) throw new UserDoesNotExistException(null, null);

			await user.remove();

			return true;
		} catch (exception) {
			if (exception instanceof UserDoesNotExistException) throw exception;

			throw new BadRequestException(exception);
		}
	}
}
