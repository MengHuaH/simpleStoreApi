import { SetMetadata } from '@nestjs/common';
import { SubjectTypeEnum } from '../entities/enums';

// 公共访问装饰器
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// 主体类型权限装饰器
export const SUBJECT_TYPE_KEY = 'subjectType';
export const RequiresSubject = (subjectType: SubjectTypeEnum) =>
  SetMetadata(SUBJECT_TYPE_KEY, subjectType);
// 成员权限装饰器
export const RequiresMember = () => RequiresSubject(SubjectTypeEnum.Member);
// 社区员工权限装饰器
export const RequiresCommunityStaff = () =>
  RequiresSubject(SubjectTypeEnum.CommunityStaff);
// 平台员工权限装饰器
export const RequiresPlatformStaff = () =>
  RequiresSubject(SubjectTypeEnum.PlatformStaff);

// 角色权限装饰器（预留扩展）
export const ROLES_KEY = 'roles';
export const RequiresRoles = (roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const RequiresAdmin = () => RequiresRoles(['admin']);
export const RequiresManager = () => RequiresRoles(['manager']);
export const RequiresUser = () => RequiresRoles(['user']);

// 组合权限装饰器
export const RequiresStaff = () =>
  SetMetadata(SUBJECT_TYPE_KEY, [
    SubjectTypeEnum.CommunityStaff,
    SubjectTypeEnum.PlatformStaff,
  ]);

export const RequiresAny = () =>
  SetMetadata(SUBJECT_TYPE_KEY, [
    SubjectTypeEnum.Member,
    SubjectTypeEnum.CommunityStaff,
    SubjectTypeEnum.PlatformStaff,
  ]);
