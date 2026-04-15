import { Injectable } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { ListCommunityStaffsDto } from './list-community-staffs.dto';
import { CommunityStaff } from '../../../../entities/communityStaff.entity';

@Injectable()
export class ListCommunityStaffsService {
  constructor(private readonly repository: CommunityStaffRepository) {}

  async execute(dto: ListCommunityStaffsDto): Promise<{
    data: CommunityStaff[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = dto.page ?? 0;
    const limit = dto.limit ?? 10;
    const skip = page * limit;

    const [data, total] = await this.repository.findWithPagination(skip, limit);

    return {
      data,
      total,
      page,
      limit,
    };
  }
}