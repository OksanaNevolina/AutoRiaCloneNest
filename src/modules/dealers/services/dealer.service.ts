import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { CarEntity } from '../../../database/entities/car.entity';
import { DealerEntity } from '../../../database/entities/dealer.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CarRepository } from '../../repository/services/car.repository';
import { DealerRepository } from '../../repository/services/dealer.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateDealerDto } from '../dto/request/update.dealer.dto';
import { CreateDealerDto } from '../dto/request/сreate.dealer.dto';

@Injectable()
export class DealerService {
  constructor(
    private readonly dealerRepository: DealerRepository,
    private readonly carRepository: CarRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    createDealerDto: CreateDealerDto,
    userData: IUserData,
  ): Promise<DealerEntity> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const dealerRepository = em.getRepository(DealerEntity);
      return await dealerRepository.save(
        dealerRepository.create({
          ...createDealerDto,
          createdDealer: { id: userData.userId },
        }),
      );
    });
  }

  async getAll(): Promise<DealerEntity[]> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const dealerRepository = em.getRepository(DealerEntity);

      return await dealerRepository.find({
        relations: ['employees', 'cars', 'createdDealer'],
      });
    });
  }

  async findOne(id: string): Promise<DealerEntity> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const dealerRepository = em.getRepository(DealerEntity);

      return await dealerRepository.findOne({
        where: { id },
        relations: ['employees', 'cars', 'createdDealer'],
      });
    });
  }

  async update(
    id: string,
    updateDealerDto: UpdateDealerDto,
  ): Promise<DealerEntity> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const dealerRepository = em.getRepository(DealerEntity);

      await dealerRepository.update(id, updateDealerDto);
      return await dealerRepository.findOne({
        where: { id },
        relations: ['employees', 'cars', 'createdDealer'],
      });
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
        await queryRunner.manager.update(UserEntity, employee.id, {
          dealer: null,
        });
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
