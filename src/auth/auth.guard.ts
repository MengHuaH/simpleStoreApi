import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import {
  IS_PUBLIC_KEY,
  SUBJECT_TYPE_KEY,
  ROLES_KEY,
} from './AllowAnon.decorator';
import { CacheService } from '@/cache/cache.service';
import { SubjectTypeEnum } from '../entities/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('缺少授权令牌');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // 根据主体类型构建正确的缓存键
      const cacheKey = this.buildCacheKey(token, payload.subjectType);
      const cachePayload = await this.cacheService.get(cacheKey);
      if (!cachePayload) {
        throw new UnauthorizedException('令牌已过期');
      }

      // 检查主体类型权限
      await this.checkSubjectTypePermission(context, payload);

      // 检查角色权限（预留扩展）
      await this.checkRolePermission(context, payload);

      // 将用户信息附加到请求对象
      request['user'] = payload;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('无效的令牌');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private buildCacheKey(token: string, subjectType?: string): string {
    if (!subjectType) {
      return `auth:${token}`;
    }

    switch (subjectType) {
      case SubjectTypeEnum.Member:
        return `auth:member:${token}`;
      case SubjectTypeEnum.CommunityStaff:
        return `auth:community_staff:${token}`;
      case SubjectTypeEnum.PlatformStaff:
        return `auth:platform_staff:${token}`;
      default:
        return `auth:${token}`;
    }
  }

  private async checkSubjectTypePermission(
    context: ExecutionContext,
    payload: any,
  ): Promise<void> {
    const requiredSubjectType = Reflect.getMetadata(
      SUBJECT_TYPE_KEY,
      context.getHandler(),
    );

    if (!requiredSubjectType) {
      return; // 没有主体类型限制，允许所有认证用户
    }

    const userSubjectType = payload.subjectType;

    if (Array.isArray(requiredSubjectType)) {
      // 允许多个主体类型的情况（如 RequiresStaff, RequiresAny）
      if (!requiredSubjectType.includes(userSubjectType)) {
        throw new ForbiddenException('权限不足：主体类型不匹配');
      }
    } else {
      // 单个主体类型限制
      if (requiredSubjectType !== userSubjectType) {
        throw new ForbiddenException('权限不足：主体类型不匹配');
      }
    }
  }

  private async checkRolePermission(
    context: ExecutionContext,
    payload: any,
  ): Promise<void> {
    const requiredRoles = Reflect.getMetadata(ROLES_KEY, context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return; // 没有角色限制
    }

    // 预留角色权限检查逻辑
    // 这里可以根据实际业务需求实现角色检查
    // const userRoles = payload.roles || [];
    // const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    // if (!hasRequiredRole) {
    //   throw new ForbiddenException('权限不足：角色不匹配');
    // }
  }
}
