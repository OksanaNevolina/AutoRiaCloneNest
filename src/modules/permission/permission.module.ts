import { Module } from '@nestjs/common';

import { PermissionService } from './services/permission.service';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/services/user.service';

@Module({
  imports: [],
  controllers: [UserController],

  providers: [UserService, PermissionService],
  exports: [UserService],
})
export class UserModule {}
