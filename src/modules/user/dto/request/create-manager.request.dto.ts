import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { RoleEnum } from '../../../../database/enums/role-enum';
import { BaseRequestDto } from './base-request.dto';

export class CreateManagerRequestDto extends BaseRequestDto {
  @ApiProperty({ enum: RoleEnum, example: RoleEnum.MANAGER })
  @IsOptional()
  role: RoleEnum;
}
