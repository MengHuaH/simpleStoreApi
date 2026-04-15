import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';

@Injectable()
export class DeletePlatformStaffService {
  constructor(private readonly repository: PlatformStaffRepository) {}

  async execute(id: string): Promise<void> {
    // 检查平台员工是否存在
    const existingStaff = await this.repository.findById(id);
    if (!existingStaff) {
      throw new NotFoundException('平台员工不存在');
    }

    await this.repository.delete(id);
  }
}