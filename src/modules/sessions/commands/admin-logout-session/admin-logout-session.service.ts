import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '@/entities/userSession.entity';
import { SessionService } from '../../shared/session.service';

@Injectable()
export class AdminLogoutSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly sessionService: SessionService,
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

    // 使会话失效
    const success = await this.sessionService.invalidateSession(sessionId);

    if (!success) {
      return {
        success: false,
        message: '会话登出失败',
      };
    }

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

    // 使用基础服务登出所有会话
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
        subjectType: session.subjectType,
      };
    } else if (session.platformStaff) {
      return {
        id: session.platformStaff.id,
        subjectType: session.subjectType,
      };
    } else if (session.communityStaff) {
      return {
        id: session.communityStaff.id,
        subjectType: session.subjectType,
      };
    }

    return {
      id: 'unknown',
      subjectType: session.subjectType || 'unknown',
    };
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
}
