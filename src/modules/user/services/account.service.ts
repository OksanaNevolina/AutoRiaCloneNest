import { Injectable } from '@nestjs/common';

import { AccountTypeEnum } from '../../../database/enums/account-type.enum';
import { UserRepository } from '../../repository/services/user.repository';
import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(private readonly userRepository: UserRepository) {}

  async upgradeToPremium(userId: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      if (user.accountType === AccountTypeEnum.PREMIUM) {
        throw new Error('User account is already premium');
      }

      user.accountType = AccountTypeEnum.PREMIUM;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Error upgrading user to premium: ${error.message}`);
    }
  }
}
