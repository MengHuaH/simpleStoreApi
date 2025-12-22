import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../shared/user.repository';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    // 查找用户
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // 删除用户
    await this.userRepository.delete(id);
  }
}