import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserSession } from '@/entities/userSession.entity';
import { SubjectTypeEnum } from '@/entities/enums';

@Injectable()
export class SessionRepository extends Repository<UserSession> {
  constructor(private dataSource: DataSource) {
    super(UserSession, dataSource.createEntityManager());
  }

  /**
   * 创建新会话
   */
  async createSession(
    userId: string,
    subjectType: SubjectTypeEnum,
    token: string,
    deviceId: string,
  ): Promise<UserSession> {
    const session = this.create({
      subjectType,
      token,
      deviceId,
      isActive: true,
    });

    // 根据主体类型设置关联
    switch (subjectType) {
      case SubjectTypeEnum.Member:
        session.member = { id: userId } as any;
        break;
      case SubjectTypeEnum.PlatformStaff:
        session.platformStaff = { id: userId } as any;
        break;
      case SubjectTypeEnum.CommunityStaff:
        session.communityStaff = { id: userId } as any;
        break;
    }

    return await this.save(session);
  }

  /**
   * 根据token查找会话
   */
  async findByToken(token: string): Promise<UserSession | null> {
    return await this.findOne({
      where: { token },
      relations: ['member', 'platformStaff', 'communityStaff'],
    });
  }

  /**
   * 获取用户的所有活跃会话（支持分页）
   */
  async findActiveSessionsByUser(
    userId: string,
    subjectType: SubjectTypeEnum,
    skip?: number,
    limit?: number,
  ): Promise<UserSession[]> {
    const whereCondition: any = { isActive: true };

    switch (subjectType) {
      case SubjectTypeEnum.Member:
        whereCondition.member = { id: userId };
        break;
      case SubjectTypeEnum.PlatformStaff:
        whereCondition.platformStaff = { id: userId };
        break;
      case SubjectTypeEnum.CommunityStaff:
        whereCondition.communityStaff = { id: userId };
        break;
    }

    const queryOptions: any = {
      where: whereCondition,
      relations: ['member', 'platformStaff', 'communityStaff'],
      order: { createdAt: 'DESC' },
    };

    // 添加分页参数
    if (skip !== undefined) {
      queryOptions.skip = skip;
    }
    if (limit !== undefined) {
      queryOptions.take = limit;
    }

    return await this.find(queryOptions);
  }

  /**
   * 统计用户的活跃会话数量
   */
  async countActiveSessionsByUser(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<number> {
    const whereCondition: any = { isActive: true };

    switch (subjectType) {
      case SubjectTypeEnum.Member:
        whereCondition.member = { id: userId };
        break;
      case SubjectTypeEnum.PlatformStaff:
        whereCondition.platformStaff = { id: userId };
        break;
      case SubjectTypeEnum.CommunityStaff:
        whereCondition.communityStaff = { id: userId };
        break;
    }

    return await this.count({
      where: whereCondition,
    });
  }

  /**
   * 使会话失效
   */
  async invalidateSession(token: string): Promise<boolean> {
    const result = await this.update({ token }, { isActive: false });
    return (result.affected || 0) > 0;
  }

  /**
   * 使用户的所有会话失效
   */
  async invalidateAllUserSessions(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<number> {
    const whereCondition: any = { isActive: true };

    switch (subjectType) {
      case SubjectTypeEnum.Member:
        whereCondition.member = { id: userId };
        break;
      case SubjectTypeEnum.PlatformStaff:
        whereCondition.platformStaff = { id: userId };
        break;
      case SubjectTypeEnum.CommunityStaff:
        whereCondition.communityStaff = { id: userId };
        break;
    }

    const result = await this.update(whereCondition, { isActive: false });
    return result.affected || 0;
  }

  /**
   * 检查会话是否有效
   */
  async isSessionValid(token: string): Promise<boolean> {
    const session = await this.findOne({
      where: { token, isActive: true },
    });
    return !!session;
  }

  /**
   * 获取会话统计信息
   */
  async getSessionStats(
    userId: string,
    subjectType: SubjectTypeEnum,
  ): Promise<{ totalSessions: number; activeSessions: number }> {
    const whereCondition: any = {};

    switch (subjectType) {
      case SubjectTypeEnum.Member:
        whereCondition.member = { id: userId };
        break;
      case SubjectTypeEnum.PlatformStaff:
        whereCondition.platformStaff = { id: userId };
        break;
      case SubjectTypeEnum.CommunityStaff:
        whereCondition.communityStaff = { id: userId };
        break;
    }

    const totalSessions = await this.count({ where: whereCondition });
    const activeSessions = await this.count({
      where: { ...whereCondition, isActive: true },
    });

    return { totalSessions, activeSessions };
  }
}
