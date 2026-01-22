import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'admin', description: '用户名' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'admin@example.com', description: '用户邮箱' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '123456', description: '用户密码' })
  @Column()
  password: string;

  @ApiProperty({ example: true, description: '用户是否激活' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: '张', description: '用户 firstName' })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({ example: '四', description: '用户 lastName' })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({ example: '13800000000', description: '用户手机号' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ example: '北京市海淀区', description: '用户地址' })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ example: UserRole.User, description: '用户角色' })
  @Column({ default: UserRole.User })
  role: UserRole;
}
