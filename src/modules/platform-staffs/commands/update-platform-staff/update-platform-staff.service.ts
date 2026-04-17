import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { UpdatePlatformStaffDto } from './update-platform-staff.dto';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';

@Injectable()
export class UpdatePlatformStaffService {
  constructor(private readonly repository: PlatformStaffRepository) {}

  async execute(
    id: string,
    dto: UpdatePlatformStaffDto,
  ): Promise<PlatformStaff> {
    // 检查平台员工是否存在
    const existingStaff = await this.repository.findById(id);
    if (!existingStaff) {
      throw new NotFoundException('平台员工不存在');
    }

    // 如果更新手机号，检查是否重复
    if (dto.phone && dto.phone !== existingStaff.phone) {
      const staffWithSamePhone = await this.repository.findOne(dto.phone);
      if (staffWithSamePhone) {
        throw new ConflictException('该手机号已被其他平台员工使用');
      }
      existingStaff.phone = dto.phone;
    }

    // 更新其他字段
    if (dto.isActive !== undefined) {
      existingStaff.isActive = dto.isActive;
    }

    return await this.repository.save(existingStaff);
  }
}
