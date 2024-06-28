import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class PermissionRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name?: string;
  @ApiProperty()
  @IsOptional()
  @IsOptional()
  @IsString()
  @Length(3, 500)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description?: string;
}
