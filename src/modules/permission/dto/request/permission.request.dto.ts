import {ApiProperty} from '@nestjs/swagger';

import {IsOptional, IsString, Length} from "class-validator";
import {Transform, Type} from "class-transformer";
import {TransformHelper} from "../../../../common/helpers/transform.helper";

export class PermissionRequestDto {
    @ApiProperty()
    @IsOptional()
    @IsOptional()
    @IsString()
    @Length(3, 50)
    @Transform(TransformHelper.trim)
    @Type(() => String)
    name?: string;

}