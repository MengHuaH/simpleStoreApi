import { Injectable } from '@nestjs/common';
import { SubjectTypeEnum } from '@/entities/enums';
import { SessionService } from '../../shared/session.service';
import { UserSession } from '@/entities/userSession.entity';

@Injectable()
export class CheckSessionService {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * 检查会话状态
   */
  async execute(
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