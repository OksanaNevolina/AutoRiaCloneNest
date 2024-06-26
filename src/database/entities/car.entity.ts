import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { BrandEntity } from './brand.entity';
import { DealerEntity } from './dealer.entity';
import { ModelEntity } from './model.entity';
import { BaseEntity } from './models/base.entity';
import { UserEntity } from './user.entity';
import { ViewLogEntity } from './viewLog.entity';

@Entity(TableNameEnum.CAR)
export class CarEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  currencyExchangeRate: number;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  @Column({ type: 'text' })
  description: string;

  @Column()
  region: string;

  @Column()
  year: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.cars)
  brand: BrandEntity;

  @ManyToOne(() => ModelEntity, (model) => model.cars)
  model: ModelEntity;

  @ManyToOne(() => UserEntity, (user) => user.cars)
  createdBy: UserEntity;
  @Column()
  isActive: boolean;
  @Column({ default: 0 })
  views: number;

  @OneToMany(() => ViewLogEntity, (viewLog) => viewLog.car)
  viewsLog: ViewLogEntity[];
  @ManyToOne(() => DealerEntity, (dealer) => dealer.cars)
  dealer: DealerEntity;
}
