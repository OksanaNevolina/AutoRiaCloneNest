import { UserService } from './services/user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Logger, Post, Put} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { BaseUserRequestDto } from './dto/request/base-user.request.dto';
import { AuthUserResponseDto } from '../auth/dto/response/auth-user.response.dto';
import { CreateManagerRequestDto } from './dto/request/create-manager.request.dto';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiOperation({ summary: 'Create manager' })
  @ApiBearerAuth()
  @Post('create-manager')
  public async createManager(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateManagerRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.createManager(userData, dto);
  }

  @ApiOperation({ summary: 'Get me' })
  @ApiBearerAuth()
  @Get('me')
  public async findMe(
    @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.userService.findMe(userData);
  }
  @ApiOperation({ summary: 'Update me' })
  @ApiBearerAuth()
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMe(userData, dto);
  }
  @ApiOperation({ summary: 'Delete me' })
  @ApiBearerAuth()
  @Delete('me')
  public async deleteMe(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.deleteMe(userData);
  }
}
