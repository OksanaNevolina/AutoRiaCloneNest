import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ManagerGuard } from '../auth/guards/manager.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreateManagerRequestDto } from './dto/request/create-manager.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { AccountService } from './services/account.service';
import { AdminService } from './services/admin.service';
import { ManagerService } from './services/manager.service';
import { UserService } from './services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly admanService: AdminService,
    private readonly managerService: ManagerService,
    private readonly accountService: AccountService,
  ) {}

  @ApiOperation({ summary: 'Get me' })
  @ApiBearerAuth()
  @Get('get-me')
  public async findMe(
    @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.userService.findMe(userData);
  }
  @ApiOperation({ summary: 'Update me' })
  @ApiBearerAuth()
  @Put('update-me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMe(userData, dto);
  }
  @ApiOperation({ summary: 'Delete me' })
  @ApiBearerAuth()
  @Delete('delete-me')
  public async deleteMe(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.deleteMe(userData);
  }
  @ApiOperation({ summary: 'Create manager' })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('create-manager')
  public async createManager(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateManagerRequestDto,
  ): Promise<UserResponseDto> {
    return await this.admanService.createManager(userData, dto);
  }
  @ApiOperation({ summary: 'Ban user' })
  @UseGuards(ManagerGuard)
  @ApiBearerAuth()
  @Post('ban/:userId')
  public async banUser(
    @Param('userId') userId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.managerService.banUser(userId, userData);
  }
  @ApiOperation({ summary: 'De ban user' })
  @ApiBearerAuth()
  @Post('de-ban-user/:userId')
  public async deBanUser(
    @Param('userId') userId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.managerService.deBanUser(userId, userData);
  }
  @ApiOperation({ summary: 'Upgrade to premium' })
  @ApiBearerAuth()
  @Put('upgrade-to-premium/:userId')
  public async upgradeToPremium(
    @Param('userId') userId: string,
  ): Promise<UserResponseDto> {
    return await this.accountService.upgradeToPremium(userId);
  }
}
