import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller, Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionResponseDto } from './dto/response/permission.response.dto';
import { PermissionRequestDto } from './dto/request/permission.request.dto';
import { PermissionService } from './services/permission.service';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AdminGuard } from '../auth/guards/admin.guard';
import { PermissionEntity } from '../../database/entities/permission.entity';

@ApiTags('Permission')
@Controller('permissions')
export class PermissionController {
  constructor(public readonly permissionService: PermissionService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create permission' })
  @UseGuards(AdminGuard)
  @Post('create-permission')
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: PermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    return await this.permissionService.create(userData, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get permission' })
  @Get('get-permission')
  async getAllPermissions(): Promise<PermissionEntity[]> {
    return await this.permissionService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get permission by name' })
  @Get(':name')
  async getPermissionByName(
    @Param('name') name: string,
  ): Promise<PermissionEntity> {
    const permission = await this.permissionService.findOneByName(name);
    if (!permission) {
      throw new NotFoundException(`Permission with name '${name}' not found`);
    }
    return permission;
  }
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete permission' })
  @Delete('delete-permission/:idPermission')
  async deletePermissions(
      @Param('idPermission') idPermission: string,
  ): Promise<void> {
    return await this.permissionService.deletePermissions(idPermission);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create grant permission' })
  @Post(':userId/grant/:permissionName')
  async grantPermission(
    @Param('userId') userId: string,
    @Param('permissionName') permissionName: string,
  ): Promise<void> {
    await this.permissionService.grantPermission(userId, permissionName);
  }
}
