/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import {
  Errors,
  ValidationException,
} from '@src/common/exceptions/validation.exception';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, _) {
    const { error } = this.schema.validate(value);

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        error: err.message,
      })) as Errors[];

      throw new ValidationException(errors);
    }

    return value;
  }
}
