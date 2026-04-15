import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';
import { UpdateMemberDto } from './update-member.dto';
import { Member } from '../../../../entities/member.entity';

@Injectable()
export class UpdateMemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string, updateUserDto: UpdateMemberDto): Promise<Member> {
    // 查找用户
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // 更新用户信息
    Object.assign(member, updateUserDto);

    return await this.memberRepository.save(member);
  }
}
