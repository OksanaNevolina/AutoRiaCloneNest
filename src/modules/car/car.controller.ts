import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';

import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import { BrandEntity } from '../../database/entities/brand.entity';
import { ModelEntity } from '../../database/entities/model.entity';
import { CarReportRequestDto } from './dto/request/car.report.request.dto';
import { CarCreateRequestDto } from './dto/request/car.create.request.dto';
import { CarModelRequestDto } from './dto/request/car.model.request.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarMapper } from './services/car.mapper';
import { CarBrandRequestDto } from './dto/request/car.brand.request.dto';
import { CarService } from './services/car.service';
import { ICar } from './types/car.type';
import { IPaginationResponseDto, IQuery } from './types/pagination.type';
import {CarEntity} from "../../database/entities/car.entity";
import {ProfanityGuard} from "./guards/ProfanityGuard";
import {SkipAuth} from "../auth/decorators/skip-auth.decorator";
import {CarBrandResponceDto} from "./dto/response/car.brand.responce.dto";

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiOperation({ summary: 'Get brands' })
  @ApiBearerAuth()
  @Get('brands')
  async getAllBrands(): Promise<CarBrandResponceDto[]> {
    return await this.carService.getAllBrands();
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get all cars' })
  @Get('getAll')
  async getAllPaginated(
      @Query() query: IQuery,
      @CurrentUser() userData: IUserData,
  ): Promise<IPaginationResponseDto<ICar>> {
    const carsPaginated = await this.carService.getAllPaginated(query);
    const mapperCars = carsPaginated.data.map((car) =>
        CarMapper.toResponseDto(car),
    );
    return { ...carsPaginated, data: mapperCars };
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get car by id' })
  @Get(':carId')
  async getCarById(
      @Param('carId') carId: string
  ): Promise<CarEntity> {
    return this.carService.getById(carId);
  }

  @ApiOperation({ summary: 'Get all models by brand' })
  @ApiBearerAuth()
  @Get('models/:brandId')
  async getAllModelsByBrand(
    @Param('brandId') brandId: string,
  ): Promise<ModelEntity[]> {
    return this.carService.getAllModelsByBrand(brandId);
  }
  @ApiOperation({ summary: 'Report manager' })
  @ApiBearerAuth()
  @Post('report')
  async reportMissingBrandOrModel(
    @Body() dto: CarReportRequestDto,
  ): Promise<void> {
    return this.carService.reportMissingBrandOrModel(dto);
  }

  @ApiOperation({ summary: 'Create brand' })
  @ApiBearerAuth()
  @Post('brand')
  async createBrand(@Body() dto: CarBrandRequestDto): Promise<CarBrandResponceDto> {
    return await this.carService.createBrand(dto);
  }

  @ApiOperation({ summary: 'Create model' })
  @ApiBearerAuth()
  @Post('model/:brandId')
  async createModel(
    @Body() dto: CarModelRequestDto,
    @CurrentUser() userData: IUserData,
    @Param('brandId') brandId: string
  ): Promise<ModelEntity> {
    return this.carService.createModel(dto, userData,brandId);
  }

  @ApiOperation({ summary: 'Create car' })
  @ApiBearerAuth()
  @Post('create-car')
  @UseGuards(ProfanityGuard)
  async createCarListing(
    @Body() dto: CarCreateRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarEntity> {
    return this.carService.createCarListing(dto, userData);
  }
}
