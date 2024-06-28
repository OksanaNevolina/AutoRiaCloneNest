import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { DealerEntity } from '../../../database/entities/dealer.entity';

@Injectable()
export class DealerRepository extends Repository<DealerEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(DealerEntity, dataSource.manager);
  }
}
