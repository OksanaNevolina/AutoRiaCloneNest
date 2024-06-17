import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '../configs/configs';
import { PostgresModule } from '../postgres/postgres.module';
import { AuthModule } from './auth/auth.module';
import { CarModule } from './car/car.module';
import { DealerModule } from './dealers/dealer.module';
import { PermissionModule } from './permission/permission.module';
import { RedisModule } from './redis/redis.module';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PostgresModule,
    RedisModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    RepositoryModule,
    CarModule,
    PermissionModule,
    DealerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
