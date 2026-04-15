import { Injectable, ConflictException } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { CreateCommunityStaffDto } from './create-community-staff.dto';
import { CommunityStaff } from '../../../../entities/communityStaff.entity';
import * as bcrypt from 'bcrypt';
import {
  SubjectTypeEnum,
  CredentialTypeEnum,
} from '../../../../entities/enums';
import { UserCredential } from '../../../../entities/userCredential.entity';

@Injectable()
export class CreateCommunityStaffService {
  constructor(private readonly repository: CommunityStaffRepository) {}

  async execute(dto: CreateCommunityStaffDto): Promise<CommunityStaff> {
    // 检查手机号是否已存在
    const existingStaff = await this.repository.findOne(dto.phone);
    if (existingStaff) {
      throw new ConflictException('该手机号已注册为社区员工');
    }

    // 创建社区员工

    const userCredential = new UserCredential();
    userCredential.subjectType = SubjectTypeEnum.Member;
    userCredential.credentialType = CredentialTypeEnum.Password;
    userCredential.credential = await bcrypt.hash(dto.password, 10);

    const communityStaff = new CommunityStaff();
    communityStaff.phone = dto.phone;
    communityStaff.isActive = dto.isActive ?? true;

    return await this.repository.save(communityStaff);
  }
}
