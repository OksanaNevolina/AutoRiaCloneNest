import { BrandEntity } from '../../../../database/entities/brand.entity';
import { ModelEntity } from '../../../../database/entities/model.entity';
import { UserEntity } from '../../../../database/entities/user.entity';

export class CarResponseDto {
  id: string;
  name: string;
  price: number;
  description: string;
  region: string;
  year: number;
  brand: BrandEntity;
  model: ModelEntity;
  created: Date;
  updated: Date;
  createdBy: UserEntity;
}
