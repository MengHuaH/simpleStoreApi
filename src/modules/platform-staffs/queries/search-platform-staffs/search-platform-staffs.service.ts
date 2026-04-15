import { Injectable } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { SearchPlatformStaffsDto } from './search-platform-staffs.dto';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';

@Injectable()
export class SearchPlatformStaffsService {
  constructor(private readonly repository: PlatformStaffRepository) {}

  async execute(dto: SearchPlatformStaffsDto): Promise<PlatformStaff[]> {
    return await this.repository.searchByPhone(dto.keyword);
  }
}