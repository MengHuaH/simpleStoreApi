import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';

@Injectable()
export class EnablePlatformStaffService {
  constructor(
    private readonly platformStaffRepository: PlatformStaffRepository,
  ) {}

  async execute(id: string): Promise<PlatformStaff> {
    // 查找用户
    const platformStaff = await this.platformStaffRepository.findById(id);
    if (!platformStaff) {
      throw new NotFoundException(`平台员工 ID ${id} 不存在`);
    }

    // 启用账户
    await this.platformStaffRepository.updateActive(id, true);

    // 返回更新后的用户信息
    return (await this.platformStaffRepository.findById(id)) as PlatformStaff;
  }
}
