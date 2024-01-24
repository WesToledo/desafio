import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UploadService } from './upload.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { CreateTransactionDTO } from 'src/transaction/dto/transaction.dto';

export interface ResponseScript {
  billAmount: string;
  billInterval: string;
  dateInit: string;
  status: string;
  statusUpdateDate: string;
  cancelDate: string;
  value: string;
  nextCicle: string;
  code: string;
}

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post('/')
  @UseInterceptors(
    FilesInterceptor('files[]', 30, {
      storage: diskStorage({
        destination: path.resolve(__dirname, '../../', 'src/arquives'),
        filename: (req, file, callback) => {
          callback(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadLocalFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    files,
  ) {
    const filesNames = [];

    files.forEach((file) => {
      filesNames.push(file.filename);
    });

    const response = JSON.parse(
      (await this.uploadService.runScript(filesNames)) as string,
    ) as ResponseScript[];

    console.log('reponse', response);

    const data = response.map(
      ({
        billAmount,
        billInterval,
        cancelDate,
        code,
        dateInit,
        nextCicle,
        status,
        statusUpdateDate,
        value,
      }) => {
        return {
          billAmount: +billAmount,
          billInterval: +billInterval,
          dateInit: new Date(dateInit),
          code,
          cancelDate: cancelDate === 'null' ? null : new Date(cancelDate),
          nextCicle: new Date(nextCicle),
          status,
          statusUpdateDate: new Date(statusUpdateDate),
          value: parseFloat(value),
        } as CreateTransactionDTO;
      },
    );

    await this.transactionService.createMany(data);
  }
}
