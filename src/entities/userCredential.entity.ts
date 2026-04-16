import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialTypeEnum, SubjectTypeEnum } from './enums';
import { Member } from './member.entity';
import { PlatformStaff } from './platformStaff.entity';
import { CommunityStaff } from './communityStaff.entity';

@Entity('user_credentials')
@Unique('UQ_user_credential_type', ['member', 'credentialType'])
@Unique('UQ_platform_staff_credential_type', [
  'platformStaff',
  'credentialType',
])
@Unique('UQ_community_staff_credential_type', [
  'communityStaff',
  'credentialType',
])
export class UserCredential extends BaseEntity {
  @ApiProperty({ example: '', description: '会员' })
  @ManyToOne(() => Member, (member) => member.userCredential, {
    nullable: true,
  })
  member: Member;

  @ApiProperty({ example: '', description: '平台员工' })
  @ManyToOne(
    () => PlatformStaff,
    (platformStaff) => platformStaff.userCredential,
    {
      nullable: true,
    },
  )
  platformStaff: PlatformStaff;

  @ApiProperty({ example: '', description: '社区员工' })
  @ManyToOne(
    () => CommunityStaff,
    (communityStaff) => communityStaff.userCredential,
    {
      nullable: true,
    },
  )
  communityStaff: CommunityStaff;

  @ApiProperty({
    example: SubjectTypeEnum.Member,
    description: '主体类型',
  })
  @Column({ default: SubjectTypeEnum.Member })
  subjectType: SubjectTypeEnum;

  @ApiProperty({
    example: CredentialTypeEnum.Password,
    description: '凭证类型类型',
  })
  @Column({ nullable: true })
  credentialType: CredentialTypeEnum;

  @ApiProperty({ example: '密码哈希值', description: '凭证' })
  @Column({ nullable: true })
  credential: string;
}
