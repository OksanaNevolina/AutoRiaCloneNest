import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProfanityService } from '../services/profanity.service';
import { CarCreateRequestDto } from '../dto/request/car.create.request.dto';
import { CarService } from '../services/car.service';

@Injectable()
export class ProfanityGuard implements CanActivate {
  constructor(
    private readonly profanityService: ProfanityService,
    private readonly carService: CarService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const dto: CarCreateRequestDto = request.body;

    const hasProfanity = this.profanityService.containsProfanity(
      dto.description,
    );

    if (hasProfanity) {
      await this.carService.recordProfanityAttempt(dto.modelId);
      const attemptsCount = await this.carService.getProfanityAttemptsCount(
        dto.modelId,
      );
      if (attemptsCount >= 3) {
        return true;
      }
      throw new ForbiddenException(
        'Ваше оголошення містить нецензурну лексику. Будь ласка, виправте його. У Вас є всього 3 спроби!!!',
      );
    }

    return true;
  }
}
