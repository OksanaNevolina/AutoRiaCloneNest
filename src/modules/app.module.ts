import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configs/configs';

import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { PostgresModule } from '../postgres/postgres.module';
import { CarModule } from './car/car.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
