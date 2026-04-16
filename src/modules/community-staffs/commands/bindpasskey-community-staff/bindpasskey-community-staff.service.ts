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

    // 绑定用户密钥 - 检查是否已存在PassKey凭证
    const communityStaffUserCredentials = communityStaff.userCredential || [];

    // 查找是否已存在PassKey类型的凭证
    let passkeyCredential = communityStaffUserCredentials.find(
      (cred) => cred.credentialType === CredentialTypeEnum.PassKey,
    );

    if (passkeyCredential) {
      // 如果已存在，则更新凭证
      passkeyCredential.credential = await bcrypt.hash(
        bindPasskeyCommunityStaffDto.passkey,
        10,
      );
    } else {
      // 如果不存在，则创建新凭证
      passkeyCredential = new UserCredential();
      passkeyCredential.subjectType = SubjectTypeEnum.CommunityStaff;
      passkeyCredential.credentialType = CredentialTypeEnum.PassKey;
      passkeyCredential.credential = await bcrypt.hash(
        bindPasskeyCommunityStaffDto.passkey,
        10,
      );
      communityStaffUserCredentials.push(passkeyCredential);
    }

    communityStaff.userCredential = [...communityStaffUserCredentials];

    return await this.communityStaffRepository.save(communityStaff);
  }
}
