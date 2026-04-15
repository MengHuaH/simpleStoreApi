import { Injectable } from '@nestjs/common';
import { CommunityStaffRepository } from '../../shared/community-staff.repository';
import { ListCommunityStaffsDto } from './list-community-staffs.dto';
import { CommunityStaff } from '../../../../entities/communityStaff.entity';
import { DtoToSelect } from '@/common/utils/entityToDto.util';
import { pageResponse } from '@/common/utils/response.util';
import { ApiPageResponse } from '@/common/interface/response.interface';

@Injectable()
export class ListCommunityStaffsService {
  constructor(private readonly repository: CommunityStaffRepository) {}

  async execute(
    dto: ListCommunityStaffsDto,
  ): Promise<ApiPageResponse<CommunityStaff>> {
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
