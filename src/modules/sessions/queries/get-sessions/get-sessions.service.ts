import { Injectable } from '@nestjs/common';
import { SubjectTypeEnum } from '@/entities/enums';
import { SessionService } from '../../shared/session.service';
import { UserSession } from '@/entities/userSession.entity';

@Injectable()
export class GetSessionsService {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * 获取当前用户的活跃会话列表
   */
  async execute(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{
    success: boolean;
    data: UserSession[];
    message: string;
  }> {
    const sessions = await this.sessionService.findActiveSessionsByUser(
      userId,
      subjectType,
    );

    return {
      success: true,
      data: sessions,
      message: '获取会话列表成功',
    };
  }

  /**
   * 获取会话统计信息
   */
  async getStats(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{
    success: boolean;
    data: { totalSessions: number; activeSessions: number };
    message: string;
  }> {
    const stats = await this.sessionService.getSessionStats(
      userId,
      subjectType,
    );

    return {
      success: true,
      data: stats,
      message: '获取会话统计成功',
    };
  }

  /**
   * 检查会话状态
   */
  async checkSession(
    sessionId: string,
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{
    success: boolean;
    isValid?: boolean;
    data?: any;
    message: string;
  }> {
    // 先获取会话
    const session = await this.sessionService.findByToken(sessionId);

    if (!session) {
      return {
        success: false,
        isValid: false,
        message: '会话不存在',
      };
    }

    // 验证会话所有权
    const hasPermission = await this.validateSessionOwnership(
      session,
      userId,
      subjectType,
    );
    if (!hasPermission) {
      return {
        success: false,
        isValid: false,
        message: '无权查看此会话',
      };
    }

    const isValid = await this.sessionService.isSessionValid(sessionId);

    return {
      success: true,
      data: {
        isValid,
        sessionInfo: session,
      },
      message: isValid ? '会话有效' : '会话已失效',
    };
  }

  /**
   * 验证会话所有权
   */
  private async validateSessionOwnership(
    session: UserSession,
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<boolean> {
    switch (subjectType) {
      case SubjectTypeEnum.Member:
        return session.member?.id === userId;
      case SubjectTypeEnum.PlatformStaff:
        return session.platformStaff?.id === userId;
      case SubjectTypeEnum.CommunityStaff:
        return session.communityStaff?.id === userId;
      default:
        return false;
    }
  }
}
