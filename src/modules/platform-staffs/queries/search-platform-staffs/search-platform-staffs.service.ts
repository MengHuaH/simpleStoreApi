import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { PlatformStaff } from '../../../../entities/platformStaff.entity';
import { SearchPlatformStaffsDto } from './search-platform-staffs.dto';

export interface SearchPlatformStaffsResult {
  platformStaffs: PlatformStaff[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SearchPlatformStaffsService {
  constructor(
    @InjectRepository(PlatformStaff)
    private readonly platformStaffRepository: Repository<PlatformStaff>,
  ) {}

  async execute(
    searchPlatformStaffsDto: SearchPlatformStaffsDto,
  ): Promise<SearchPlatformStaffsResult> {
    const page = searchPlatformStaffsDto.page || 1;
    const limit = searchPlatformStaffsDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = await this.platformStaffRepository.createQueryBuilder('platformStaff');

    // 使用子查询判断平台员工是否在线
    const onlineSubQuery = query
      .subQuery()
      .select('1')
      .from('user_sessions', 'us')
      .where('us.platformStaffId = platformStaff.id')
      .andWhere('us.isActive = :isActive')
      .getQuery();

    query.andWhere(
      new Brackets((qb) => {
        if (searchPlatformStaffsDto.keyword && searchPlatformStaffsDto.keyword.trim()) {
          qb.orWhere('platformStaff.phone LIKE :phone', {
            phone: `%${searchPlatformStaffsDto.keyword}%`,
          });
        }
        if (searchPlatformStaffsDto.isActive !== undefined) {
          qb.orWhere('platformStaff.isActive = :isActive', {
            isActive: searchPlatformStaffsDto.isActive,
          });
        }
        if (searchPlatformStaffsDto.isOnline !== undefined) {
          if (searchPlatformStaffsDto.isOnline) {
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
      'platformStaff.userSession', 
      'userSession', 
      'userSession.isActive = :isActive', 
      { isActive: true }
    );

    const [platformStaffs, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('platformStaff.createdAt', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      platformStaffs,
      total,
      page,
      limit,
      totalPages,
    };
  }
}