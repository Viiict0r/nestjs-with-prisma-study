import * as Joi from 'joi';

export const CreateSessionSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
  .prefs({
    abortEarly: false,
  })
  .messages({
    'string.email': 'errors.validation.invalid_email',
    'any.required': 'errors.validation.field_required',
  });
