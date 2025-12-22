import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../shared/user.repository';
import { User } from '../../../../entities/user.entity';

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    return user;
  }
}