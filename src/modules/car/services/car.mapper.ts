import { ICar } from '../types/car.type';
import {CarEntity} from "../../../database/entities/car.entity";

export class CarMapper {
  public static toResponseDto(carEntity: ICar): ICar {
    return {
      id: carEntity.id,
      name: carEntity.name,
      description: carEntity.description,
      year: carEntity.year,
      region: carEntity.region,
      price: carEntity.price,
      currency: carEntity.currency,
      currencyExchangeRate: carEntity.currencyExchangeRate,
      imageUrls:carEntity.imageUrls,
      brand: carEntity.brand,
      model: carEntity.model,
      created: carEntity.created,
      updated: carEntity.updated,
      createdBy: carEntity.createdBy,
    };
  }
}
