import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTransactionDTO } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  createMany(data: CreateTransactionDTO[]) {
    return this.prisma.transaction.createMany({
      data,
    });
  }

  list() {
    return this.prisma.transaction.findMany({
      where: {},
    });
  }
}
