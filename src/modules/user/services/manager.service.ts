import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class ManagerService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async banUser(userId: string, userData: IUserData): Promise<UserResponseDto> {
    try {
      const user: UserEntity = await this.userService.findByIdOrThrow(
        userData.userId,
      );
      Logger.log(user.role);

      if (
        !user.permissions.some((permission) => permission.name === Constant.BAN)
      ) {
        throw new UnauthorizedException(
          'You do not have permission to ban users',
        );
      }

      const userToBan = await this.userRepository.findOneBy({ id: userId });

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
    userId: string,
    userData: IUserData,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userService.findByIdOrThrow(userData.userId);
      Logger.log(user.role);

      if (
        !user.permissions.some(
          (permission) => permission.name === Constant.UNBAN,
        )
      ) {
        throw new UnauthorizedException(
          'You do not have permission to unban users',
        );
      }
      user.isBanned = false;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Error unbanning user: ${error.message}`);
    }
  }
}
