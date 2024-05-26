import {Injectable, NotFoundException} from '@nestjs/common';
import { DealerEntity } from '../../../database/entities/dealer.entity';
import { CreateDealerDto } from '../dto/request/сreate.dealer.dto';
import { UpdateDealerDto } from '../dto/request/update.dealer.dto';
import {DealerRepository} from '../../repository/services/dealer.repository';
import {IUserData} from "../../auth/interfaces/user-data.interface";
import {CarEntity} from "../../../database/entities/car.entity";
import {UserEntity} from "../../../database/entities/user.entity";
import {CarRepository} from "../../repository/services/car.repository";
import {UserRepository} from "../../repository/services/user.repository";
import {DataSource} from "typeorm";

@Injectable()
export class DealerService {
  constructor(
      private readonly dealerRepository: DealerRepository,
      private readonly carRepository: CarRepository,
      private readonly userRepository: UserRepository,
      private readonly dataSource: DataSource,
  ) {}

  async create(createDealerDto: CreateDealerDto,userData:IUserData): Promise<DealerEntity> {
    return this.dealerRepository.save(this.dealerRepository.create({...createDealerDto, createdDealer: { id: userData.userId }}),);
  }

  async findOne(id: string): Promise<DealerEntity> {
    return this.dealerRepository.findOne({
      where: { id },
      relations: ['employees','cars','createdDealer'],
    });
  }

  async update(
    id: string,
    updateDealerDto: UpdateDealerDto,
  ): Promise<DealerEntity> {
    await this.dealerRepository.update(id, updateDealerDto);
    return this.dealerRepository.findOne({
      where: { id },
      relations: ['employees','cars','createdDealer'],
    });
  }
  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const dealer = await queryRunner.manager.findOne(DealerEntity, {
        where: { id },
        relations: ['cars', 'employees'],
      });

      if (!dealer) {
        throw new NotFoundException(`Dealer with id ${id} not found`);
      }

      for (const car of dealer.cars) {
        await queryRunner.manager.update(CarEntity, car.id, { dealer: null });
      }


      for (const employee of dealer.employees) {
        await queryRunner.manager.update(UserEntity, employee.id, { dealer: null });
      }
      await queryRunner.manager.delete(DealerEntity, id);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

