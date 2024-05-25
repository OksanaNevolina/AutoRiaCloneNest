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
import { DealerService } from './services/dealer.service';
import { CreateDealerDto } from './dto/request/сreate.dealer.dto';
import { UpdateDealerDto } from './dto/request/update.dealer.dto';
import {DealerEntity} from "../../database/entities/dealer.entity";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {IUserData} from "../auth/interfaces/user-data.interface";

@ApiTags('Dealers')
@Controller('dealers')
export class DealerController {
  constructor(private readonly dealerService: DealerService) {}

  @ApiOperation({ summary: 'Create dealer' })
  @ApiBearerAuth()
  @Post('create')
  create(
      @Body() createDealerDto: CreateDealerDto,
      @CurrentUser()userData:IUserData
  ):Promise<DealerEntity> {
    return this.dealerService.create(createDealerDto,userData);
  }

  @ApiOperation({ summary: 'Get dealer by id' })
  @ApiBearerAuth()
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
