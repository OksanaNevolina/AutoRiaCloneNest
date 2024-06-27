import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { TableNameEnum } from '../enums/table-name.enum';
import { CarEntity } from './car.entity';
import { BaseEntity } from './models/base.entity';
import { UserEntity } from './user.entity';

@Entity(TableNameEnum.DEALER)
export class DealerEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  contact: string;

  @ManyToOne(() => UserEntity, (user) => user.dealer)
  createdDealer: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.dealer)
  employees: UserEntity[];

  @OneToMany(() => CarEntity, (car) => car.dealer)
  cars: CarEntity[];
}
