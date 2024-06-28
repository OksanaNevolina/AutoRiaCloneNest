import { BrandEntity } from '../../../database/entities/brand.entity';
import { ModelEntity } from '../../../database/entities/model.entity';
import { UserEntity } from '../../../database/entities/user.entity';

export interface ICar {
  id: string;
  name: string;
  description: string;
  year: number;
  region: string;
  price: number;
  currency: string;
  currencyExchangeRate: number;
  imageUrls: string[];
  brand: BrandEntity;
  model: ModelEntity;
  created: Date;
  updated: Date;
  createdBy: UserEntity;
}
