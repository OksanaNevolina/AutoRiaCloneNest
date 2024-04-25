import { Entity } from 'typeorm';
import { TableNameEnum } from '../enums/table-name.enum';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.PERMISSION)
export class PermissionEntity extends BaseEntity {}
