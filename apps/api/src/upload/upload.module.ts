import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { TransactionService } from 'src/transaction/transaction.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService, TransactionService],
  controllers: [UploadController],
  imports: [PrismaModule],
})
export class UploadModule {}
