import { Global, Module } from '@nestjs/common';

import { ActionTokenRepository } from './services/action-token.repository';
import { BrandRepository } from './services/brand.repository';
import { CarRepository } from './services/car.repository';
import { CurrencyRateRepository } from './services/currency-rate.repository';
import { DealerRepository } from './services/dealer.repository';
import { ModelRepository } from './services/model.repository';
import { PermissionRepository } from './services/permission.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';
import { ViewLogRepository } from './services/view-log.repository';

const repositories = [
  UserRepository,
  RefreshTokenRepository,
  BrandRepository,
  CarRepository,
  ModelRepository,
  PermissionRepository,
  CurrencyRateRepository,
  ActionTokenRepository,
  ViewLogRepository,
  DealerRepository,
];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
