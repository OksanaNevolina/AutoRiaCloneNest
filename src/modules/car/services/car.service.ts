import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { BrandEntity } from '../../../database/entities/brand.entity';
import { BrandRepository } from '../../repository/services/brand.repository';
import { ModelRepository } from '../../repository/services/model.repository';
import { ModelEntity } from '../../../database/entities/model.entity';
import { CarBrandRequestDto } from '../dto/request/car.brand.request.dto';
import { CarModelRequestDto } from '../dto/request/car.model.request.dto';
import { CarRepository } from '../../repository/services/car.repository';
import { CurrencyRateRepository } from '../../repository/services/currency-rate.repository';
import { CarCreateRequestDto } from '../dto/request/car.create.request.dto';
import { CarEntity } from '../../../database/entities/car.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AccountTypeEnum } from '../../../database/enums/account-type.enum';

import { CarReportRequestDto } from '../dto/request/car.report.request.dto';
import { S3Service } from './s3.service';
import { IPaginationResponseDto, IQuery } from '../types/pagination.type';

import { UserRepository } from '../../repository/services/user.repository';
import { ICar } from '../types/car.type';
import { EmailActionEnum } from '../../auth/enums/email-action.enum';
import { EmailService } from '../../auth/services/email.service';
import { CarBrandResponceDto } from '../dto/response/car.brand.responce.dto';
import { UserService } from '../../user/services/user.service';
import { ViewLogEntity } from '../../../database/entities/viewLog.entity';
import { ConstPermission } from '../../permission/constPermission/constPermission';
import { ViewLogRepository } from '../../repository/services/view-log.repository';
import { CurrencyEnum } from '../enums/currency.enum';
import { TypeFileUploadEnum } from '../enums/type-file-upload.enum';
import { FileValidationService } from './file.validation.service';

