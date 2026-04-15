import { Injectable } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { ListPlatformStaffsDto } from './list-platform-staffs.dto';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';

@Injectable()
export class ListPlatformStaffsService {
  constructor(private readonly repository: PlatformStaffRepository) {}

  async execute(dto: ListPlatformStaffsDto): Promise<{
    data: PlatformStaff[];
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