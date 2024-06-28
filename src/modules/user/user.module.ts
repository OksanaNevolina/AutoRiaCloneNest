import { Module } from '@nestjs/common';

import { AccountService } from './services/account.service';
import { AdminService } from './services/admin.service';
import { ManagerService } from './services/manager.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, AccountService, AdminService, ManagerService],
  exports: [UserService],
})
export class UserModule {}
