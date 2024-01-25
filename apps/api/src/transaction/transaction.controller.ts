import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('/list')
  async list() {
    return await this.transactionService.list();
  }

  @Get('/mrr')
  async getMrr() {
    return await this.transactionService.getMonthlyRecurringRevenue();
  }

  @Get('/churn')
  async getChurn() {
    return await this.transactionService.getChurn();
  }
}
