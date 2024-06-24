import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CarEntity } from '../../database/entities/car.entity';
import { ModelEntity } from '../../database/entities/model.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarBrandRequestDto } from './dto/request/car.brand.request.dto';
import { CarCreateRequestDto } from './dto/request/car.create.request.dto';
import { CarModelRequestDto } from './dto/request/car.model.request.dto';
import { CarReportRequestDto } from './dto/request/car.report.request.dto';
import { CarBrandResponceDto } from './dto/response/car.brand.responce.dto';
import { PremiumAccountGuard } from './guards/PremiumAccountGuard';
import { ProfanityGuard } from './guards/ProfanityGuard';
import { CarMapper } from './services/car.mapper';
import { CarService } from './services/car.service';
import { ICar } from './types/car.type';
import { IPaginationResponseDto, IQuery } from './types/pagination.type';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  private readonly carMapper: CarMapper;
  constructor(
    private readonly carService: CarService,
    private readonly configService: ConfigService,
  ) {
    this.carMapper = new CarMapper(this.configService);
  }

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
  ): Promise<IPaginationResponseDto<ICar>> {
    const carsPaginated = await this.carService.getAllPaginated(query);
    const mapperCars = carsPaginated.data.map((car) =>
      this.carMapper.toResponseDto(car),
    );
    return { ...carsPaginated, data: mapperCars };
  }
  @SkipAuth()
  @ApiOperation({ summary: 'Get car by id' })
  @Get(':carId')
  async getCarById(@Param('carId') carId: string): Promise<CarEntity> {
    return await this.carService.getById(carId);
  }

  @ApiOperation({ summary: 'Get all models by brand' })
  @ApiBearerAuth()
  @Get('models/:brandId')
  async getAllModelsByBrand(
    @Param('brandId') brandId: string,
  ): Promise<ModelEntity[]> {
    return await this.carService.getAllModelsByBrand(brandId);
  }
  @ApiOperation({ summary: 'Report manager' })
  @ApiBearerAuth()
  @Post('report')
  async reportMissingBrandOrModel(
    @Body() dto: CarReportRequestDto,
  ): Promise<void> {
    return await this.carService.reportMissingBrandOrModel(dto);
  }

  @ApiOperation({ summary: 'Create brand' })
  @ApiBearerAuth()
  @Post('create-brand')
  async createBrand(
    @Body() dto: CarBrandRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarBrandResponceDto> {
    return await this.carService.createBrand(dto, userData);
  }

  @ApiOperation({ summary: 'Delete brand' })
  @ApiBearerAuth()
  @Delete('delete-brand/:brandId')
  async deleteBrand(@Param('brandId') brandId: string): Promise<void> {
    return await this.carService.deleteBrand(brandId);
  }

  @ApiOperation({ summary: 'Create model' })
  @ApiBearerAuth()
  @Post('model/:brandId')
  async createModel(
    @Body() dto: CarModelRequestDto,
    @CurrentUser() userData: IUserData,
    @Param('brandId') brandId: string,
  ): Promise<ModelEntity> {
    return await this.carService.createModel(dto, userData, brandId);
  }

  @ApiOperation({ summary: 'Delete model' })
  @ApiBearerAuth()
  @Delete('delete-model/:modelId')
  async deleteModel(@Param('modelId') modelId: string): Promise<void> {
    return await this.carService.deleteModel(modelId);
  }

  @ApiOperation({ summary: 'Create car' })
  @ApiBearerAuth()
  @Post('create-car')
  @UseGuards(ProfanityGuard)
  async createCarListing(
    @Body() dto: CarCreateRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<CarEntity> {
    return await this.carService.createCarListing(dto, userData);
  }

  @ApiOperation({ summary: 'Deactivation car' })
  @ApiBearerAuth()
  @Post('deactivation-car/:idCar')
  async deactivationCar(
    @CurrentUser() userData: IUserData,
    @Param('idCar') idCar: string,
  ): Promise<CarEntity> {
    return await this.carService.deactivationCar(userData, idCar);
  }

  @ApiOperation({ summary: 'Delete car' })
  @ApiBearerAuth()
  @Delete('delete-car/:idCar')
  async deleteCar(
    @CurrentUser() userData: IUserData,
    @Param('idCar') idCar: string,
  ): Promise<void> {
    return await this.carService.deleteCar(userData, idCar);
  }

  @ApiOperation({ summary: 'Upload-photos car' })
  @ApiBearerAuth()
  @Post('upload-photos/:carId')
  @UseInterceptors(FilesInterceptor('carPhotos'))
  async uploadCarPhotos(
    @UploadedFiles() carPhotos: Express.Multer.File[],
    @Param('carId') carId: string,
  ) {
    try {
      const uploadedPhotos = await this.carService.uploadCarPhotos(
        carPhotos,
        carId,
      );
      return {
        message: 'Photos uploaded successfully',
        data: uploadedPhotos,
      };
    } catch (error) {
      return {
        message: 'Error uploading car photos',
        error: error.message,
      };
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car photo' })
  @Delete('delete-photo/:carId')
  async deletePhoto(
    @Param('carId') carId: string,
    @Query('photoPath') photoPath: string,
  ): Promise<{ message: string }> {
    Logger.log(`Deleting photo for carId: ${carId}, photoPath: ${photoPath}`);
    try {
      await this.carService.deletePhotoPath(carId, photoPath);
      return { message: 'Photo deleted successfully' };
    } catch (error) {
      return { message: `Error deleting photo: ${error.message}` };
    }
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Views car' })
  @Post(':carId/views')
  async increaseViews(@Param('carId') carId: string) {
    await this.carService.increaseViews(carId);
  }

  @ApiOperation({ summary: 'Total views car' })
  @ApiBearerAuth()
  @UseGuards(PremiumAccountGuard)
  @Get(':carId/total-views')
  async getTotalViews(@Param('carId') carId: string): Promise<number> {
    return await this.carService.getTotalViews(carId);
  }

  @ApiOperation({ summary: 'Today views car' })
  @ApiBearerAuth()
  @UseGuards(PremiumAccountGuard)
  @Get(':carId/views-today')
  async getViewsToday(@Param('carId') carId: string): Promise<number> {
    return await this.carService.getViewsToday(carId);
  }

  @ApiOperation({ summary: 'This week views car' })
  @ApiBearerAuth()
  @UseGuards(PremiumAccountGuard)
  @Get(':carId/views-this-week')
  async getViewsThisWeek(@Param('carId') carId: string): Promise<number> {
    return await this.carService.getViewsThisWeek(carId);
  }

  @ApiOperation({ summary: 'This month views car' })
  @ApiBearerAuth()
  @UseGuards(PremiumAccountGuard)
  @Get(':carId/views-this-month')
  async getViewsThisMonth(@Param('carId') carId: string): Promise<number> {
    return await this.carService.getViewsThisMonth(carId);
  }

  @ApiOperation({
    summary: 'Average price by region, brand and model,currency',
  })
  @ApiBearerAuth()
  @UseGuards(PremiumAccountGuard)
  @Get('average-price/:region/:brand/:model/:currency')
  async calculateAveragePriceByRegionBrandModel(
    @Param('region') region: string,
    @Param('brand') brand: string,
    @Param('model') model: string,
    @Param('currency') currency: string,
  ): Promise<number> {
    return await this.carService.calculateAveragePriceByRegionBrandModel(
      region,
      brand,
      model,
      currency,
    );
  }

  @ApiOperation({ summary: 'Average price  by brand and model' })
  @ApiBearerAuth()
  @UseGuards(PremiumAccountGuard)
  @Get('average-price/:brand/:model/:currency')
  async getAveragePriceByBrandAndModel(
    @Param('brand') brand: string,
    @Param('model') model: string,
    @Param('currency') currency: string,
  ): Promise<number> {
    return await this.carService.getAveragePriceByBrandAndModel(
      brand,
      model,
      currency,
    );
  }
}
