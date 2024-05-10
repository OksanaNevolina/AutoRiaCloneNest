import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestDto } from './base-request.dto';
import { RoleEnum } from '../../../../database/enums/role-enum';
import {IsOptional} from "class-validator";

export class CreateManagerRequestDto extends BaseRequestDto {
  @ApiProperty({ enum: RoleEnum, example: RoleEnum.MANAGER })
  @IsOptional()
  role: RoleEnum;
}

