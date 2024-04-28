import { ConflictException, Injectable } from '@nestjs/common';
import { IUserData } from '../../auth/interfaces/user-data.interface';

import { UserMapper } from './user.mapper';
import { UserRepository } from '../../repository/services/user.repository';
import { UserResponseDto } from '../dto/response/user.response.dto';
import {UpdateUserRequestDto} from "../dto/request/update-user.request.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findMe(userData: IUserData): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDto(entity);
  }
  public async updateMe(
      userData: IUserData,
      dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOneBy({ id: userData.userId });
    const user = await this.userRepository.save({ ...entity, ...dto });
    return UserMapper.toResponseDto(user);
  }

  // public async updateMe(
  //   userData: IUserData,
  //   dto: UpdateUserRequestDto,
  // ): Promise<UserResponseDto> {
  //   const entity = await this.userRepository.findOneBy({ id: userData.userId });
  //   const user = await this.userRepository.save({ ...entity, ...dto });
  //   return UserMapper.toResponseDto(user);
  // }
  //
  // public async findByIdOrThrow(userId: string): Promise<UserEntity> {
  //   const entity = this.userRepository.findOneBy({ id: userId });
  //   if (!entity) {
  //     throw new UnprocessableEntityException();
  //   }
  //   return await entity;
  // }
  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException();
    }
  }
}
