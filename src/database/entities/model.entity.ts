import { TableNameEnum } from '../enums/table-name.enum';
import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import { BaseEntity } from './models/base.entity';
import { BrandEntity } from './brand.entity';
import {CarEntity} from "./car.entity";

@Entity(TableNameEnum.MODEL)
export class ModelEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => BrandEntity, (brand) => brand.models)
  brand: BrandEntity;

  @OneToMany(() => CarEntity, (car) => car.brand)
  cars: CarEntity[];
}
