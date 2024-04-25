import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ModelEntity } from '../../../database/entities/model.entity';

@Injectable()
export class ModelRepository extends Repository<ModelEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ModelEntity, dataSource.manager);
  }
}
