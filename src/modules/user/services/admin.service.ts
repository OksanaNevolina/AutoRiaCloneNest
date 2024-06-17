import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';

import { DealerEntity } from '../../../database/entities/dealer.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { RoleEnum } from '../../../database/enums/role-enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { DealerRepository } from '../../repository/services/dealer.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CreateManagerRequestDto } from '../dto/request/create-manager.request.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly dealerRepository: DealerRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async createManager(
    userData: IUserData,
    dto: CreateManagerRequestDto,
  ): Promise<UserResponseDto> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const dealerRepository = em.getRepository(DealerEntity);
      const admin = await this.userService.findByIdOrThrow(userData.userId, em);
      if (!admin || admin.role !== RoleEnum.ADMIN) {
        throw new UnauthorizedException(
          'Only administrators can create managers',
        );
      }
      const existingUser = await userRepository.findOneBy({
        email: dto.email,
      });
      if (existingUser) {
        throw new NotFoundException(
          `User with email ${dto.email} already exists`,
        );
      }
      const password = await bcrypt.hash(dto.password, 10);
      const user = userRepository.create({
        ...dto,
        password,
        role: RoleEnum.MANAGER,
      });

      if (dto.dealerId) {
        user.dealer = await dealerRepository.findOneBy({ id: dto.dealerId });
      }

      await userRepository.save(user);
      return UserMapper.toResponseDto(user);
    });
  }
}
