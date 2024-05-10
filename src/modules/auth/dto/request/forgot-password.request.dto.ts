import { PickType } from '@nestjs/swagger';
import { BaseRequestDto } from '../../../user/dto/request/base-request.dto';

export class ForgotPasswordRequestDto extends PickType(BaseRequestDto, [
    'email',
]) {}