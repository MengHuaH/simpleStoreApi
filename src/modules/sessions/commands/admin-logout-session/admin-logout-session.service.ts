import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '@/entities/userSession.entity';
import { Member } from '@/entities/member.entity';
import { PlatformStaff } from '@/entities/platformStaff.entity';
import { CommunityStaff } from '@/entities/communityStaff.entity';
import { SessionService } from '../../shared/session.service';
import { CacheService } from '@/cache/cache.service';
import { SubjectTypeEnum } from '@/entities/enums';

@Injectable()
export class AdminLogoutSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(PlatformStaff)
    private readonly platformStaffRepository: Repository<PlatformStaff>,
    @InjectRepository(CommunityStaff)
    private readonly communityStaffRepository: Repository<CommunityStaff>,
    private readonly sessionService: SessionService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 管理员踢出指定会话
   */
  async execute(sessionId: string): Promise<{
    success: boolean;
    data?: {
      session: UserSession;
      affectedUser: {
        id: string;
        subjectType: string;
      };
    };
    message: string;
  }> {
    // 查找会话
    const session = await this.userSessionRepository.findOne({
      where: { token: sessionId },
      relations: ['member', 'platformStaff', 'communityStaff'],
    });

    if (!session) {
      throw new NotFoundException('会话不存在');
    }

    // 获取受影响用户信息
    const affectedUser = this.getAffectedUserInfo(session);

    // 1. 使数据库会话失效
    const success = await this.sessionService.invalidateSession(sessionId);

    if (!success) {
      return {
        success: false,
        message: '会话登出失败',
      };
    }

    // 2. 清理Redis缓存中的会话信息
    await this.clearSessionCache(sessionId, session.subjectType);

    return {
      success: true,
      data: {
        session,
        affectedUser,
      },
      message: '会话登出成功',
    };
  }

  /**
   * 管理员批量踢出用户的所有会话
   */
  async logoutAllUserSessions(
    userId: string,
    subjectType: string,
  ): Promise<{
    success: boolean;
    data: {
      logoutCount: number;
      affectedUser: {
        id: string;
        subjectType: string;
      };
    };
    message: string;
  }> {
    const affectedUser = {
      id: userId,
      subjectType,
    };

    // 1. 清理Redis缓存中该用户的所有会话
    await this.clearAllUserSessionsCache(userId, subjectType as any);

    // 2. 使用基础服务登出所有数据库会话
    const count = await this.sessionService.invalidateAllUserSessions(
      userId,
      subjectType as any,
    );

    return {
      success: true,
      data: {
        logoutCount: count,
        affectedUser,
      },
      message: `成功登出用户 ${count} 个会话`,
    };
  }

  /**
   * 根据条件批量踢出会话
   */
  async logoutSessionsByCriteria(criteria: {
    subjectType?: string;
    userId?: string;
    activeOnly?: boolean;
  }): Promise<{
    success: boolean;
    data: {
      logoutCount: number;
      criteria: any;
    };
    message: string;
  }> {
    // 构建查询条件
    const whereCondition: any = {};

    if (criteria.subjectType) {
      whereCondition.subjectType = criteria.subjectType;
    }

    if (criteria.activeOnly !== undefined) {
      whereCondition.isActive = criteria.activeOnly;
    }

    // 处理用户ID过滤
    if (criteria.userId) {
      const userCondition = this.buildUserCondition(
        criteria.userId,
        criteria.subjectType,
      );
      if (userCondition) {
        Object.assign(whereCondition, userCondition);
      }
    }

    // 查找符合条件的会话
    const sessions = await this.userSessionRepository.find({
      where: whereCondition,
      select: ['token'],
    });

    // 批量登出
    let logoutCount = 0;
    for (const session of sessions) {
      const success = await this.sessionService.invalidateSession(
        session.token,
      );
      if (success) {
        logoutCount++;
      }
    }

    return {
      success: true,
      data: {
        logoutCount,
        criteria,
      },
      message: `根据条件成功登出 ${logoutCount} 个会话`,
    };
  }

  /**
   * 获取受影响用户信息
   */
  private getAffectedUserInfo(session: UserSession): {
    id: string;
    subjectType: string;
  } {
    if (session.member) {
      return {
        id: session.member.id,
        subjectType: 'member',
      };
    } else if (session.platformStaff) {
      return {
        id: session.platformStaff.id,
        subjectType: 'platformStaff',
      };
    } else if (session.communityStaff) {
      return {
        id: session.communityStaff.id,
        subjectType: 'communityStaff',
      };
    } else {
      return {
        id: '',
        subjectType: 'unknown',
      };
    }
  }

  /**
   * 构建用户查询条件
   */
  private buildUserCondition(userId: string, subjectType?: string): any {
    if (subjectType) {
      // 如果指定了主体类型，直接使用对应的关联字段
      switch (subjectType) {
        case 'Member':
          return { member: { id: userId } };
        case 'PlatformStaff':
          return { platformStaff: { id: userId } };
        case 'CommunityStaff':
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
   * 清理单个会话的Redis缓存
   */
  private async clearSessionCache(
    token: string,
    subjectType: SubjectTypeEnum,
  ): Promise<void> {
    const cacheKey = this.buildCacheKey(token, subjectType);
    await this.cacheService.delete(cacheKey);
    console.log(`清理Redis缓存: ${cacheKey}`);
  }

  /**
   * 清理用户所有会话的Redis缓存
   */
  private async clearAllUserSessionsCache(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<void> {
    try {
      let activeSessions: { token: string }[] = [];

      // 方法1：使用标准查询
      try {
        const whereCondition = this.buildUserWhereCondition(
          userId,
          subjectType,
        );
        activeSessions = await this.userSessionRepository.find({
          where: {
            isActive: true,
            ...whereCondition,
          },
          select: ['token'],
        });
        console.log(
          `方法1找到用户 ${userId} 的活跃会话: ${activeSessions.length} 个`,
        );
      } catch (error) {
        console.warn(`方法1查询失败:`, error);
      }

      // 方法2：如果方法1没找到记录，使用查询构建器（备用方案）
      if (activeSessions.length === 0) {
        try {
          activeSessions = await this.getUserActiveSessionsWithQueryBuilder(
            userId,
            subjectType,
          );
          console.log(
            `方法2找到用户 ${userId} 的活跃会话: ${activeSessions.length} 个`,
          );
        } catch (error) {
          console.error(`方法2查询失败:`, error);
        }
      }

      // 批量清理缓存
      for (const session of activeSessions) {
        await this.clearSessionCache(session.token, subjectType);
      }

      console.log(
        `清理用户 ${userId} 的所有会话缓存，共 ${activeSessions.length} 个`,
      );
    } catch (error) {
      console.error(`清理用户 ${userId} 会话缓存时发生错误:`, error);
    }
  }

  /**
   * 构建缓存键
   */
  private buildCacheKey(token: string, subjectType: SubjectTypeEnum): string {
    switch (subjectType) {
      case SubjectTypeEnum.Member:
        return `auth:member:${token}`;
      case SubjectTypeEnum.CommunityStaff:
        return `auth:community_staff:${token}`;
      case SubjectTypeEnum.PlatformStaff:
        return `auth:platform_staff:${token}`;
      default:
        return `auth:${token}`;
    }
  }

  /**
   * 构建用户查询条件
   */
  private buildUserWhereCondition(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): any {
    console.log(`构建用户查询条件: ${userId}, ${subjectType}`);
    switch (subjectType) {
      case SubjectTypeEnum.Member:
        return { member: { id: userId } };
      case SubjectTypeEnum.CommunityStaff:
        return { communityStaff: { id: userId } };
      case SubjectTypeEnum.PlatformStaff:
        return { platformStaff: { id: userId } };
      default:
        return {};
    }
  }

  /**
   * 管理员禁用账户
   * 先强制登出所有会话，再禁用账户
   */
  async disableUserAccount(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{
    success: boolean;
    data: {
      logoutCount: number;
      affectedUser: {
        id: string;
        subjectType: string;
      };
      accountDisabled: boolean;
    };
    message: string;
  }> {
    try {
      const affectedUser = {
        id: userId,
        subjectType: subjectType.toString(),
      };

      // 1. 强制登出用户的所有会话
      const logoutResult = await this.logoutAllUserSessions(
        userId,
        subjectType.toString(),
      );

      if (!logoutResult.success) {
        return {
          success: false,
          data: {
            logoutCount: 0,
            affectedUser,
            accountDisabled: false,
          },
          message: `登出会话失败: ${logoutResult.message}`,
        };
      }

      // 2. 禁用账户
      const accountDisabled = await this.disableAccount(userId, subjectType);

      if (!accountDisabled) {
        return {
          success: false,
          data: {
            logoutCount: logoutResult.data.logoutCount,
            affectedUser,
            accountDisabled: false,
          },
          message: '禁用账户失败',
        };
      }

      return {
        success: true,
        data: {
          logoutCount: logoutResult.data.logoutCount,
          affectedUser,
          accountDisabled: true,
        },
        message: `成功禁用用户账户，登出 ${logoutResult.data.logoutCount} 个会话`,
      };
    } catch (error) {
      console.error(`禁用用户账户时发生错误:`, error);
      return {
        success: false,
        data: {
          logoutCount: 0,
          affectedUser: { id: userId, subjectType: subjectType.toString() },
          accountDisabled: false,
        },
        message: `禁用账户时发生错误: ${error.message}`,
      };
    }
  }

  /**
   * 禁用具体账户
   */
  private async disableAccount(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<boolean> {
    try {
      let result;

      switch (subjectType) {
        case SubjectTypeEnum.Member:
          result = await this.memberRepository.update(
            { id: userId },
            { isActive: false },
          );
          break;
        case SubjectTypeEnum.PlatformStaff:
          result = await this.platformStaffRepository.update(
            { id: userId },
            { isActive: false },
          );
          break;
        case SubjectTypeEnum.CommunityStaff:
          result = await this.communityStaffRepository.update(
            { id: userId },
            { isActive: false },
          );
          break;
        default:
          return false;
      }

      return (result.affected || 0) > 0;
    } catch (error) {
      console.error(`禁用 ${subjectType} 账户时发生错误:`, error);
      return false;
    }
  }

  /**
   * 使用查询构建器获取用户活跃会话（备用方案）
   */
  private async getUserActiveSessionsWithQueryBuilder(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{ token: string }[]> {
    const query = this.userSessionRepository.createQueryBuilder('session');

    // 根据主体类型添加关联条件
    switch (subjectType) {
      case SubjectTypeEnum.Member:
        query
          .innerJoin('session.member', 'member')
          .where('member.id = :userId', { userId });
        break;
      case SubjectTypeEnum.CommunityStaff:
        query
          .innerJoin('session.communityStaff', 'communityStaff')
          .where('communityStaff.id = :userId', { userId });
        break;
      case SubjectTypeEnum.PlatformStaff:
        query
          .innerJoin('session.platformStaff', 'platformStaff')
          .where('platformStaff.id = :userId', { userId });
        break;
      default:
        return [];
    }

    // 添加活跃状态条件
    query.andWhere('session.isActive = :isActive', { isActive: true });

    return await query.select('session.token').getMany();
  }
}
