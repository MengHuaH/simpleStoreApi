import { Injectable } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { SearchCommunityStaffsDto } from './search-community-staffs.dto';
import { CommunityStaff } from '../../../../entities/communityStaff.entity';

@Injectable()
export class SearchCommunityStaffsService {
  constructor(private readonly repository: CommunityStaffRepository) {}

  async execute(dto: SearchCommunityStaffsDto): Promise<CommunityStaff[]> {
    return await this.repository.searchByPhone(dto.keyword);
  }
}