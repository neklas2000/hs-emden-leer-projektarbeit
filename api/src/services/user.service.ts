import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { User } from 'src/entities/user';

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
}
