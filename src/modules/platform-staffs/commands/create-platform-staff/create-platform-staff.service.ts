import { Injectable, ConflictException } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { CreatePlatformStaffDto } from './create-platform-staff.dto';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';

@Injectable()
export class CreatePlatformStaffService {
  constructor(private readonly repository: PlatformStaffRepository) {}

  async execute(dto: CreatePlatformStaffDto): Promise<PlatformStaff> {
    // 检查手机号是否已存在
    const existingStaff = await this.repository.findOne(dto.phone);
    if (existingStaff) {
      throw new ConflictException('该手机号已注册为平台员工');
    }

    // 创建平台员工
    const platformStaff = new PlatformStaff();
    platformStaff.phone = dto.phone;
    platformStaff.isActive = dto.isActive ?? true;

    return await this.repository.save(platformStaff);
  }
}