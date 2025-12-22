import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../shared/user.repository';
import { ListUsersDto } from './list-users.dto';
import { User } from '../../../../entities/user.entity';

export interface ListUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ListUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(listUsersDto: ListUsersDto): Promise<ListUsersResult> {
    const page = listUsersDto.page || 1;
    const limit = listUsersDto.limit || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAll(skip, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }
}