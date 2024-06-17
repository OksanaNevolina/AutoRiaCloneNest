import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { EmailService } from '../auth/services/email.service';
import { UserService } from '../user/services/user.service';
import { CarController } from './car.controller';
import { CarService } from './services/car.service';
import { CurrencyService } from './services/currency.service';
import { FileValidationService } from './services/file.validation.service';
import { ProfanityService } from './services/profanity.service';
import { S3Service } from './services/s3.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [CarController],
  providers: [
    CarService,
    CurrencyService,
    ProfanityService,
    S3Service,
    EmailService,
    UserService,
    FileValidationService,
  ],
  exports: [CarService],
})
export class CarModule {}
