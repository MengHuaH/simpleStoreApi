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

    // 绑定用户密钥
    const userCredential = new UserCredential();
    userCredential.subjectType = SubjectTypeEnum.Member;
    userCredential.credentialType = CredentialTypeEnum.PassKey;
    userCredential.credential = await bcrypt.hash(
      bindPasskeyPlatformStaffDto.passkey,
      10,
    );
    platformStaff.userCredential.push(userCredential);

    return await this.platformStaffRepository.save(platformStaff);
  }
}
