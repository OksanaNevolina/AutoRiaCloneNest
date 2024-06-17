import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class UpdateDealerDto {
  @ApiProperty({ example: 'Honda' })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name?: string;
  @ApiProperty({ example: 'місто Вишневе, вулиця Київська 23' })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  address?: string;

  @ApiProperty({ example: '097 655 55 48' })
  @IsNotEmpty()
  @IsString()
  contact?: string;
}
