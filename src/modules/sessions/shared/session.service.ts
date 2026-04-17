import { Injectable } from '@nestjs/common';
import { SubjectTypeEnum } from '@/entities/enums';
import { SessionRepository } from './session.repository';
import { CacheService } from '@/cache/cache.service';
import { UserSession } from '@/entities/userSession.entity';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 创建新会话
   */
  async createSession(
    userId: string,
    subjectType: SubjectTypeEnum,
    token: string,
    deviceId: string,
  ) {
    return await this.sessionRepository.createSession(
      userId,
      subjectType,
      token,
      deviceId,
    );
  }

  /**
   * 根据token查找会话
   */
  async findByToken(token: string) {
    return await this.sessionRepository.findByToken(token);
  }

  /**
   * 获取用户的所有活跃会话
   */
  async findActiveSessionsByUser(userId: string, subjectType: SubjectTypeEnum) {
    return await this.sessionRepository.findActiveSessionsByUser(
      userId,
      subjectType,
    );
  }

  /**
   * 获取所有会话
   */
  async findAll(
    select: (keyof UserSession)[],
    skip: number,
    take: number,
  ): Promise<[UserSession[], number]> {
    return this.sessionRepository.findAndCount({
      select,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 使会话失效
   */
  async invalidateSession(token: string) {
    // 先删除Redis中的token缓存
    await this.deleteTokenFromCache(token);

    // 再使数据库中的会话失效
    return await this.sessionRepository.invalidateSession(token);
  }

  /**
   * 使用户的所有会话失效
   */
  async invalidateAllUserSessions(
    userId: string,
    subjectType: SubjectTypeEnum,
  ) {
    return await this.sessionRepository.invalidateAllUserSessions(
      userId,
      subjectType,
    );
  }

  /**
   * 检查会话是否有效
   */
  async isSessionValid(token: string) {
    return await this.sessionRepository.isSessionValid(token);
  }

  /**
   * 获取会话统计信息
   */
  async getSessionStats(userId: string, subjectType: SubjectTypeEnum) {
    return await this.sessionRepository.getSessionStats(userId, subjectType);
  }

  /**
   * 从Redis中删除token缓存
   */
  private async deleteTokenFromCache(token: string): Promise<void> {
    // 尝试删除所有可能的缓存键
    const cacheKeys = [
      `auth:${token}`,
      `auth:member:${token}`,
      `auth:community_staff:${token}`,
      `auth:platform_staff:${token}`,
    ];

    for (const cacheKey of cacheKeys) {
      await this.cacheService.delete(cacheKey);
    }
  }
}
