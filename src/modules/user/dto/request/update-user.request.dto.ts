import { PickType } from '@nestjs/swagger';

import { BaseRequestDto } from './base-request.dto';

export class UpdateUserRequestDto extends PickType(BaseRequestDto, [
  'name',
]) {}
