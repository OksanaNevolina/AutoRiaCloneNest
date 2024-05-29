import { Injectable } from '@nestjs/common';
import { DataSource, Repository, EntityManager } from 'typeorm';

import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(RefreshTokenEntity, dataSource.manager);
    }

    public async saveToken(
        userId: string,
        token: string,
        em?: EntityManager,
    ): Promise<RefreshTokenEntity> {
        const repo = em ? em.getRepository(RefreshTokenEntity) : this;
        return await repo.save(
            repo.create({
                user_id: userId,
                refreshToken: token,
            }),
        );
    }

    public async isTokenExist(token: string): Promise<boolean> {
        return await this.exists({
            where: { refreshToken: token },
        });
    }
}
