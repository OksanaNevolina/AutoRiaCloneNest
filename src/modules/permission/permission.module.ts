import { Module } from '@nestjs/common';

import { PermissionService } from './services/permission.service';
import { PermissionController } from './permission.controller';

@Module({
  imports: [],
  controllers: [PermissionController],

  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
