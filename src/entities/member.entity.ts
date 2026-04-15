import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserCredential } from './userCredential.entity';
import { UserSession } from './userSession.entity';

@Entity('members')
export class Member extends BaseEntity {
  @ApiProperty({ example: '13800000000', description: '会员手机号' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ example: [], description: '会员凭证' })
  @OneToMany(() => UserCredential, (userCredential) => userCredential.member, {
    nullable: true,
    cascade: true,
  })
  userCredential: UserCredential[];

  @ApiProperty({ example: [], description: '会员会话' })
  @OneToMany(() => UserSession, (userSession) => userSession.member, {
    nullable: true,
    cascade: true,
  })
  userSession: UserSession[];

  @ApiProperty({ example: true, description: '会员是否激活' })
  @Column({ default: true })
  isActive: boolean;
}
