import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../shared/user.repository';
import { CreateUserDto } from './create-user.dto';
import { User } from '../../../../entities/user.entity';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    // 检查邮箱是否已存在
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('邮箱已存在');
    }

    // 创建用户
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = createUserDto.password; // 注意：实际项目中应该加密密码
    user.firstName = createUserDto.firstName || '';
    user.lastName = createUserDto.lastName || '';

    return await this.userRepository.save(user);
  }
}
