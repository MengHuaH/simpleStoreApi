import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { GetCommunityStaffDto } from './get-community-staff.dto';
import { CommunityStaff } from '../../../../entities/communityStaff.entity';

@Injectable()
export class GetCommunityStaffService {
  constructor(private readonly repository: CommunityStaffRepository) {}

  async execute(dto: GetCommunityStaffDto): Promise<CommunityStaff> {
    const communityStaff = await this.repository.findById(dto.id);
    if (!communityStaff) {
      throw new NotFoundException('社区员工不存在');
    }

    return communityStaff;
  }
}