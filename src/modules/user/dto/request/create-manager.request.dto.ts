import { ApiProperty } from '@nestjs/swagger';
import { BaseUserRequestDto } from './base-user.request.dto';
import { RoleEnum } from '../../../../database/enums/role-enum';
import {IsOptional} from "class-validator";

export class CreateManagerRequestDto extends BaseUserRequestDto {
  @ApiProperty({ enum: RoleEnum, example: RoleEnum.MANAGER })
  @IsOptional()
  role: RoleEnum;
}

