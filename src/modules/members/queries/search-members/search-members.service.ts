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

    // 左连接 userSession 关系，用于判断在线状态
    query.leftJoinAndSelect('member.userSession', 'userSession');

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
            qb.andWhere('userSession.isActive = :isActive', {
              isActive: true,
            });
          } else {
            // 离线：没有活跃的会话或没有会话
            qb.andWhere(
              'userSession.id IS NULL OR userSession.isActive = :isActive',
              {
                isActive: false,
              },
            );
          }
        }
      }),
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
