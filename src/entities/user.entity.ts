import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ default: UserRole.User })
  role: UserRole;
}
