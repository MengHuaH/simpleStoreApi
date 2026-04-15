import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';
import { BindPasskeyMemberDto } from './bindpasskey-member.dto';
import { Member } from '../../../../entities/member.entity';
import * as bcrypt from 'bcrypt';
import { CredentialTypeEnum, SubjectTypeEnum } from '@/entities/enums';
import { UserCredential } from '@/entities';

@Injectable()
export class BindPasskeyMemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(
    id: string,
    bindPasskeyMemberDto: BindPasskeyMemberDto,
  ): Promise<Member> {
    // 查找用户
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    if (!member.isActive) {
      throw new Error('用户未激活');
    }

    // 绑定用户密钥
    const userCredential = new UserCredential();
    userCredential.subjectType = SubjectTypeEnum.Member;
    userCredential.credentialType = CredentialTypeEnum.PassKey;
    userCredential.credential = await bcrypt.hash(
      bindPasskeyMemberDto.passkey,
      10,
    );
    member.userCredential.push(userCredential);

    return await this.memberRepository.save(member);
  }
}
