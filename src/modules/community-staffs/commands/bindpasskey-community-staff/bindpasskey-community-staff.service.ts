import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { BindPasskeyCommunityStaffDto } from './bindpasskey-community-staff.dto';
import * as bcrypt from 'bcrypt';
import { CredentialTypeEnum, SubjectTypeEnum } from '@/entities/enums';
import { UserCredential, CommunityStaff } from '@/entities';

@Injectable()
export class BindPasskeyCommunityStaffService {
  constructor(
    private readonly communityStaffRepository: CommunityStaffRepository,
  ) {}

  async execute(
    id: string,
    bindPasskeyCommunityStaffDto: BindPasskeyCommunityStaffDto,
  ): Promise<CommunityStaff> {
    // 查找用户
    const communityStaff = await this.communityStaffRepository.findById(id);
    if (!communityStaff) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    if (!communityStaff.isActive) {
      throw new Error('用户未激活');
    }

    // 绑定用户密钥
    const userCredential = new UserCredential();
    userCredential.subjectType = SubjectTypeEnum.Member;
    userCredential.credentialType = CredentialTypeEnum.PassKey;
    userCredential.credential = await bcrypt.hash(
      bindPasskeyCommunityStaffDto.passkey,
      10,
    );
    communityStaff.userCredential.push(userCredential);

    return await this.communityStaffRepository.save(communityStaff);
  }
}
