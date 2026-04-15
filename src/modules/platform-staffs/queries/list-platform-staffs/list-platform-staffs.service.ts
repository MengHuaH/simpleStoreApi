import { Injectable } from '@nestjs/common';
import { PlatformStaffRepository } from '../../shared/platform-staff.repository';
import { ListPlatformStaffsDto } from './list-platform-staffs.dto';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';
import { DtoToSelect } from '@/common/utils/entityToDto.util';
import { ApiPageResponse } from '@/common/interface/response.interface';
import { pageResponse } from '@/common/utils/response.util';

@Injectable()
export class ListPlatformStaffsService {
  constructor(private readonly repository: PlatformStaffRepository) {}

  async execute(
    dto: ListPlatformStaffsDto,
  ): Promise<ApiPageResponse<PlatformStaff>> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;
    const select = DtoToSelect({
      phone: true,
      isActive: true,
    });

    const [members, total] = await this.repository.findAll(select, skip, limit);
    const totalPages = Math.ceil(total / limit);

    return pageResponse(members, total, page, limit, totalPages);
  }
}
