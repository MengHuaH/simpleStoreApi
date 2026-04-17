import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';
import { Member } from '../../../../entities/member.entity';

@Injectable()
export class EnableMemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string): Promise<Member> {
    // 查找用户
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // 启用账户
    await this.memberRepository.updateActive(id, true);

    // 返回更新后的用户信息
    return (await this.memberRepository.findById(id)) as Member;
  }
}
