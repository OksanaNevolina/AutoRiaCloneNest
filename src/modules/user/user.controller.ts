import { UserService } from './services/user.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {Body, Controller, Get, Put} from '@nestjs/common';
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {IUserData} from "../auth/interfaces/user-data.interface";
import {UserResponseDto} from "./dto/response/user.response.dto";
import {UpdateUserRequestDto} from "./dto/request/update-user.request.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('me')
  public async findMe(
      @CurrentUser() userData: IUserData,
  ): Promise<UserResponseDto> {
    return await this.userService.findMe(userData);
  }
  @ApiBearerAuth()
  @Put('me')
  public async updateMe(
      @CurrentUser() userData: IUserData,
      @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMe(userData, dto);
  }
}
