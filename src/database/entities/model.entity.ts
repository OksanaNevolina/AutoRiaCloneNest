import { TableNameEnum } from '../enums/table-name.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './models/base.entity';
import { BrandEntity } from './brand.entity';

@Entity(TableNameEnum.MODEL)
export class ModelEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => BrandEntity, (brand) => brand.models)
  brand: BrandEntity;
}
