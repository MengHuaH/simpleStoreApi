import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../shared/member.repository';
import { ListMembersDto } from './list-members.dto';
import { Member } from '../../../../entities/member.entity';
import { pageResponse } from '@/common/utils/response.util';
import { ApiPageResponse } from '@/common/interface/response.interface';
import { DtoToSelect } from '@/common/utils/entityToDto.util';

@Injectable()
export class ListMembersService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(
    listMembersDto: ListMembersDto,
  ): Promise<ApiPageResponse<Member>> {
    const page = listMembersDto.page || 1;
    const limit = listMembersDto.limit || 10;
    const skip = (page - 1) * limit;
    const select = DtoToSelect({
      phone: true,
      isActive: true,
    });

    const [members, total] = await this.memberRepository.findAll(
      select,
      skip,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    return pageResponse(members, total, page, limit, totalPages);
  }
}
