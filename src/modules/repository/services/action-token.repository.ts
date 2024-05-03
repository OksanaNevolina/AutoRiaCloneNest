import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ActionTokenEntity } from '../../../database/entities/action-token.entity';

@Injectable()
export class ActionTokenRepository extends Repository<ActionTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ActionTokenEntity, dataSource.manager);
  }

  public async saveActionToken(userId: string, token: string): Promise<void> {
    await this.save(
      this.create({
        user_id: userId,
        actionToken: token,
      }),
    );
  }

  // public async isTokenExist(token: string): Promise<boolean> {
  //   return await this.exists({
  //     where: { refreshToken: token },
  //   });
  // }
}
