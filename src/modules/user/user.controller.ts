import { UserService } from './services/user.service';
import { ApiTags } from '@nestjs/swagger';
import {Controller, Get} from '@nestjs/common';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async findMe(userData): Promise<any> {
    return await this.userService.findMe(userData);
  }
}
