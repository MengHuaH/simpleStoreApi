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
    console.log(id);
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    if (!member.isActive) {
      throw new Error('用户未激活');
    }

    // 绑定用户密钥 - 检查是否已存在PassKey凭证
    const memberUserCredentials = member.userCredential || [];

    // 查找是否已存在PassKey类型的凭证
    let passkeyCredential = memberUserCredentials.find(
      (cred) => cred.credentialType === CredentialTypeEnum.PassKey,
    );

    if (passkeyCredential) {
      // 如果已存在，则更新凭证
      passkeyCredential.credential = await bcrypt.hash(
        bindPasskeyMemberDto.passkey,
        10,
      );
    } else {
      // 如果不存在，则创建新凭证
      passkeyCredential = new UserCredential();
      passkeyCredential.subjectType = SubjectTypeEnum.Member;
      passkeyCredential.credentialType = CredentialTypeEnum.PassKey;
      passkeyCredential.credential = await bcrypt.hash(
        bindPasskeyMemberDto.passkey,
        10,
      );
      member.userCredential = [...member.userCredential, passkeyCredential];
    }

    return await this.memberRepository.save(member);
  }
}
