import * as Joi from 'joi';

export const CreateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'errors.validation.user.username_small',
    'string.max': 'errors.validation.user.username_long',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'errors.validation.password_small',
  }),
})
  .prefs({
    abortEarly: false,
  })
  .messages({
    'string.email': 'errors.validation.invalid_email',
    'any.required': 'errors.validation.field_required',
  });
