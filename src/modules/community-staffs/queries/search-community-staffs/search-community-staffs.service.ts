import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CommunityStaff } from '../../../../entities/communityStaff.entity';
import { SearchCommunityStaffsDto } from './search-community-staffs.dto';

export interface SearchCommunityStaffsResult {
  communityStaffs: CommunityStaff[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SearchCommunityStaffsService {
  constructor(
    @InjectRepository(CommunityStaff)
    private readonly communityStaffRepository: Repository<CommunityStaff>,
  ) {}

  async execute(
    searchCommunityStaffsDto: SearchCommunityStaffsDto,
  ): Promise<SearchCommunityStaffsResult> {
    const page = searchCommunityStaffsDto.page || 1;
    const limit = searchCommunityStaffsDto.limit || 10;
    const skip = (page - 1) * limit;

    const query =
      await this.communityStaffRepository.createQueryBuilder('communityStaff');

    // 使用子查询判断社区员工是否在线
    const onlineSubQuery = query
      .subQuery()
      .select('1')
      .from('user_sessions', 'us')
      .where('us.communityStaffId = communityStaff.id')
      .andWhere('us.isActive = :isActive')
      .getQuery();

    query.andWhere(
      new Brackets((qb) => {
        if (
          searchCommunityStaffsDto.keyword &&
          searchCommunityStaffsDto.keyword.trim()
        ) {
          qb.orWhere('communityStaff.phone LIKE :phone', {
            phone: `%${searchCommunityStaffsDto.keyword}%`,
          });
        }
        if (searchCommunityStaffsDto.isActive !== undefined) {
          qb.orWhere('communityStaff.isActive = :isActive', {
            isActive: searchCommunityStaffsDto.isActive,
          });
        }
        if (searchCommunityStaffsDto.isOnline !== undefined) {
          if (searchCommunityStaffsDto.isOnline) {
            // 在线：存在活跃的会话
            qb.andWhere(`EXISTS (${onlineSubQuery})`);
          } else {
            // 离线：不存在活跃的会话
            qb.andWhere(`NOT EXISTS (${onlineSubQuery})`);
          }
        }
      }),
    );

    // 左连接活跃的会话记录，只返回活跃的会话
    query.leftJoinAndSelect(
      'communityStaff.userSession',
      'userSession',
      'userSession.isActive = :isActive',
      { isActive: true },
    );

    const [communityStaffs, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('communityStaff.createdAt', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      communityStaffs,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
