import { Module } from '@nestjs/common';

import { DealerController } from './dealer.controller';
import { DealerService } from './services/dealer.service';

@Module({
  imports: [],
  controllers: [DealerController],

  providers: [DealerService],
  exports: [DealerService],
})
export class DealerModule {}
