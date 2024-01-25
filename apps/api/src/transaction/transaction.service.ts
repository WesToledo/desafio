import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTransactionDTO } from './dto/transaction.dto';
import e from 'express';
import { isAfter, subDays } from 'date-fns';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  createMany(data: CreateTransactionDTO[]) {
    return this.prisma.transaction.createMany({
      data,
    });
  }

  async getMonthlyRecurringRevenue() {
    const transactions = await this.prisma.transaction.findMany({
      where: {},
      orderBy: {
        dateInit: 'asc',
      },
    });

    var response = {};
    const months = {
      1: {
        value: 0,
      },
      2: {
        value: 0,
      },
      3: {
        value: 0,
      },
      4: {
        value: 0,
      },
      5: {
        value: 0,
      },
      6: {
        value: 0,
      },
      7: {
        value: 0,
      },
      8: {
        value: 0,
      },
      9: {
        value: 0,
      },
      10: {
        value: 0,
      },
      11: {
        value: 0,
      },
      12: {
        value: 0,
      },
    };

    transactions.forEach((transaction) => {
      const year = transaction.dateInit.getFullYear();

      if (!response.hasOwnProperty(year)) response[year] = months;

      if (transaction.billInterval === 365 || transaction.billAmount === 1) {
        const updatedMonth = transaction.statusUpdateDate.getMonth() + 1;

        response[year][updatedMonth].value += transaction.value;
      }

      if (transaction.billAmount > 1) {
        var lastUpdatedDate = transaction.statusUpdateDate;
        const initDate = transaction.dateInit;

        do {
          const lastUpdatedMonth = lastUpdatedDate.getMonth() + 1;
          const lastUpdatedYear = lastUpdatedDate.getFullYear();

          response[lastUpdatedYear][lastUpdatedMonth].value +=
            transaction.value;

          lastUpdatedDate = subDays(lastUpdatedDate, 30);

          // is the first date after the second one ?
        } while (isAfter(lastUpdatedDate, initDate));
      }
    });

    return response;
  }

  async getChurn() {
    const transactions = await this.prisma.transaction.findMany({
      where: {},
      orderBy: {
        dateInit: 'asc',
      },
    });

    var subscriptions = {};
    const months = {
      1: {
        totalClients: 0,
        totalCanceled: 0,
      },
      2: {
        totalClients: 0,
        totalCanceled: 0,
      },
      3: {
        totalClients: 0,
        totalCanceled: 0,
      },
      4: {
        totalClients: 0,
        totalCanceled: 0,
      },
      5: {
        totalClients: 0,
        totalCanceled: 0,
      },
      6: {
        totalClients: 0,
        totalCanceled: 0,
      },
      7: {
        totalClients: 0,
        totalCanceled: 0,
      },
      8: {
        totalClients: 0,
        totalCanceled: 0,
      },
      9: {
        totalClients: 0,
        totalCanceled: 0,
      },
      10: {
        totalClients: 0,
        totalCanceled: 0,
      },
      11: {
        totalClients: 0,
        totalCanceled: 0,
      },
      12: {
        totalClients: 0,
        totalCanceled: 0,
      },
    };

    transactions.forEach((transaction) => {
      const year = transaction.dateInit.getFullYear();

      if (!subscriptions.hasOwnProperty(year)) subscriptions[year] = months;

      const initMonth = transaction.dateInit.getMonth() + 1;

      subscriptions[year][initMonth].totalClients += 1;

      if (transaction.status === 'Cancelada') {
        const canceledYear = transaction.cancelDate.getFullYear();
        const canceledMonth = transaction.cancelDate.getMonth() + 1;

        subscriptions[canceledYear][canceledMonth].totalCanceled += 1;
      }
    });

    var churnRates = {};

    const monthChurn = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    };

    for (const year of Object.keys(subscriptions)) {
      if (!churnRates.hasOwnProperty(year)) churnRates[year] = monthChurn;

      for (let month = 2; month <= 12; month++) {
        var totalClients = 0;

        // sum of all pass clients
        for (let index = 2; index <= month; index++) {
          totalClients += subscriptions[year][index - 1].totalClients;
          totalClients -= subscriptions[year][index - 1].totalCanceled;
        }

        churnRates[year][month] = (
          (subscriptions[year][month].totalCanceled / totalClients) *
          100
        ).toFixed(2);
      }
    }

    return churnRates;
  }

  list() {
    return this.prisma.transaction.findMany({
      where: {},
    });
  }
}
