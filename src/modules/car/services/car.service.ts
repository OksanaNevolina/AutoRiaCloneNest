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
import { UserResponseDto } from '../../user/dto/response/user.response.dto';
import { ViewLogEntity } from '../../../database/entities/viewLog.entity';

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
        relations: ['created', 'brand', 'model'],
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
    try {
      const user = await this.userRepository.findOneBy({ id: userData.userId });
      Logger.log([user.permissions])
      if (
        !user ||
        !user.permissions ||
        !user.permissions.some(
          (permission) => permission.name === Constant.CREATE_MODEL_BRAND,
        )
      ) {
        throw new Error('You do not have permission to add create-model-brand');
      }

      return await this.brandRepository.save(
        await this.brandRepository.create(dto),
      );
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async deleteBrand(brandId: string): Promise<void> {
    try {
      await this.brandRepository.delete({ id: brandId });
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async createModel(
    dto: CarModelRequestDto,
    userData: IUserData,
    brandId: string,
  ): Promise<ModelEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id: userData.userId });
      if (
        !user.permissions.some(
          (permission) => permission.name === Constant.CREATE_MODEL_BRAND,
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

      if (dto.currency === 'UAH') {
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
        await this.carRepository.save(
          this.carRepository.create({
            ...dto,
            price: basePrice,
            currencyExchangeRate: currencyExchangeRate,
            brand: { id: dto.brandId },
            model: { id: dto.modelId },
            createdBy: { id: userData.userId },
            isActive: false,
          }) as CarEntity,
        );
        await this.notifyManager(userData.userId);
        throw new ForbiddenException(
          'Ваше оголошення не пройшло модерацію через використання нецензурних слів',
        );
      }

      return await this.carRepository.save(
        this.carRepository.create({
          ...dto,
          price: basePrice,
          currencyExchangeRate: currencyExchangeRate,
          brand: { id: dto.brandId },
          model: { id: dto.modelId },
          createdBy: { id: userData.userId },
          isActive: true,
        }),
      );
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
      const car = await this.userService.findByIdOrThrow(idCar);
      car.isBanned = false;
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

  // async uploadCarPhotos(carPhotos: Array<Express.Multer.File>, carId: string) {
  //     try {
  //         const uploadedPhotos = [];
  //
  //         for (const photo of carPhotos) {
  //             const filePath = await this.s3Service.uploadFile(
  //                 photo.buffer,
  //                 photo.originalname,
  //                 photo.mimetype,
  //                 TypeFileUploadEnum.CarPhotos,
  //                 carId,
  //             );
  //             uploadedPhotos.push(filePath);
  //         }
  //
  //         const car = await this.carRepository.findOneBy({ id: carId });
  //
  //         if (car) {
  //             car.imageUrls = uploadedPhotos;
  //             await this.carRepository.save(car);
  //         }
  //
  //         return uploadedPhotos;
  //     } catch (error) {
  //         throw new Error(`Error uploading car photos: ${error.message}`);
  //     }
  // }
  //
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
        const viewLog = new ViewLogEntity(); // Створюємо новий екземпляр ViewLogEntity
        viewLog.timestamp = new Date(); // Встановлюємо поле timestamp
        car.viewsLog.push(viewLog); // Додаємо об'єкт viewLog до масиву viewsLog
        await this.carRepository.save(car);
      } else {
        throw new Error('Car not found');
      }
    } catch (error) {
      throw new Error(`Error increasing views: ${error.message}`);
    }
  }

  async getTotalViews(): Promise<number> {
    try {
      const cars = await this.carRepository.find();
      return cars.reduce((totalViews, car) => totalViews + car.views, 0);
    } catch (error) {
      throw new Error(`Error getting total views: ${error.message}`);
    }
  }

  async getViewsToday(): Promise<number> {
    try {
      const cars = await this.carRepository.find();
      const today = new Date();
      let totalViews = 0;

      for (const car of cars) {
        for (const view of car.viewsLog) {
          const viewDate = new Date(view.timestamp);
          if (viewDate.toDateString() === today.toDateString()) {
            totalViews++;
          }
        }
      }

      return totalViews;
    } catch (error) {
      throw new Error(`Error getting views today: ${error.message}`);
    }
  }

  async getViewsThisWeek(): Promise<number> {
    try {
      const cars = await this.carRepository.find();
      const today = new Date();
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      let totalViews = 0;

      for (const car of cars) {
        for (const view of car.viewsLog) {
          const viewDate = new Date(view.timestamp);
          if (viewDate >= oneWeekAgo && viewDate <= today) {
            totalViews++;
          }
        }
      }

      return totalViews;
    } catch (error) {
      throw new Error(`Error getting views this week: ${error.message}`);
    }
  }

  async getViewsThisMonth(): Promise<number> {
    try {
      const cars = await this.carRepository.find();
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      let totalViews = 0;

      for (const car of cars) {
        for (const view of car.viewsLog) {
          const viewDate = new Date(view.timestamp);
          if (viewDate >= firstDayOfMonth && viewDate <= today) {
            totalViews++;
          }
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
  ): Promise<number> {
    try {
      const carsMatchingCriteria =
        await this.carRepository.findCarsWithBrandAndModelByRegion(region);
      const filteredCars = carsMatchingCriteria.filter(
        (car) => car.brand?.name === brand && car.model?.name === model,
      );
      if (filteredCars.length === 0) {
        return 0;
      }
      const totalPrices = filteredCars.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );
      return totalPrices / filteredCars.length;
    } catch (error) {
      throw new Error(`Error calculating average price: ${error.message}`);
    }
  }

  async getAveragePriceByBrandAndModel(
    brand: string,
    model: string,
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

      const totalPrices = cars.reduce(
        (total, car) => total + parseFloat(String(car.price)),
        0,
      );
      return totalPrices / cars.length;
    } catch (error) {
      throw new Error(`Error getting average price: ${error.message}`);
    }
  }
}
