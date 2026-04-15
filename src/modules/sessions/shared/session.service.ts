import { Injectable } from '@nestjs/common';
import { SubjectTypeEnum } from '@/entities/enums';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

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
   * 使会话失效
   */
  async invalidateSession(token: string) {
    return await this.sessionRepository.invalidateSession(token);
  }

  /**
   * 使用户的所有会话失效
   */
  async invalidateAllUserSessions(userId: string, subjectType: SubjectTypeEnum) {
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
}