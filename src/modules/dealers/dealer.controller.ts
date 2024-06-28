import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DealerEntity } from '../../database/entities/dealer.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UpdateDealerDto } from './dto/request/update.dealer.dto';
import { CreateDealerDto } from './dto/request/сreate.dealer.dto';
import { DealerService } from './services/dealer.service';

@ApiTags('Dealers')
@Controller('dealers')
export class DealerController {
  constructor(private readonly dealerService: DealerService) {}

  @ApiOperation({ summary: 'Create dealer' })
  @ApiBearerAuth()
  @Post('create')
  create(
    @Body() createDealerDto: CreateDealerDto,
    @CurrentUser() userData: IUserData,
  ): Promise<DealerEntity> {
    return this.dealerService.create(createDealerDto, userData);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get all' })
  @Get()
  getAll() {
    return this.dealerService.getAll();
  }
  @SkipAuth()
  @ApiOperation({ summary: 'Get dealer by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealerService.findOne(id);
  }

  @ApiOperation({ summary: 'Update dealer by id' })
  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDealerDto: UpdateDealerDto) {
    return this.dealerService.update(id, updateDealerDto);
  }

  @ApiOperation({ summary: 'Delete dealer by id' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dealerService.remove(id);
  }
}
