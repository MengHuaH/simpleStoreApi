import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';
import { Member } from '../../../../entities/member.entity';

@Injectable()
export class GetMemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`会员 ID ${id} 不存在`);
    }
    return member;
  }
}
