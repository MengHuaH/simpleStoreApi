import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { BindPasskeyPlatformStaffDto } from './bindpasskey-platform-staff.dto';
import * as bcrypt from 'bcrypt';
import { CredentialTypeEnum, SubjectTypeEnum } from '@/entities/enums';
import { UserCredential, PlatformStaff } from '@/entities';

@Injectable()
export class BindPasskeyPlatformStaffService {
  constructor(
    private readonly platformStaffRepository: PlatformStaffRepository,
  ) {}

  async execute(
    id: string,
    bindPasskeyPlatformStaffDto: BindPasskeyPlatformStaffDto,
  ): Promise<PlatformStaff> {
    // 查找用户
    const platformStaff = await this.platformStaffRepository.findById(id);
    if (!platformStaff) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }

    if (!platformStaff.isActive) {
      throw new Error('用户未激活');
    }

    // 绑定用户密钥 - 检查是否已存在PassKey凭证
    const platformStaffUserCredentials = platformStaff.userCredential || [];

    // 查找是否已存在PassKey类型的凭证
    let passkeyCredential = platformStaffUserCredentials.find(
      (cred) => cred.credentialType === CredentialTypeEnum.PassKey,
    );

    if (passkeyCredential) {
      // 如果已存在，则更新凭证
      passkeyCredential.credential = await bcrypt.hash(
        bindPasskeyPlatformStaffDto.passkey,
        10,
      );
    } else {
      // 如果不存在，则创建新凭证
      passkeyCredential = new UserCredential();
      passkeyCredential.subjectType = SubjectTypeEnum.PlatformStaff;
      passkeyCredential.credentialType = CredentialTypeEnum.PassKey;
      passkeyCredential.credential = await bcrypt.hash(
        bindPasskeyPlatformStaffDto.passkey,
        10,
      );
      platformStaffUserCredentials.push(passkeyCredential);
    }

    platformStaff.userCredential = [...platformStaffUserCredentials];

    return await this.platformStaffRepository.save(platformStaff);
  }
}
