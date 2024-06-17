import { ConfigService } from '@nestjs/config';

import { Config } from '../../../configs/config.type';
import { ICar } from '../types/car.type';

interface AWSs3Config {
  awsS3URL: string;
}

export class CarMapper {
  private AWSs3Config: AWSs3Config;

  constructor(private readonly configService: ConfigService<Config>) {
    this.AWSs3Config = this.configService.get<AWSs3Config>('AWSs3');
  }

  public toResponseDto(carEntity: ICar): ICar {
    return {
      id: carEntity.id,
      name: carEntity.name,
      description: carEntity.description,
      year: carEntity.year,
      region: carEntity.region,
      price: carEntity.price,
      currency: carEntity.currency,
      currencyExchangeRate: carEntity.currencyExchangeRate,
      imageUrls: carEntity.imageUrls
        ? carEntity.imageUrls.map((url) => `${this.AWSs3Config.awsS3URL}${url}`)
        : [],
      brand: carEntity.brand,
      model: carEntity.model,
      created: carEntity.created,
      updated: carEntity.updated,
      createdBy: carEntity.createdBy,
    };
  }
}
