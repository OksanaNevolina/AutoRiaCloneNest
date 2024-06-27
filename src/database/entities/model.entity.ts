import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { BrandEntity } from './brand.entity';
import { CarEntity } from './car.entity';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.MODEL)
export class ModelEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => BrandEntity, (brand) => brand.models)
  brand: BrandEntity;

  @OneToMany(() => CarEntity, (car) => car.brand)
  cars: CarEntity[];
}
