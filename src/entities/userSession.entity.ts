import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialTypeEnum, SubjectTypeEnum } from './enums';
import { Member } from './member.entity';
import { PlatformStaff } from './platformStaff.entity';
import { CommunityStaff } from './communityStaff.entity';

@Entity('user_sessions')
export class UserSession extends BaseEntity {
  @ApiProperty({ example: '', description: '会员' })
  @ManyToOne(() => Member, (member) => member.userSession, {
    nullable: true,
  })
  member: Member;

  @ApiProperty({ example: '', description: '平台员工' })
  @ManyToOne(
    () => PlatformStaff,
    (platformStaff) => platformStaff.userSession,
    {
      nullable: true,
    },
  )
  platformStaff: PlatformStaff;

  @ApiProperty({ example: '', description: '社区员工' })
  @ManyToOne(
    () => CommunityStaff,
    (communityStaff) => communityStaff.userSession,
    {
      nullable: true,
    },
  )
  communityStaff: CommunityStaff;

  @ApiProperty({
    example: SubjectTypeEnum.Member,
    description: '主体类型',
  })
  @Column({ nullable: true })
  subjectType: SubjectTypeEnum;

  @ApiProperty({
    example: '123456',
    description: 'token',
  })
  @Column({ nullable: true })
  token: string;

  @ApiProperty({ example: '123456', description: '设备ID' })
  @Column({ nullable: true })
  deviceId: string;

  @ApiProperty({ example: true, description: '是否激活' })
  @Column({ nullable: true })
  isActive: boolean;
}
