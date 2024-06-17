import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ModelEntity } from '../../../database/entities/model.entity';

@Injectable()
export class ModelRepository extends Repository<ModelEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ModelEntity, dataSource.manager);
  }
  async deleteMany(brandId: string) {
    const modelsToDelete = await this.createQueryBuilder('model')
      .where('model.brandId = :brandId', { brandId: brandId })
      .getMany();

    await Promise.all(modelsToDelete.map((model) => this.remove(model)));
  }
}
