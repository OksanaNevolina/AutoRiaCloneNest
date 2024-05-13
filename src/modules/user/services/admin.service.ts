import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../repository/services/user.repository';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { RoleEnum } from '../../../database/enums/role-enum';
import { CreateManagerRequestDto } from '../dto/request/create-manager.request.dto';
import * as bcrypt from 'bcrypt';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  public async createManager(
    userData: IUserData,
    dto: CreateManagerRequestDto,
  ): Promise<UserResponseDto> {
    const admin = await this.userService.findByIdOrThrow(userData.userId);
    if (!admin || admin.role !== RoleEnum.ADMIN) {
      throw new UnauthorizedException(
        'Only administrators can create managers',
      );
    }
    const existingUser = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (existingUser) {
      throw new NotFoundException(
        `User with email ${dto.email} already exists`,
      );
    }
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password, role: RoleEnum.MANAGER }),
    );
    return UserMapper.toResponseDto(user);
  }
}
