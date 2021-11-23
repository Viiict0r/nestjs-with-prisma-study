import { HttpException, HttpStatus } from '@nestjs/common';

export interface Errors {
  field: string;
  error: string;
}

export class ValidationException extends HttpException {
  constructor(errors: Errors[], message?: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: message || 'validation_failed',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
