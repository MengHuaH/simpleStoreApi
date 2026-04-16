import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserCredential } from './userCredential.entity';
import { UserSession } from './userSession.entity';

@Entity('platform_staffs')
export class PlatformStaff extends BaseEntity {
  @ApiProperty({ example: '13800000000', description: '平台员工手机号' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    example: [],
    description: '平台员工凭证',
    type: Array<UserCredential>,
  })
  @OneToMany(
    () => UserCredential,
    (userCredential) => userCredential.platformStaff,
    {
      nullable: true,
      cascade: true,
    },
  )
  userCredential: UserCredential[];

  @ApiProperty({
    example: [],
    description: '平台员工会话',
    type: Array<UserSession>,
  })
  @OneToMany(() => UserSession, (userSession) => userSession.platformStaff, {
    nullable: true,
  })
  userSession: UserSession[];

  @ApiProperty({ example: true, description: '平台员工是否激活' })
  @Column({ default: true })
  isActive: boolean;
}
