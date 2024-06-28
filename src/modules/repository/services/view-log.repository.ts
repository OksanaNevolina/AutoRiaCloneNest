import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ViewLogEntity } from '../../../database/entities/viewLog.entity';

@Injectable()
export class ViewLogRepository extends Repository<ViewLogEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewLogEntity, dataSource.manager);
  }
}
