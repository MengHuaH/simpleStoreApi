import { Injectable, ConflictException } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';
import { CreateMemberDto } from './create-member.dto';
import { Member, UserCredential } from '../../../../entities';
import {
  SubjectTypeEnum,
  CredentialTypeEnum,
} from '../../../../entities/enums';

@Injectable()
export class CreateMemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(createMemberDto: CreateMemberDto): Promise<Member> {
    // 检查手机号是否已存在
    const existingMember = await this.memberRepository.findOne(
      createMemberDto.phone,
    );
    if (existingMember) {
      throw new ConflictException('手机号已存在');
    }

    // 创建成员

    const userCredential = new UserCredential();
    userCredential.subjectType = SubjectTypeEnum.Member;
    userCredential.credentialType = CredentialTypeEnum.Password;
    userCredential.credential = createMemberDto.password;

    const member = new Member();
    member.phone = createMemberDto.phone;
    member.isActive = true;
    member.userCredential = [userCredential];

    return await this.memberRepository.save(member);
  }
}
