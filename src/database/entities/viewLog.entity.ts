import {Column, Entity, ManyToOne} from "typeorm";
import {TableNameEnum} from "../enums/table-name.enum";
import {BaseEntity} from "./models/base.entity";
import {CarEntity} from "./car.entity";


@Entity(TableNameEnum.VIEWlOG)
export class ViewLogEntity extends BaseEntity {
  @Column()
  timestamp: Date;

  @ManyToOne(() => CarEntity, (car) => car.viewsLog)
  car: CarEntity;
}
