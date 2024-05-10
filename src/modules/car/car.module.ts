import { Module } from '@nestjs/common';
import {CarService} from "./services/car.service";
import {EmailService} from "../auth/services/email.service";
import {CarController} from "./car.controller";
import {CurrencyService} from "./services/currency.service";
import {ProfanityService} from "./services/profanity.service";
import {S3Service} from "./services/s3.service";
import { ScheduleModule } from '@nestjs/schedule';



@Module({
    imports:  [ScheduleModule.forRoot()],
    controllers: [CarController],
    providers: [CarService,CurrencyService,ProfanityService,S3Service,EmailService],
    exports: [CarService],
})
export class CarModule {}