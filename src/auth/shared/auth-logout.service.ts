import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@/cache/cache.service';
import { SessionService } from '@/modules/sessions/shared/session.service';
import { SubjectTypeEnum } from '../../entities/enums';

@Injectable()
export class AuthLogoutService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * 统一的登出方法
   * @param token JWT token
   * @param SubjectTypeEnum 主体类型
   */
  async logout(token: string, SubjectTypeEnum: SubjectTypeEnum): Promise<void> {
    // 1. 删除缓存中的会话
    const cacheKey = this.buildCacheKey(token, SubjectTypeEnum);
    await this.cacheService.delete(cacheKey);

    // 2. 更新数据库中的会话状态为失效
    await this.sessionService.invalidateSession(token);
  }

  /**
   * 构建缓存键
   */
  private buildCacheKey(
    token: string,
    subjectTypeEnum: SubjectTypeEnum,
  ): string {
    switch (subjectTypeEnum) {
      case SubjectTypeEnum.Member:
        return `auth:${token}`;
      case SubjectTypeEnum.CommunityStaff:
        return `auth:community_staff:${token}`;
      case SubjectTypeEnum.PlatformStaff:
        return `auth:platform_staff:${token}`;
      default:
        return `auth:${token}`;
    }
  }

  /**
   * 从请求中提取token并登出
   */
  async logoutFromRequest(
    req: Request,
    SubjectTypeEnum: SubjectTypeEnum,
  ): Promise<void> {
    const token = this.extractTokenFromRequest(req);
    if (token) {
      await this.logout(token, SubjectTypeEnum);
    }
  }

  /**
   * 统一登出方法 - 自动识别主体类型
   */
  async unifiedLogout(
    req: Request,
  ): Promise<{ success: boolean; message: string }> {
    const token = this.extractTokenFromRequest(req);
    if (!token) {
      return { success: false, message: '未提供有效的token' };
    }

    const SubjectTypeEnum = this.determineSubjectTypeEnumFromToken(token);
    await this.logout(token, SubjectTypeEnum);

    return { success: true, message: '登出成功' };
  }

  /**
   * 从请求头中提取token
   */
  private extractTokenFromRequest(req: Request): string | null {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  /**
   * 根据token解码判断主体类型
   */
  private determineSubjectTypeEnumFromToken(token: string): SubjectTypeEnum {
    try {
      const decoded = this.jwtService.decode(token);
      if (
        decoded &&
        typeof decoded === 'object' &&
        'SubjectTypeEnum' in decoded
      ) {
        const subjectTypeEnum = decoded.SubjectTypeEnum as string;

        // 根据SubjectTypeEnum字符串映射到对应的枚举值
        switch (subjectTypeEnum) {
          case 'member':
            return SubjectTypeEnum.Member;
          case 'community_staff':
            return SubjectTypeEnum.CommunityStaff;
          case 'platform_staff':
            return SubjectTypeEnum.PlatformStaff;
          default:
            return SubjectTypeEnum.Member; // 默认值
        }
      }
    } catch (error) {
      console.error('解码token失败:', error);
    }

    // 如果解码失败或没有SubjectTypeEnum字段，返回默认值
    return SubjectTypeEnum.Member;
  }
}
