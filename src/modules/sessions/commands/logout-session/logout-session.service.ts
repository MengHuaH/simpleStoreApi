import { Injectable } from '@nestjs/common';
import { SubjectTypeEnum } from '@/entities/enums';
import { SessionService } from '../../shared/session.service';
import { UserSession } from '@/entities/userSession.entity';

@Injectable()
export class LogoutSessionService {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * 登出指定会话
   */
  async execute(
    sessionId: string,
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    // 先获取会话
    const session = await this.sessionService.findByToken(sessionId);

    if (!session) {
      return {
        success: false,
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
        message: '无权操作此会话',
      };
    }

    const success = await this.sessionService.invalidateSession(sessionId);

    return {
      success,
      message: success ? '会话登出成功' : '会话登出失败',
    };
  }

  /**
   * 登出当前用户的所有会话
   */
  async logoutAllSessions(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{
    success: boolean;
    data: { logoutCount: number };
    message: string;
  }> {
    const count = await this.sessionService.invalidateAllUserSessions(
      userId,
      subjectType,
    );

    return {
      success: true,
      data: { logoutCount: count },
      message: `成功登出 ${count} 个会话`,
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
