import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Brackets } from 'typeorm';
import { Member } from '../../../../entities/member.entity';
import { SearchMembersDto } from './search-members.dto';

export interface SearchMembersResult {
  members: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SearchMembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async execute(
    searchMembersDto: SearchMembersDto,
  ): Promise<SearchMembersResult> {
    const page = searchMembersDto.page || 1;
    const limit = searchMembersDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = await this.memberRepository.createQueryBuilder('member');

    // 使用子查询判断会员是否在线
    const onlineSubQuery = query
      .subQuery()
      .select('1')
      .from('user_sessions', 'us')
      .where('us.memberId = member.id')
      .andWhere('us.isActive = :isActive')
      .getQuery();

    query.andWhere(
      new Brackets((qb) => {
        if (searchMembersDto.phone && searchMembersDto.phone.trim()) {
          qb.orWhere('member.phone LIKE :phone', {
            phone: `%${searchMembersDto.phone}%`,
          });
        }
        if (searchMembersDto.isActive !== undefined) {
          qb.orWhere('member.isActive = :isActive', {
            isActive: searchMembersDto.isActive,
          });
        }
        if (searchMembersDto.isOnline !== undefined) {
          if (searchMembersDto.isOnline) {
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
      'member.userSession',
      'userSession',
      'userSession.isActive = :isActive',
      { isActive: true },
    );

    const [members, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('member.createdAt', 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      members,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
