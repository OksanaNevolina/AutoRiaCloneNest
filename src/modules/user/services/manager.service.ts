import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserService } from './user.service';
import {ConstPermission} from "../../permission/constPermission/constPermission";

@Injectable()
export class ManagerService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async banUser(userIdForBun: string, userData: IUserData): Promise<UserResponseDto> {
    try {
      const userId = userData.userId
      const user = await this.userRepository.createQueryBuilder('user')
          .leftJoinAndSelect('user.permissions', 'permission')
          .where('user.id = :userId', { userId })
          .getOne();


      if (
        !user.permissions.some((permission) => permission.name === ConstPermission.BAN)
      ) {
        throw new UnauthorizedException(
          'You do not have permission to ban users',
        );
      }

      const userToBan = await this.userRepository.findOneBy({ id: userIdForBun });

      if (userToBan.isBanned) {
        throw new Error('User is already banned');
      }

      userToBan.isBanned = true;
      return await this.userRepository.save(userToBan);
    } catch (error) {
      throw new Error(`Error banning user: ${error.message}`);
    }
  }

  async deBanUser(
    userIdForUnBan: string,
    userData: IUserData,
  ): Promise<UserResponseDto> {
    try {
      const userId = userData.userId
      const user = await this.userRepository.createQueryBuilder('user')
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
      const userUNBAN= await this.userRepository.findOneBy({ id: userIdForUnBan });

      userUNBAN.isBanned = false;
      return await this.userRepository.save(userUNBAN);
    } catch (error) {
      throw new Error(`Error unbanning user: ${error.message}`);
    }
  }
}
