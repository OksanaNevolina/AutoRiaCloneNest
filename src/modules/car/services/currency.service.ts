import axios from "axios";
import {Injectable, Logger} from "@nestjs/common";
import { CurrencyRateEntity } from "../../../database/entities/currency-rate.entity";
import { CurrencyRateRepository } from "../../repository/services/currency-rate.repository";
import { Cron } from '@nestjs/schedule';
import {CurrencyEnum} from "../enums/currency.enum";

@Injectable()
export class CurrencyService {
    constructor(

        private readonly currencyRateRepository: CurrencyRateRepository,
    ) {}

    @Cron("44 17 * * *")
    public async getCurrencyRatesWithApi(): Promise<void> {
        try {
            const response = await axios.get(
                "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5",
            );
            const currencyRates = response.data;
            Logger.log(currencyRates)
            await this.updateCurrencyRates(currencyRates);
            Logger.log(currencyRates)

            console.log("Currency rates updated successfully.");
        } catch (error) {
            console.error("Error updating currency rates:", error.message);
        }
    }
    async updateCurrencyRates(currencyRates: CurrencyRateEntity[]): Promise<void> {
        for (const rate of currencyRates) {
            const existingRate = await this.currencyRateRepository.findOneBy({ ccy: rate.ccy });

            if (existingRate) {
                existingRate.buy = rate.buy;
                existingRate.sale = rate.sale;
                existingRate.updated = new Date();
                await this.currencyRateRepository.save(existingRate);
            } else {
                await this.currencyRateRepository.save(rate);
            }
        }
    }

    async getCurrencyRate(currencyCode: CurrencyEnum): Promise<CurrencyRateEntity | undefined> {
      return await this.currencyRateRepository.findOneBy({ ccy:currencyCode });
    }
}