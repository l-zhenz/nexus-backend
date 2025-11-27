import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '用户名',
    unique: true,
    length: 20,
  })
  username: string;

  @Column({
    comment: '密码',
  })
  @Exclude()
  password: string;

  @Column({
    comment: '邮箱',
    nullable: true,
  })
  email?: string;

  @Column({
    comment: '手机号',
    nullable: true,
  })
  phone?: string;

  @Column({
    comment: '头像',
    nullable: true,
  })
  avatar?: string;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
