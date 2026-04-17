import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { CommunityStaff } from '../../../../entities/communityStaff.entity';

@Injectable()
export class EnableCommunityStaffService {
  constructor(
    private readonly communityStaffRepository: CommunityStaffRepository,
  ) {}

  async execute(id: string): Promise<CommunityStaff> {
    // 查找用户
    const communityStaff = await this.communityStaffRepository.findById(id);
    if (!communityStaff) {
      throw new NotFoundException(`社区员工 ID ${id} 不存在`);
    }

    // 启用账户
    await this.communityStaffRepository.updateActive(id, true);

    // 返回更新后的用户信息
    return (await this.communityStaffRepository.findById(id)) as CommunityStaff;
  }
}
