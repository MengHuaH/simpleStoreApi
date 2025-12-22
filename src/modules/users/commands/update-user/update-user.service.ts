import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../shared/user.repository';
import { UpdateUserDto } from './update-user.dto';
import { User } from '../../../../entities/user.entity';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // 查找用户
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // 如果更新邮箱，检查是否已存在
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('邮箱已存在');
      }
    }

    // 更新用户信息
    Object.assign(user, updateUserDto);
    
    return await this.userRepository.save(user);
  }
}