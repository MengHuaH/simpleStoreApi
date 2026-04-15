import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';

@Injectable()
export class DeleteMemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string): Promise<void> {
    // 查找用户
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    // 删除用户
    await this.memberRepository.delete(id);
  }
}
