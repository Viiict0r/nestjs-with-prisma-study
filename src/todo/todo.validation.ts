import * as Joi from 'joi';

export const CreateTodoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().min(5).max(100).required().messages({
    'string.min': 'errors.validation.todo.desc_small',
    'string.max': 'errors.validation.todo.desc_big',
  }),
})
  .prefs({
    abortEarly: false,
  })
  .messages({
    'any.required': 'errors.validation.field_required',
  });
