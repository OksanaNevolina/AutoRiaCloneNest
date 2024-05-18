import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CarEntity } from '../../../database/entities/car.entity';
import {IPaginationResponseDto, IQuery} from "../../car/types/pagination.type";
import {ICar} from "../../car/types/car.type";
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';


@Injectable()
export class CarRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }

  public async getMany(query: IQuery): Promise<IPaginationResponseDto<ICar>> {
    const {
      page = 1,
      limit = 2,
      sortedBy = "created",
      ...searchObject
    } = query;

    const options: IPaginationOptions = {
      page: +page,
      limit: +limit,
      route: '/cars',
    };

    const carPagination = await paginate<CarEntity>(this, options, {
      where: searchObject,
      order: {[sortedBy]: 'ASC'},
    });
    const data:any = carPagination.items.map(car => ({
      id: car.id,
      name: car.name,
      description: car.description,
      region: car.region,
      price: car.price,
      currency: car.currency,
      currencyExchangeRate: car.currencyExchangeRate,
      imageUrls: car.imageUrls,
      brand: car.brand,
      model: car.model,
      created: car.created,
      updated: car.updated,
      createdBy: car.createdBy,
    }));

    return {
      itemsFound: carPagination.meta.totalItems,
      page: carPagination.meta.currentPage,
      limit: carPagination.meta.itemsPerPage,
      data: data,
    };
  }

  async findCarsWithBrandAndModelByRegion(region: string): Promise<CarEntity[]> {
    return this.createQueryBuilder('car')
        .leftJoinAndSelect('car.brand', 'brand')
        .leftJoinAndSelect('car.model', 'model')
        .where('car.region = :region', { region })
        .getMany();
  }

  async findCarsWithViewsLog(idCar: string): Promise<CarEntity> {
    return this.createQueryBuilder('car')
        .leftJoinAndSelect('car.viewsLog', 'viewsLog')
        .where('car.id = :idCar', { idCar })
        .getOne();
  }

}
