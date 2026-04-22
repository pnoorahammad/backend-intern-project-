const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000).allow('', null).optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed').optional()
});

module.exports = {
  taskSchema
};
