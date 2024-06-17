import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PermissionEntity } from '../../../database/entities/permission.entity';

@Injectable()
export class PermissionRepository extends Repository<PermissionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PermissionEntity, dataSource.manager);
  }
}
