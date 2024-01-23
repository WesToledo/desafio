import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import * as path from 'path';

import * as fs from 'fs';
import { Options, PythonShell } from 'python-shell';
import { CreateTransactionDTO } from 'src/transaction/dto/transaction.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { ResponseScript } from './upload.controller';

@Injectable()
export class UploadService {
  constructor(private transactionService: TransactionService) {}

  async runOCRScript(filesNames: string[]) {
    function runPy() {
      return new Promise(async function (resolve, reject) {
        const options: Options = {
          mode: 'text',
          pythonOptions: ['-u'],
          scriptPath: path.resolve(__dirname, '../../', 'src/scrapper'), //Path to your script
          args: [JSON.stringify(filesNames)], //Approach to send JSON as when I tried 'json' in mode I was getting error.
        };

        await PythonShell.run('script.py', options).then((results) => {
          // DEBUG
          // for (let i of results) {
          //   console.log(i, '---->', typeof i);
          // }

          // try {
          //   console.log(results[0]);
          // } catch (err) {
          //   console.log('err = ', err);
          // }
          resolve(results[0]);
        });
      });
    }

    function runMain() {
      return new Promise(async function (resolve, reject) {
        const r = await runPy();
        const response = JSON.parse(JSON.stringify(r.toString()));
        // console.log(JSON.parse(JSON.stringify(r.toString())));
        resolve(response);
      });
    }

    return runMain();
  }

  // async computeData(response: ResponseScript[]) {
  //   const s3 = new S3();
  //   await Promise.all(
  //     response.map(({ file_name, result }) => {
  //       return new Promise(async function (resolve, reject) {
  //         try {
  //           const buffer = await fs.readFileSync(
  //             path.resolve(__dirname, '../../', 'src/arquives', file_name),
  //           );

  //           const uploadResult = await s3
  //             .upload({
  //               Bucket: process.env.AWS_BUCKET_NAME,
  //               Body: buffer,
  //               Key: `${file_name}`,
  //             })
  //             .promise();

  //           const {} = result;

  //           // const storage = await service.create();

  //           await fs.unlinkSync(
  //             path.resolve(__dirname, '../../', 'src/arquives', file_name),
  //           );
  //         } catch (err) {
  //           console.log(err);
  //         }

  //         resolve(1);
  //       });
  //     }),
  //   );
  // }
}
