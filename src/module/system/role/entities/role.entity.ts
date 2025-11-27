import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '角色名称' })
  role_name: string;

  @Column({ comment: '角色代码', update: false, unique: true })
  role_code: string;

  @Column({ comment: '角色描述' })
  role_description: string;
}
