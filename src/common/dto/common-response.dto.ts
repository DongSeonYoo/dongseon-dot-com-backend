import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
  statusCode: HttpStatus;

  message: string;

  data: T;

  private constructor(status: HttpStatus, message: string, data: T) {
    this.statusCode = status;
    this.message = message;
    this.data = data;
  }

  static SUCCESS(
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.OK,
  ): ResponseEntity<string> {
    return new ResponseEntity<string>(httpStatus, message, '');
  }

  static SUCCESS_WITH<T>(data: T, message: string = ''): ResponseEntity<T> {
    return new ResponseEntity<T>(HttpStatus.OK, message, data);
  }

  static ERROR(): ResponseEntity<string> {
    return new ResponseEntity<string>(
      HttpStatus.INTERNAL_SERVER_ERROR,
      '서버에서 에러가 발생하였습니다',
      '',
    );
  }

  static ERROR_WITH(
    code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string,
  ): ResponseEntity<string> {
    return new ResponseEntity<string>(code, message, '');
  }
}
