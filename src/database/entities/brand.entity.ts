import { Column, Entity, OneToMany } from 'typeorm';
import { TableNameEnum } from '../enums/table-name.enum';
import { BaseEntity } from './models/base.entity';
import { ModelEntity } from './model.entity';
import { CarEntity } from './car.entity';

@Entity(TableNameEnum.BRAND)
export class BrandEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => ModelEntity, (model) => model.brand)
  models: ModelEntity[];
  @OneToMany(() => CarEntity, (car) => car.model)
  cars: CarEntity[];
}
