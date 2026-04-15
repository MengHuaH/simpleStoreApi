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

  @ApiProperty({ example: [], description: '用户凭证' })
  @OneToMany(
    () => UserCredential,
    (userCredential) => userCredential.communityStaff,
    {
      nullable: true,
    },
  )
  userCredential: UserCredential[];

  @ApiProperty({ example: [], description: '用户会话' })
  @OneToMany(() => UserSession, (userSession) => userSession.member, {
    nullable: true,
  })
  userSession: UserSession[];

  @ApiProperty({ example: true, description: '社区员工是否激活' })
  @Column({ default: true })
  isActive: boolean;
}
