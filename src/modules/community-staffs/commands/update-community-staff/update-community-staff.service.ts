import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { UpdateCommunityStaffDto } from './update-community-staff.dto';
import { CommunityStaff } from '../../../../entities';

@Injectable()
export class UpdateCommunityStaffService {
  constructor(private readonly repository: CommunityStaffRepository) {}

  async execute(
    id: string,
    dto: UpdateCommunityStaffDto,
  ): Promise<CommunityStaff> {
    // 检查社区员工是否存在
    const existingStaff = await this.repository.findById(id);
    if (!existingStaff) {
      throw new NotFoundException('社区员工不存在');
    }

    // 如果更新手机号，检查是否重复
    if (dto.phone && dto.phone !== existingStaff.phone) {
      const staffWithSamePhone = await this.repository.findOne(dto.phone);
      if (staffWithSamePhone) {
        throw new ConflictException('该手机号已被其他社区员工使用');
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
