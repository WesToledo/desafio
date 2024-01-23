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

export interface ResponseScript {}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
      (await this.uploadService.runOCRScript(filesNames)) as string,
    ) as ResponseScript[];

    // await this.uploadService.computeData(response);
  }
}
