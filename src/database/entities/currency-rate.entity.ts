import {Column, Entity} from 'typeorm';
import { TableNameEnum } from '../enums/table-name.enum';
import { BaseEntity } from './models/base.entity';

@Entity(TableNameEnum.CURRENCY_RATE)
export class CurrencyRateEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 3 })
    ccy: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    buy: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    sale: number;

}
