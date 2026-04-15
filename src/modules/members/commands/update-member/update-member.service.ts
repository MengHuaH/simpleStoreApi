import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';
import { UpdateMemberDto } from './update-member.dto';
import { Member } from '../../../../entities/member.entity';
import * as bcrypt from 'bcrypt';
import { CredentialTypeEnum } from '@/entities/enums';

@Injectable()
export class UpdateMemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string, updateUserDto: UpdateMemberDto): Promise<Member> {
    // 查找用户
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    // 检查旧密码是否正确
    const oldPassword = await bcrypt.hash(updateUserDto.oldPassword, 10);
    if (
      member.userCredential.find(
        (item) =>
          item.credentialType === CredentialTypeEnum.Password &&
          item.credential !== oldPassword,
      )
    ) {
      throw new Error('旧密码错误');
    }

    if (member.isActive) {
      throw new Error('用户已激活');
    }

    // 更新用户密码
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // 更新用户信息
    Object.assign(member, updateUserDto);

    return await this.memberRepository.save(member);
  }
}
