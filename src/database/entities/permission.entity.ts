import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { BaseEntity } from './models/base.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.PERMISSION)
export class PermissionEntity extends BaseEntity {
  @Column('text')
  name: string;
  @Column('text')
  description: string;

  @ManyToMany(() => UserEntity, (entity) => entity.permissions)
  @JoinTable()
  users?: UserEntity[];
}
