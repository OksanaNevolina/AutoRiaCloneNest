import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';
import { AccountTypeEnum } from '../../../database/enums/account-type.enum';
import { UserRepository } from '../../repository/services/user.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async upgradeToPremium(userId: string): Promise<UserEntity> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      try {
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        if (user.accountType === AccountTypeEnum.PREMIUM) {
          throw new Error('User account is already premium');
        }

        user.accountType = AccountTypeEnum.PREMIUM;
        return await userRepository.save(user);
      } catch (error) {
        throw new Error(`Error upgrading user to premium: ${error.message}`);
      }
    });
  }
}
