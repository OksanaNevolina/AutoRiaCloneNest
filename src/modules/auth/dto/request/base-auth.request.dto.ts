import { PickType } from '@nestjs/swagger';
import { BaseRequestDto } from '../../../user/dto/request/base-request.dto';

export class BaseAuthRequestDto extends PickType(BaseRequestDto, [
  'name',
  'email',
  'password',
]) {}
