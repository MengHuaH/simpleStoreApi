import { Injectable } from '@nestjs/common';
import { SubjectTypeEnum } from '@/entities/enums';
import { SessionService } from '../../shared/session.service';

@Injectable()
export class GetSessionStatsService {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * 获取会话统计信息
   */
  async execute(
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
}
