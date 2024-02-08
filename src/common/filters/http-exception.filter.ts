import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { ResponseEntity } from '../common-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(e: HttpException, host: ArgumentsHost) {
    console.log(e);
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();

    const statusCode = e.getStatus();
    let errorMessage = (e.getResponse() as Error).message;

    // if (Array.isArray(errorMessage)) {
    //   errorMessage = errorMessage[0];
    // }
    res
      .status(statusCode)
      .json(ResponseEntity.ERROR_WITH(statusCode, errorMessage));
  }
}
