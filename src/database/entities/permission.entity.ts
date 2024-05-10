import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import { TableNameEnum } from '../enums/table-name.enum';
import { BaseEntity } from './models/base.entity';
import {UserEntity} from "./user.entity";

@Entity(TableNameEnum.PERMISSION)
export class PermissionEntity extends BaseEntity {
    @Column('text')
    name: string;

    @Column()
    user_id: string;
    @ManyToOne(() => UserEntity, (entity) => entity.permissions)
    @JoinColumn({ name: 'user_id' })
    user?: UserEntity;
}
