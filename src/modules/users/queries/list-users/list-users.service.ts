import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../shared/user.repository';
import { ListUsersDto } from './list-users.dto';
import { User } from '../../../../entities/user.entity';
import { pageResponse } from '@/common/utils/response.util';
import { ApiPageResponse } from '@/common/interface/response.interface';
import { DtoToSelect } from '@/common/utils/entityToDto.util';

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

  async execute(listUsersDto: ListUsersDto): Promise<ApiPageResponse<User>> {
    const page = listUsersDto.page || 1;
    const limit = listUsersDto.limit || 10;
    const skip = (page - 1) * limit;
    const select = DtoToSelect({
      username: true,
      email: true,
    });

    const [users, total] = await this.userRepository.findAll(
      select,
      skip,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    return pageResponse(users, total, page, limit, totalPages);
  }
}
