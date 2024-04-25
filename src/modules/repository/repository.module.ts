import { Global, Module } from '@nestjs/common';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';
import { BrandRepository } from './services/brand.repository';
import { CarRepository } from './services/car.repository';
import { ModelRepository } from './services/model.repository';
import { PermissionRepository } from './services/permission.repository';
import { CurrencyRateRepository } from './services/currency-rate.repository';

const repositories = [
  UserRepository,
  RefreshTokenRepository,
  BrandRepository,
  CarRepository,
  ModelRepository,
  PermissionRepository,
  CurrencyRateRepository,
];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
