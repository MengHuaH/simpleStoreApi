import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserCredential } from './userCredential.entity';
import { UserSession } from './userSession.entity';

@Entity('community_staffs')
export class CommunityStaff extends BaseEntity {
  @ApiProperty({ example: '13800000000', description: '社区员工手机号' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    example: [],
    description: '用户凭证',
    type: Array<UserCredential>,
  })
  @OneToMany(
    () => UserCredential,
    (userCredential) => userCredential.communityStaff,
    {
      nullable: true,
      cascade: true,
    },
  )
  userCredential: UserCredential[];

  @ApiProperty({
    example: [],
    description: '社区员工会话',
    type: Array<UserSession>,
  })
  @OneToMany(() => UserSession, (userSession) => userSession.communityStaff, {
    nullable: true,
  })
  userSession: UserSession[];

  @ApiProperty({ example: true, description: '社区员工是否激活' })
  @Column({ default: true })
  isActive: boolean;
}
