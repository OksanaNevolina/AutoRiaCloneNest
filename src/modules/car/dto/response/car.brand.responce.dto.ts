import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';
import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CarBrandResponceDto {
  id:string;
  name: string;
}
