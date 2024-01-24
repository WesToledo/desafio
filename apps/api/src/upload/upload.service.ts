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

  async runScript(filesNames: string[]) {
    function runPy() {
      return new Promise(async function (resolve, reject) {
        const options: Options = {
          mode: 'text',
          pythonOptions: ['-u'],
          scriptPath: path.resolve(__dirname, '../../', 'src/reader'), //Path to your script
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
        resolve(response);
      });
    }

    return runMain();
  }
}
