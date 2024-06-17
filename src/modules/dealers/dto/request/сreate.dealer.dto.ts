import { PickType } from '@nestjs/swagger';

import { UpdateDealerDto } from './update.dealer.dto';

export class CreateDealerDto extends PickType(UpdateDealerDto, [
  'name',
  'address',
  'contact',
]) {}
