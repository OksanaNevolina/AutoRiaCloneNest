import { PickType } from '@nestjs/swagger';
import { BaseUserRequestDto } from '../../../user/dto/request/base-user.request.dto';

export class BaseAuthRequestDto extends PickType(BaseUserRequestDto, [
  'name',
  'email',
  'password',
]) {}