@Injectable()
export class CarService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly modelRepository: ModelRepository,
    private readonly carRepository: CarRepository,
    private readonly currencyRateRepository: CurrencyRateRepository,
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly viewLogRepository: ViewLogRepository,
    private readonly fileValidationService: FileValidationService,
  ) {}

  public async getAllPaginated(
    query: IQuery,
  ): Promise<IPaginationResponseDto<ICar>> {
    try {
      const queryString = JSON.stringify(query);
      const queryObject = JSON.parse(
        queryString.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
      );

      return await this.carRepository.getMany(queryObject);
    } catch (error) {
      throw new Error(`Error fetching paginated cars: ${error.message}`);
    }
  }

  async getById(carId: string): Promise<CarEntity> {
    try {
      return await this.carRepository.findOne({
        where: { id: carId },
        relations: ['createdBy', 'brand', 'model', 'viewsLog'],
      });
    } catch (error) {
      throw new Error(`Error fetching car by ID ${carId}: ${error.message}`);
    }
  }

  public async getAllBrands(): Promise<CarBrandResponceDto[]> {
    try {
      return await this.brandRepository.find();
    } catch (error) {
      throw new Error(`Error fetching brands: ${error.message}`);
    }
  }

  async getAllModelsByBrand(brandId: string): Promise<ModelEntity[]> {
    try {
      return await this.modelRepository.find({
        where: { brand: { id: brandId } },
      });
    } catch (error) {
      throw new Error(
        `Error fetching models for brand ID ${brandId}: ${error.message}`,
      );
    }
  }

  async reportMissingBrandOrModel(dto: CarReportRequestDto): Promise<void> {
    try {
      const { model, brand } = dto;
      const message = model
        ? `Missing model '${model}' for brand '${brand}'`
        : `Missing brand '${brand}'`;

      Logger.warn(message);

      const context = {
        model,
        brand,
      };

      const recipientEmail = 'onevolina5@gmail.com';
      await this.emailService.sendMail(
        recipientEmail,
        EmailActionEnum.REPORT,
        context,
      );
    } catch (error) {
      throw new Error(`Failed to report missing brand/model: ${error.message}`);
    }
  }

  async createBrand(
    dto: CarBrandRequestDto,
    userData: IUserData,
  ): Promise<BrandEntity> {
    const userId = userData.userId;
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.permissions', 'permission')
        .where('user.id = :userId', { userId })
        .getOne();

      if (
        !user.permissions ||
        !user.permissions.some(
          (permission) =>
            permission.name === ConstPermission.CREATE_MODEL_BRAND,
        )
      ) {
        throw new Error('You do not have permission to add create-model-brand');
      }

      return await this.brandRepository.save(this.brandRepository.create(dto));
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async deleteBrand(brandId: string): Promise<void> {
    try {
      await this.modelRepository.deleteMany(brandId);
      await this.brandRepository.deleteOne(brandId);
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async createModel(
    dto: CarModelRequestDto,
    userData: IUserData,
    brandId: string,
  ): Promise<ModelEntity> {
    const userId = userData.userId;
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.permissions', 'permission')
        .where('user.id = :userId', { userId })
        .getOne();

      if (
        !user.permissions ||
        !user.permissions.some(
          (permission) =>
            permission.name === ConstPermission.CREATE_MODEL_BRAND,
        )
      ) {
        throw new Error('You do not have permission to add create-model-brand');
      }

      const { name } = dto;

      const brand = await this.brandRepository.findOneBy({ id: brandId });
      if (!brand) {
        throw new Error(`Brand with ID ${brandId} not found`);
      }
      const newModel = this.modelRepository.create({
        name,
        brand,
      });

      return await this.modelRepository.save(newModel);
    } catch (error) {
      throw new Error(`Error creating model: ${error.message}`);
    }
  }

  async deleteModel(modelId: string): Promise<void> {
    try {
      await this.brandRepository.delete({ id: modelId });
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async createCarListing(
    dto: CarCreateRequestDto,
    userData: IUserData,
  ): Promise<CarEntity> {
    try {
      if (userData.accountType === AccountTypeEnum.BASE) {
        const userCarsCount = await this.carRepository.count({
          where: { createdBy: { id: userData.userId } },
        });

        if (userCarsCount >= 1) {
          throw new ForbiddenException(
            'Ви маєте базовий тим акаунту, який дозволяє розмістити лише 1 безкоштовне оголошення',
          );
        }
      }

      let basePrice: number;
      let currencyExchangeRate: number;

      if (dto.currency === CurrencyEnum.UAH) {
        basePrice = dto.price;
      } else {
        const currencyRate = await this.currencyRateRepository.findOne({
          where: { ccy: dto.currency },
        });

        if (!currencyRate) {
          throw new Error(`Currency rate for ${dto.currency} not found.`);
        }

        basePrice = dto.price / currencyRate.buy;
        currencyExchangeRate = currencyRate.buy;
      }

      const attemptsCount = await this.getProfanityAttemptsCount(dto.modelId);
      if (attemptsCount >= 3) {
        const carEntity = this.carRepository.create({
          ...dto,
          price: basePrice,
          currencyExchangeRate: currencyExchangeRate,
          brand: { id: dto.brandId },
          model: { id: dto.modelId },
          createdBy: { id: userData.userId },
          isActive: false,
        }) as CarEntity;

        const user = await this.userRepository.findOne({
          where: { id: userData.userId },
          relations: ['dealer'],
        });

        if (user.dealer) {
          carEntity.dealer = user.dealer;
        }

        await this.notifyManager(userData.userId);
        throw new ForbiddenException(
          'Ваше оголошення не пройшло модерацію через використання нецензурних слів',
        );
      }
      const carEntity = this.carRepository.create({
        ...dto,
        price: basePrice,
        currencyExchangeRate: currencyExchangeRate,
        brand: { id: dto.brandId },
        model: { id: dto.modelId },
        createdBy: { id: userData.userId },
        isActive: true,
      }) as CarEntity;

      const user = await this.userRepository.findOne({
        where: { id: userData.userId },
        relations: ['dealer'],
      });

      if (user.dealer) {
        carEntity.dealer = user.dealer;
      }

      return await this.carRepository.save(carEntity);
    } catch (error) {
      throw new Error(`Error creating car listing: ${error.message}`);
    }
  }
  async deactivationCar(
    userData: IUserData,
    idCar: string,
  ): Promise<CarEntity> {
    try {
      await this.userService.findByIdOrThrow(userData.userId);
      const car = await this.carRepository.findOneBy({ id: idCar });
      car.isActive = false;

      return await this.carRepository.save(car);
    } catch (error) {
      throw new Error(`Error unbanning user: ${error.message}`);
    }
  }

  async deleteCar(userData: IUserData, idCar: string): Promise<void> {
    try {
      await this.userService.findByIdOrThrow(userData.userId);
      await this.carRepository.delete({ id: idCar });
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async uploadCarPhotos(carPhotos: Array<Express.Multer.File>, carId: string) {
    try {
      await this.fileValidationService.validateFiles(carPhotos);

      const uploadedPhotos = [];

      for (const photo of carPhotos) {
        const filePath = await this.s3Service.uploadFile(
          photo,
          TypeFileUploadEnum.CarPhotos,
          carId,
        );
        uploadedPhotos.push(filePath);
      }

      const car = await this.carRepository.findOneBy({ id: carId });

      if (car) {
        car.imageUrls = uploadedPhotos;
        await this.carRepository.save(car);
      }

      return uploadedPhotos;
    } catch (error) {
      throw new Error(`Error uploading car photos: ${error.message}`);
    }
  }
  async deletePhotoPath(carId: string, photoPath: string): Promise<void> {
    try {
      const decodedPhotoPath = decodeURIComponent(photoPath);

      await this.s3Service.deleteFile(decodedPhotoPath);

      const car = await this.carRepository.findOneBy({ id: carId });
      if (!car.imageUrls) {
        return;
      }

      car.imageUrls = car.imageUrls.filter((url) => url !== decodedPhotoPath);
      await this.carRepository.save(car);
    } catch (error) {
      throw new Error(`Error deleting photo path: ${error.message}`);
    }
  }

  // async deletePhotoPath(carId: string, photoPath: string): Promise<void> {
  //     try {
  //         await this.s3Service.deleteFile(photoPath);
  //         const car = await this.carRepository.findOneBy({ id: carId });
  //         if (!car.imageUrls) {
  //             return;
  //         }
  //
  //         car.imageUrls = car.imageUrls.filter((url) => url !== photoPath);
  //         await this.carRepository.save(car);
  //     } catch (error) {
  //         throw new Error(`Error deleting photo path: ${error.message}`);
  //     }
  // }

  private readonly profanityAttempts: Map<string, number> = new Map<
    string,
    number
  >();

  async recordProfanityAttempt(modelId: string): Promise<void> {
    try {
      const attempts = this.profanityAttempts.get(modelId) || 0;
      this.profanityAttempts.set(modelId, attempts + 1);
    } catch (error) {
      throw new Error(`Error recording profanity attempt: ${error.message}`);
    }
  }

  async getProfanityAttemptsCount(modelId: string): Promise<number> {
    try {
      return this.profanityAttempts.get(modelId) || 0;
    } catch (error) {
      throw new Error(
        `Error getting profanity attempts count: ${error.message}`,
      );
    }
  }

  async notifyManager(userId): Promise<void> {
    try {
      const context = { userId };
      const recipientEmail = 'onevolina5@gmail.com';
      await this.emailService.sendMail(
        recipientEmail,
        EmailActionEnum.VOCABULARY,
        context,
      );
      Logger.log(`Email sent successfully to ${recipientEmail}`);
    } catch (error) {
      throw new Error(`Error notifying manager: ${error.message}`);
    }
  }

  async increaseViews(carId: string) {
    try {
      const car = await this.carRepository.findOneBy({ id: carId });
      if (car) {
        car.views += 1;
        await this.carRepository.save(car);
      } else {
        throw new Error('Car not found');
      }
      const viewLog = new ViewLogEntity();
      viewLog.timestamp = new Date();
      viewLog.car = car;
      await this.viewLogRepository.save(this.viewLogRepository.create(viewLog));
    } catch (error) {
      throw new Error(`Error increasing views: ${error.message}`);
    }
  }

  async getTotalViews(carId: string): Promise<number> {
    const car = await this.carRepository.findOneBy({ id: carId });
    return car.views;
  }

  async getViewsToday(carId: string): Promise<number> {
    try {
      const car = await this.carRepository.findCarsWithViewsLog(carId);
      const today = new Date();
      let totalViews = 0;
      for (const view of car.viewsLog) {
        const viewDate = new Date(view.timestamp);
        if (viewDate.toDateString() === today.toDateString()) {
          totalViews++;
        }
      }

      return totalViews;
    } catch (error) {
      throw new Error(`Error getting views today: ${error.message}`);
    }
  }

  async getViewsThisWeek(carId: string): Promise<number> {
    try {
      const car = await this.carRepository.findCarsWithViewsLog(carId);
      const today = new Date();
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      let totalViews = 0;

      for (const view of car.viewsLog) {
        const viewDate = new Date(view.timestamp);
        if (viewDate >= oneWeekAgo && viewDate <= today) {
          totalViews++;
        }
      }
      return totalViews;
    } catch (error) {
      throw new Error(`Error getting views this week: ${error.message}`);
    }
  }

  async getViewsThisMonth(carId: string): Promise<number> {
    try {
      const car = await this.carRepository.findCarsWithViewsLog(carId);
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      let totalViews = 0;

      for (const view of car.viewsLog) {
        const viewDate = new Date(view.timestamp);
        if (viewDate >= firstDayOfMonth && viewDate <= today) {
          totalViews++;
        }
      }
      return totalViews;
    } catch (error) {
      throw new Error(`Error getting views this month: ${error.message}`);
    }
  }

  async calculateAveragePriceByRegionBrandModel(
    region: string,
    brand: string,
    model: string,
    currency: string,
  ): Promise<number> {
    try {
      const EUR = await this.currencyRateRepository.findOneBy({ ccy: 'EUR' });
      const USD = await this.currencyRateRepository.findOneBy({ ccy: 'USD' });
      if (!EUR || !EUR.sale || !USD || !USD.sale) {
        throw new Error('Currency rates are not available.');
      }

      const carsMatchingCriteria =
        await this.carRepository.findCarsWithBrandAndModelByRegion(region);
      const filteredCarsBrandAndModel = carsMatchingCriteria.filter(
        (car) => car.brand?.name === brand && car.model?.name === model,
      );
      if (filteredCarsBrandAndModel.length === 0) {
        return 0;
      }
      const filteredCarsByCurrencyEUR = filteredCarsBrandAndModel.filter(
        (car) => car.currency === 'EUR',
      );
      const filteredCarsByCurrencyUSD = filteredCarsBrandAndModel.filter(
        (car) => car.currency === 'USD',
      );
      const filteredCarsByCurrencyUAH = filteredCarsBrandAndModel.filter(
        (car) => car.currency === 'UAH',
      );

      const totalPricesEUR = filteredCarsByCurrencyEUR.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );
      const totalPricesUSD = filteredCarsByCurrencyUSD.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );
      Logger.log(totalPricesUSD);
      const totalPricesUAH = filteredCarsByCurrencyUAH.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );
      let totalPrices: number;
      switch (currency) {
        case 'EUR':
          totalPrices =
            totalPricesUAH / EUR.sale +
            (totalPricesUSD * USD.sale) / EUR.sale +
            totalPricesEUR;
          break;
        case 'USD':
          totalPrices =
            totalPricesUAH / USD.sale +
            (totalPricesEUR * EUR.sale) / USD.sale +
            totalPricesUSD;

          break;
        case 'UAH':
          totalPrices =
            totalPricesEUR * EUR.sale +
            totalPricesUSD * USD.sale +
            totalPricesUAH;

          break;
      }
      return totalPrices / filteredCarsBrandAndModel.length;
    } catch (error) {
      throw new Error(`Error calculating average price: ${error.message}`);
    }
  }

  async getAveragePriceByBrandAndModel(
    brand: string,
    model: string,
    currency: string,
  ): Promise<number> {
    try {
      const cars = await this.carRepository.find({
        where: {
          brand: { name: brand },
          model: { name: model },
        },
      });

      if (cars.length === 0) {
        return 0;
      }
      const EUR = await this.currencyRateRepository.findOneBy({ ccy: 'EUR' });
      const USD = await this.currencyRateRepository.findOneBy({ ccy: 'USD' });
      if (!EUR || !EUR.sale || !USD || !USD.sale) {
        throw new Error('Currency rates are not available.');
      }
      const filteredCarsByCurrencyEUR = cars.filter(
        (car) => car.currency === 'EUR',
      );
      const filteredCarsByCurrencyUSD = cars.filter(
        (car) => car.currency === 'USD',
      );
      const filteredCarsByCurrencyUAH = cars.filter(
        (car) => car.currency === 'UAH',
      );
      const totalEUR = filteredCarsByCurrencyEUR.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );
      const totalUSD = filteredCarsByCurrencyUSD.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );

      const totalUAH = filteredCarsByCurrencyUAH.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );
      let totalPrice: number;
      switch (currency) {
        case 'EUR':
          totalPrice =
            totalUAH / EUR.sale + (totalUSD * USD.sale) / EUR.sale + totalEUR;
          break;
        case 'USD':
          totalPrice =
            totalUAH / USD.sale + (totalEUR * EUR.sale) / USD.sale + totalUSD;

          break;
        case 'UAH':
          totalPrice = totalEUR * EUR.sale + totalUSD * USD.sale + totalUAH;

          break;
      }
      return totalPrice / cars.length;
    } catch (error) {
      throw new Error(`Error getting average price: ${error.message}`);
    }
  }
}
