import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ConstPermission } from '../../permission/constPermission/constPermission';
import { UserRepository } from '../../repository/services/user.repository';
import { UserResponseDto } from '../dto/response/user.response.dto';

@Injectable()
export class ManagerService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async banUser(
    userIdForBun: string,
    userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      try {
        const userId = userData.userId;
        const user = await userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.permissions', 'permission')
          .where('user.id = :userId', { userId })
          .getOne();

        if (
          !user.permissions.some(
            (permission) => permission.name === ConstPermission.BAN,
          )
        ) {
          throw new UnauthorizedException(
            'You do not have permission to ban users',
          );
        }

        const userToBan = await userRepository.findOneBy({
          id: userIdForBun,
        });

        if (userToBan.isBanned) {
          throw new Error('User is already banned');
        }

        userToBan.isBanned = true;
        return await userRepository.save(userToBan);
      } catch (error) {
        throw new Error(`Error banning user: ${error.message}`);
      }
    });
  }

  async deBanUser(
    userIdForUnBan: string,
    userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      try {
        const userId = userData.userId;
        const user = await userRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.permissions', 'permission')
          .where('user.id = :userId', { userId })
          .getOne();

        if (
          !user.permissions.some(
            (permission) => permission.name === ConstPermission.UNBAN,
          )
        ) {
          throw new UnauthorizedException(
            'You do not have permission to unban users',
          );
        }
        const userUNBAN = await userRepository.findOneBy({
          id: userIdForUnBan,
        });

        userUNBAN.isBanned = false;
        return await userRepository.save(userUNBAN);
      } catch (error) {
        throw new Error(`Error unbanning user: ${error.message}`);
      }
    });
  }
}
