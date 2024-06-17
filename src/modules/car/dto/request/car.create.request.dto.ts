import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CarCreateRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name?: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 3)
  @IsString()
  currency: string;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  @Min(0)
  currencyExchangeRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  region: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brandId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  modelId: string;
}
