import { Injectable } from '@nestjs/common';
import { DealerEntity } from '../../../database/entities/dealer.entity';
import { CreateDealerDto } from '../dto/request/сreate.dealer.dto';
import { UpdateDealerDto } from '../dto/request/update.dealer.dto';
import {DealerRepository} from '../../repository/services/dealer.repository';
import {IUserData} from "../../auth/interfaces/user-data.interface";

@Injectable()
export class DealerService {
  constructor(
    private readonly dealerRepository: DealerRepository,
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
    await this.dealerRepository.delete(id);
  }
}
