import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Brackets } from 'typeorm';
import { User } from '../../../../entities/user.entity';
import { SearchUsersDto } from './search-users.dto';

export interface SearchUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SearchUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(searchUsersDto: SearchUsersDto): Promise<SearchUsersResult> {
    const page = searchUsersDto.page || 1;
    const limit = searchUsersDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = await this.userRepository.createQueryBuilder('user');

    query.andWhere(
      new Brackets((qb) => {
        if (searchUsersDto.userName && searchUsersDto.userName.trim()) {
          qb.orWhere('user.username LIKE :username', {
            username: `%${searchUsersDto.userName}%`,
          });
        }
        if (searchUsersDto.email && searchUsersDto.email.trim()) {
          qb.orWhere('user.email LIKE :email', {
            email: `%${searchUsersDto.email}%`,
          });
        }
      }),
    );

    const [users, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

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
