import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [PrismaModule],
})
export class TransactionModule {}
