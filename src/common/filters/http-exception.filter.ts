import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Response } from 'express';
import { ResponseEntity } from '../dto/common-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(e: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();

    const statusCode = e.getStatus();
    let errorMessage = (e.getResponse() as Error).message;

    console.log(e);
    if (Array.isArray(errorMessage)) {
      errorMessage = errorMessage[0];
    }

    res
      .status(statusCode)
      .json(
        instanceToPlain(ResponseEntity.ERROR_WITH(statusCode, errorMessage)),
      );
  }
}
