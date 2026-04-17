import { Injectable } from '@nestjs/common';
import { SessionService } from '../../shared/session.service';
import { GetSessionsDto } from './get-sessions.dto';
import { GetSessionsResult } from './get-sessions.interface';
import { SubjectTypeEnum } from '@/entities/enums';

@Injectable()
export class GetSessionsService {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * 获取当前用户的活跃会话列表（分页查询）
   */
  async execute(
    userId: string,
    subjectType: SubjectTypeEnum,
    getSessionsDto: GetSessionsDto,
  ): Promise<GetSessionsResult> {
    const { page = 1, limit = 10 } = getSessionsDto;
    const skip = (page - 1) * limit;

    // 获取会话总数
    const total = await this.sessionService.countActiveSessionsByUser(
      userId,
      subjectType,
    );

    // 获取分页会话列表
    const sessions = await this.sessionService.findActiveSessionsByUser(
      userId,
      subjectType,
      skip,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      sessions,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
