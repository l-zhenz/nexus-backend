import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: '用户名',
  })
  username: string;

  @Column({
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '邮箱',
  })
  email: string;

  @Column({
    comment: '手机号',
  })
  phone: string;

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
