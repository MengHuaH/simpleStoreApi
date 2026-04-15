import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '@/entities/userSession.entity';
import { SubjectTypeEnum } from '@/entities/enums';
import { ListAllSessionsDto } from './list-all-sessions.dto';
import { ApiPageResponse } from '@/common/interface/response.interface';
import { pageResponse } from '@/common/utils/response.util';

@Injectable()
export class ListAllSessionsService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  /**
   * 分页查询所有会话
   */
  async execute(
    queryDto: ListAllSessionsDto,
  ): Promise<ApiPageResponse<UserSession>> {
    const { page, limit, subjectType, activeOnly, userId } = queryDto;
    const pageNum = page || 1;
    const limitNum = limit || 10;
    const skip = (pageNum - 1) * limitNum;

    // 构建查询条件
    const whereCondition: any = {};

    if (subjectType) {
      whereCondition.subjectType = subjectType;
    }

    if (activeOnly !== undefined) {
      whereCondition.isActive = activeOnly;
    }

    // 处理用户ID过滤
    if (userId) {
      // 根据用户ID查找对应的关联关系
      const userCondition = this.buildUserCondition(userId, subjectType);
      if (userCondition) {
        Object.assign(whereCondition, userCondition);
      }
    }

    // 查询数据
    const [sessions, total] = await this.userSessionRepository.findAndCount({
      where: whereCondition,
      relations: ['member', 'platformStaff', 'communityStaff'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limitNum);

    return pageResponse(sessions, total, pageNum, limitNum, totalPages);
  }

  /**
   * 构建用户查询条件
   */
  private buildUserCondition(
    userId: string,
    subjectType?: SubjectTypeEnum,
  ): any {
    if (subjectType) {
      // 如果指定了主体类型，直接使用对应的关联字段
      switch (subjectType) {
        case SubjectTypeEnum.Member:
          return { member: { id: userId } };
        case SubjectTypeEnum.PlatformStaff:
          return { platformStaff: { id: userId } };
        case SubjectTypeEnum.CommunityStaff:
          return { communityStaff: { id: userId } };
        default:
          return null;
      }
    } else {
      // 如果没有指定主体类型，需要查询所有可能的关联字段
      return {
        $or: [
          { member: { id: userId } },
          { platformStaff: { id: userId } },
          { communityStaff: { id: userId } },
        ],
      };
    }
  }

  /**
   * 获取会话统计信息
   */
  async getStats(): Promise<{
    success: boolean;
    data: {
      totalSessions: number;
      activeSessions: number;
      bySubjectType: Record<string, number>;
    };
    message: string;
  }> {
    // 总会话数
    const totalSessions = await this.userSessionRepository.count();

    // 活跃会话数
    const activeSessions = await this.userSessionRepository.count({
      where: { isActive: true },
    });

    // 按主体类型统计
    const bySubjectType = await this.userSessionRepository
      .createQueryBuilder('session')
      .select('session.subjectType', 'subjectType')
      .addSelect('COUNT(*)', 'count')
      .where('session.isActive = :isActive', { isActive: true })
      .groupBy('session.subjectType')
      .getRawMany();

    const statsByType: Record<string, number> = {};
    bySubjectType.forEach((item: any) => {
      statsByType[item.subjectType] = parseInt(item.count);
    });

    return {
      success: true,
      data: {
        totalSessions,
        activeSessions,
        bySubjectType: statsByType,
      },
      message: '获取会话统计成功',
    };
  }
}
