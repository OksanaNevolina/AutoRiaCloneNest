import { PickType } from '@nestjs/swagger';
import { BaseRequestDto } from '../../../user/dto/request/base-request.dto';

export class SetForgotPasswordRequestDto extends PickType(BaseRequestDto, [
    'password',
]) {}