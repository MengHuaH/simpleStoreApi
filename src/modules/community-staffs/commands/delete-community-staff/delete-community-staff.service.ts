import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';

@Injectable()
export class DeleteCommunityStaffService {
  constructor(private readonly repository: CommunityStaffRepository) {}

  async execute(id: string): Promise<void> {
    // 检查社区员工是否存在
    const existingStaff = await this.repository.findById(id);
    if (!existingStaff) {
      throw new NotFoundException('社区员工不存在');
    }

    await this.repository.delete(id);
  }
}