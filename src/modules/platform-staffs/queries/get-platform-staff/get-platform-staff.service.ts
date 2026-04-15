import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { GetPlatformStaffDto } from './get-platform-staff.dto';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';

@Injectable()
export class GetPlatformStaffService {
  constructor(private readonly repository: PlatformStaffRepository) {}

  async execute(dto: GetPlatformStaffDto): Promise<PlatformStaff> {
    const platformStaff = await this.repository.findById(dto.id);
    if (!platformStaff) {
      throw new NotFoundException('平台员工不存在');
    }

    return platformStaff;
  }
}