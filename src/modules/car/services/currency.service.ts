import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectEntityManager } from '@nestjs/typeorm';
import axios from 'axios';
import { EntityManager } from 'typeorm';

import { CurrencyRateEntity } from '../../../database/entities/currency-rate.entity';
import { CurrencyRateRepository } from '../../repository/services/currency-rate.repository';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly currencyRateRepository: CurrencyRateRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  @Cron('44 17 * * *')
  public async getCurrencyRatesWithApi(): Promise<void> {
    try {
      const response = await axios.get(
        'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      );
      const currencyRates = response.data;
      await this.updateCurrencyRates(currencyRates);
    } catch (error) {
      throw new Error('Error updating currency rates');
    }
  }
  async updateCurrencyRates(
    currencyRates: CurrencyRateEntity[],
  ): Promise<void> {
    await this.entityManager.transaction(async (em: EntityManager) => {
      const currencyRateRepository = em.getRepository(CurrencyRateEntity);
      for (const rate of currencyRates) {
        const existingRate = await this.currencyRateRepository.findOneBy({
          ccy: rate.ccy,
        });

        if (existingRate) {
          existingRate.buy = rate.buy;
          existingRate.sale = rate.sale;
          existingRate.updated = new Date();
          await currencyRateRepository.save(existingRate);
        } else {
          await currencyRateRepository.save(rate);
        }
      }
    });
  }
}
